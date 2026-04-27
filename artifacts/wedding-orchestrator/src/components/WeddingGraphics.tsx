import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { cn } from "@/lib/utils";

interface WeddingGraphicProps {
  type: 'ring' | 'altar' | 'invitation' | 'onboarding' | 'whatsapp';
  className?: string;
  partner1?: string;
  partner2?: string;
  date?: string;
  src?: string; // Optional custom image override
}

const RingMotif = memo(() => (
  <motion.svg 
    viewBox="0 0 200 200" 
    className="w-full h-full text-gold-400/20"
    initial={{ opacity: 0, scale: 0.8 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 2 }}
  >
    <defs>
      <linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="currentColor" stopOpacity="0.8" />
        <stop offset="50%" stopColor="currentColor" stopOpacity="0.2" />
        <stop offset="100%" stopColor="currentColor" stopOpacity="0.8" />
      </linearGradient>
    </defs>
    {/* Intertwined Rings */}
    <motion.circle 
      cx="80" cy="100" r="55" 
      stroke="url(#ringGrad)" strokeWidth="1.2" fill="none"
      animate={{ rotate: 360 }}
      transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
    />
    <motion.circle 
      cx="120" cy="100" r="55" 
      stroke="url(#ringGrad)" strokeWidth="1.2" fill="none"
      animate={{ rotate: -360 }}
      transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
    />
    {/* Floating Sparkles */}
    {[...Array(6)].map((_, i) => (
      <motion.circle
        key={i}
        cx={60 + Math.random() * 80}
        cy={60 + Math.random() * 80}
        r="1"
        fill="currentColor"
        animate={{ opacity: [0, 1, 0], scale: [0, 1.5, 0] }}
        transition={{ duration: 2 + Math.random() * 2, repeat: Infinity, delay: i * 0.5 }}
      />
    ))}
  </motion.svg>
));

const MandapMotif = memo(() => (
  <motion.svg 
    viewBox="0 0 400 300" 
    className="w-full h-full text-primary/10"
    preserveAspectRatio="xMidYMax slice"
  >
    {/* Arch Structure */}
    <path 
      d="M50 300 L50 120 Q50 50 200 50 Q350 50 350 120 L350 300" 
      stroke="currentColor" strokeWidth="2" fill="none" strokeDasharray="10 5" 
    />
    {/* Hanging Florals */}
    {[...Array(8)].map((_, i) => (
      <motion.g key={i} animate={{ y: [0, 10, 0] }} transition={{ duration: 3 + i, repeat: Infinity, ease: "easeInOut" }}>
        <line x1={80 + i * 35} y1="65" x2={80 + i * 35} y2={100 + (i % 3) * 20} stroke="currentColor" strokeWidth="0.5" />
        <circle cx={80 + i * 35} cy={100 + (i % 3) * 20} r="4" fill="currentColor" opacity="0.4" />
        <circle cx={80 + i * 35} cy={115 + (i % 3) * 20} r="3" fill="currentColor" opacity="0.3" />
      </motion.g>
    ))}
  </motion.svg>
));

const WhatsAppMotif = memo(() => (
  <div className="absolute inset-0">
    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-emerald-100/20 via-transparent to-green-100/20" />
    <div className="absolute top-1/4 left-1/4 w-32 h-32 rounded-3xl bg-emerald-200/20 blur-3xl" />
    <div className="absolute bottom-1/4 right-1/4 w-48 h-48 rounded-full bg-gold-200/10 blur-3xl animate-pulse" style={{ animationDuration: '8s' }} />
    <svg className="w-full h-full text-emerald-600/10" viewBox="0 0 100 100">
      <pattern id="chatPattern" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
        <path d="M2 10 Q2 2 10 2 L18 2 Q18 2 18 10 L18 14 L14 14 L14 18 L2 10" fill="currentColor" transform="scale(0.3) translate(10, 10)" />
      </pattern>
      <rect width="100" height="100" fill="url(#chatPattern)" />
    </svg>
    <div className="absolute inset-0 flex items-center justify-center">
      <motion.div 
        animate={{ scale: [1, 1.05, 1], opacity: [0.2, 0.4, 0.2] }}
        transition={{ duration: 4, repeat: Infinity }}
        className="w-24 h-24 border border-emerald-400/20 rounded-full"
      />
    </div>
  </div>
));

const ASSET_MAP: Record<string, string> = {
  ring: '/artifacts/wedding_rings_clean.png',
  altar: '/artifacts/wedding_mandap_clean.png',
  invitation: '/artifacts/wedding_invitation_clean.png',
  onboarding: '/artifacts/wedding_onboarding_clean.png',
  whatsapp: '/artifacts/whatsapp_import_digital_table.png',
};

