import sys
import re

def check_tags(filename):
    with open(filename, 'r', encoding='utf-8') as f:
        content = f.read()

    # Very simple JSX tag extractor
    # Matches <Tag, </Tag, <Tag />
    # Handles namespaces like motion.div
    tag_regex = re.compile(r'<(/?)([a-zA-Z0-9\._]+)([^>]*?)(/?)>')
    
    stack = []
    lines = content.split('\n')
    
    for i, line in enumerate(lines):
        line_num = i + 1
        # Remove comments to avoid false positives
        line = re.sub(r'\{/\*.*?\*/\}', '', line)
        line = re.sub(r'//.*', '', line)
        
        for match in tag_regex.finditer(line):
            is_closing = match.group(1) == '/'
            tag_name = match.group(2)
            is_self_closing = match.group(4) == '/'
            
            if is_self_closing:
                continue
            
            if is_closing:
                if not stack:
                    print(f"Error: Extra closing tag </{tag_name}> at line {line_num}")
                else:
                    last_tag, last_line = stack.pop()
                    if last_tag != tag_name:
                        print(f"Error: Mismatch at line {line_num}. Closing </{tag_name}>, but expected </{last_tag}> from line {last_line}")
                        # Push back to try and recover
                        # stack.append((last_tag, last_line))
            else:
                stack.append((tag_name, line_num))
                
    for tag_name, line_num in reversed(stack):
        print(f"Error: Unclosed tag <{tag_name}> from line {line_num}")

if __name__ == "__main__":
    if len(sys.argv) > 1:
        check_tags(sys.argv[1])
