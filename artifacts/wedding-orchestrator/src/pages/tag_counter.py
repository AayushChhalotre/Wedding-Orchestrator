
import sys

def count_tags(filename):
    with open(filename, 'r', encoding='utf-8') as f:
        lines = f.readlines()
    
    stack = []
    for i, line in enumerate(lines):
        line_num = i + 1
        # Very simple tag finding
        pos = 0
        while True:
            start_tag = line.find('<', pos)
            if start_tag == -1:
                break
            
            end_tag = line.find('>', start_tag)
            if end_tag == -1:
                break
            
            tag_content = line[start_tag+1:end_tag].strip()
            pos = end_tag + 1
            
            if tag_content.startswith('!--') or tag_content.endswith('--'):
                continue
            
            if tag_content.endswith('/'):
                continue # self-closing
            
            if tag_content.startswith('/'):
                closing_name = tag_content[1:].split()[0]
                if stack:
                    opening_name, op_line = stack.pop()
                    if opening_name != closing_name:
                        print(f"Error: Mismatch at line {line_num}. Closing {closing_name}, but expected {opening_name} from line {op_line}")
                else:
                    print(f"Error: Extra closing tag {closing_name} at line {line_num}")
            else:
                opening_name = tag_content.split()[0]
                if not opening_name.startswith('path') and not opening_name.startswith('br') and not opening_name.startswith('img') and not opening_name.startswith('input'):
                   stack.append((opening_name, line_num))

    for name, line in stack:
        print(f"Error: Unclosed tag {name} opened at line {line}")

if __name__ == "__main__":
    count_tags(sys.argv[1])
