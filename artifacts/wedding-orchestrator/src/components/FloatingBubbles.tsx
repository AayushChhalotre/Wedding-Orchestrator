import { motion } from "framer-motion";

const bubbles = [
  { size: 100, x: "10%", y: "20%", duration: 20, delay: 0 },
  { size: 150, x: "80%", y: "10%", duration: 25, delay: 2 },
  { size: 80, x: "40%", y: "70%", duration: 18, delay: 5 },
  { size: 120, x: "70%", y: "80%", duration: 22, delay: 1 },
  { size: 200, x: "20%", y: "60%", duration: 30, delay: 3 },
];

export function FloatingBubbles() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0 opacity-30">
      {bubbles.map((bubble, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-primary/5 border border-primary/10 backdrop-blur-[2px]"
          style={{
            width: bubble.size,
            height: bubble.size,
            left: bubble.x,
            top: bubble.y,
          }}
          animate={{
            x: [0, 50, -30, 0],
            y: [0, -40, 60, 0],
            scale: [1, 1.1, 0.9, 1],
            rotate: [0, 90, 180, 0],
          }}
          transition={{
            duration: bubble.duration,
            repeat: Infinity,
            delay: bubble.delay,
            ease: "linear",
          }}
        />
      ))}
    </div>
  );
}