export const WeddingGraphic: React.FC<WeddingGraphicProps> = ({ 
  type, 
  className = "", 
  partner1, 
  partner2, 
  date,
  src
}) => {
  const displaySrc = src || ASSET_MAP[type];

  const getOverlayStyles = () => {
    switch(type) {
      case 'ring': return 'bg-gradient-to-br from-rose-50/10 via-white/40 to-amber-50/10';
      case 'altar': return 'bg-gradient-to-tr from-stone-50/20 via-white/50 to-primary/5';
      case 'whatsapp': return 'bg-gradient-to-b from-emerald-50/20 via-white/40 to-green-50/20';
      case 'invitation': return 'bg-gradient-to-br from-indigo-50/10 via-white/50 to-rose-50/10';
      case 'onboarding': return 'bg-gradient-to-br from-[#fafafa] via-white to-[#fafafa]';
      default: return 'bg-stone-50/50';
    }
  };

  const getMotif = () => {
    switch(type) {
      case 'ring': return <RingMotif />;
      case 'altar': return <MandapMotif />;
      case 'whatsapp': return <WhatsAppMotif />;
      case 'onboarding': return <RingMotif />;
      default: return null;
    }
  };

  return (
    <div className={cn("relative overflow-hidden rounded-2xl bg-stone-50 group/graphic", className, getOverlayStyles())} style={{ transform: 'translateZ(0)', isolation: 'isolate' }}>
      {/* Background Layer: Image or Generative Motif */}
      <div className="absolute inset-0 z-0">
        {displaySrc ? (
          <motion.img 
            initial={{ scale: 1.1, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.5 }}
            src={displaySrc} 
            alt="Wedding Graphic"
            className="w-full h-full object-cover opacity-80 group-hover/graphic:opacity-100 transition-all duration-1000"
          />
        ) : (
          <div className={cn("w-full h-full flex items-center justify-center", type === 'onboarding' || type === 'whatsapp' ? "p-4" : "p-12")}>
            {getMotif()}
          </div>
        )}
      </div>
      
      {/* Texture & Depth Layer */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay bg-[url('https://www.transparenttextures.com/patterns/silk.png')]" />
      
      {/* Dynamic Text Overlay - Only shown if props provided and we're not in a higher-order component that overrides it */}
      {(partner1 || partner2 || date) && (
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none p-6 z-20">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="text-center p-8 md:p-12 bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-[3rem] shadow-[0_30px_70px_rgba(0,0,0,0.5)] ring-1 ring-white/5"
          >
            {partner1 && partner2 && type !== 'onboarding' && (
              <h2 className="font-serif-display text-4xl md:text-7xl text-foreground mb-6 leading-tight tracking-tight text-serif-gradient">
                {partner1} <span className="text-gold-500 font-light italic">&</span> {partner2}
              </h2>
            )}
            {date && (
              <div className="inline-block relative">
                <div className="absolute -inset-2 bg-gold-400/20 blur-2xl rounded-full" />
                <p className="relative font-sans tracking-[0.4em] text-[10px] md:text-xs text-gold-400 uppercase font-black py-3 px-8 rounded-full border border-gold-400/20 backdrop-blur-sm">
                  {date}
                </p>
              </div>
            )}
          </motion.div>
        </div>
      )}
      
      {/* Effects Layer */}
      {type === 'altar' && <FallingPetals count={8} />}
      
      {/* Decorative Gradient Overlay - Light and Airy */}
      <div className="absolute inset-0 bg-gradient-to-t from-white/10 via-transparent to-transparent pointer-events-none z-10" />
    </div>
  );
};

export const WeddingFloralRing: React.FC<Omit<WeddingGraphicProps, 'type'>> = (props) => (
  <WeddingGraphic type="ring" {...props} />
);

export const WeddingMandap: React.FC<Omit<WeddingGraphicProps, 'type'>> = (props) => (
  <WeddingGraphic type="altar" {...props} />
);

export const WeddingInvitation: React.FC<Omit<WeddingGraphicProps, 'type'>> = (props) => (
  <WeddingGraphic type="invitation" {...props} />
);

export const FallingPetals: React.FC<{ count?: number }> = ({ count = 20 }) => {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-30">
      {[...Array(count)].map((_, i) => (
        <Petal key={i} delay={i * 0.8} />
      ))}
    </div>
  );
};

const Petal: React.FC<{ delay: number }> = ({ delay }) => {
  const randomX = Math.random() * 100;
  const duration = 15 + Math.random() * 10; // Slower is better for performance
  const size = 8 + Math.random() * 12;
  
  return (
    <motion.div
      initial={{ 
        y: -40, 
        x: `${randomX}vw`, 
        opacity: 0,
        rotate: 0
      }}
      animate={{ 
        y: '110vh',
        opacity: [0, 0.4, 0],
        rotate: 360
      }}
      transition={{ 
        duration, 
        repeat: Infinity, 
        delay,
        ease: "linear" 
      }}
      style={{ 
        width: size, 
        height: size,
        willChange: "transform, opacity",
        position: 'absolute'
      }}
    >
      <svg viewBox="0 0 24 24" fill="none" className="w-full h-full text-rose-300/20">
        <path 
          d="M12 2C12 2 15 8 18 8C21 8 22 12 18 12C14 12 12 18 12 18C12 18 10 12 6 12C2 12 3 8 6 8C9 8 12 2 12 2Z" 
          fill="currentColor" 
        />
      </svg>
    </motion.div>
  );
};


