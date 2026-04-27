import React from 'react';
import { motion } from 'framer-motion';
import { useStore, formatWeddingDate } from '@/store/useStore';
import { WeddingGraphic } from './WeddingGraphics';
import { Calendar, MapPin, Heart } from 'lucide-react';

export const PersonalizedBanner: React.FC = () => {
  const { weddingInfo } = useStore();
  const { 
    partner1Name, 
    partner2Name, 
    weddingDate, 
    city, 
    weddingType, 
    daysLeft 
  } = weddingInfo;

  const partner1 = partner1Name?.split(' ')[0] || "Partner 1";
  const partner2 = partner2Name?.split(' ')[0] || "Partner 2";
  const displayDate = formatWeddingDate(weddingDate);

  const getVisionMessage = () => {
    if (weddingType?.includes('Hindu')) return "A journey of seven vows and eternal love.";
    if (weddingType?.includes('Sikh')) return "A sacred union in the presence of the Guru.";
    if (weddingType?.includes('Christian')) return "A covenant of love, faith, and togetherness.";
    if (weddingType?.includes('Muslim')) return "A beautiful beginning under Allah's grace.";
    return "The most magical day of your lives is approaching.";
  };

  return (
    <div className="relative w-full h-[350px] md:h-[450px] rounded-[2.5rem] overflow-hidden shadow-2xl mb-10 group" style={{ transform: 'translateZ(0)', isolation: 'isolate' }}>
      <WeddingGraphic 
        type="altar" 
        className="w-full h-full"
      />
      
      {/* Overlay Content - Subtle and Elegant */}
      <div className="absolute inset-0 bg-gradient-to-r from-stone-50/60 via-white/40 to-transparent flex flex-col justify-end p-10 md:p-16">
        <motion.div
          initial={{ x: -40, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-2xl"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="h-px w-10 bg-gold-400" />
            <span className="text-gold-400 font-bold tracking-[0.3em] text-[10px] md:text-xs uppercase">
              {weddingType || "The Wedding Celebration"}
            </span>
          </div>
          
          <h1 className="font-serif text-5xl md:text-7xl text-stone-900 mb-6 leading-tight tracking-tight">
            {partner1} <span className="text-gold-500 font-light">&</span> {partner2}
          </h1>
          
          <p className="text-stone-600 text-lg md:text-xl font-light italic mb-10 max-w-lg border-l-2 border-gold-400/30 pl-6 leading-relaxed">
            "{getVisionMessage()}"
          </p>
          
          <div className="flex flex-wrap gap-5">
            <div className="flex items-center gap-3 bg-white/40 backdrop-blur-lg px-6 py-3 rounded-2xl border border-stone-200 shadow-sm transition-transform hover:scale-105 duration-300">
              <Calendar className="w-5 h-5 text-gold-500" />
              <span className="text-sm font-medium text-stone-700">{displayDate}</span>
            </div>
            
            <div className="flex items-center gap-3 bg-white/40 backdrop-blur-lg px-6 py-3 rounded-2xl border border-stone-200 shadow-sm transition-transform hover:scale-105 duration-300">
              <MapPin className="w-5 h-5 text-gold-500" />
              <span className="text-sm font-medium text-stone-700">{city || "Location TBD"}</span>
            </div>
            
            <div className="flex items-center gap-3 bg-gradient-to-r from-gold-500 to-gold-600 text-black px-8 py-3 rounded-2xl shadow-xl shadow-gold-500/20 font-bold transition-all hover:scale-105 active:scale-95 duration-300 group-hover:shadow-gold-500/40">
              <Heart className="w-5 h-5 fill-current" />
              <span className="text-sm">{daysLeft} Days to Go</span>
            </div>
          </div>
        </motion.div>
      </div>
      
      {/* Decorative Elements */}
      <div className="absolute top-10 right-10 hidden md:block">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          style={{ willChange: "transform" }}
          className="w-32 h-32 border border-white/10 rounded-full flex items-center justify-center"
        >
          <div className="relative">
            <div className="text-white/30 text-[9px] uppercase tracking-[0.4em] font-black text-center leading-relaxed">
              Forever<br/>&<br/>Always
            </div>
            {/* Pulsing Dot */}
            <motion.div 
              animate={{ opacity: [0.3, 0.6, 0.3] }}
              transition={{ duration: 4, repeat: Infinity }}
              className="absolute -top-4 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-gold-400 rounded-full"
              style={{ willChange: "transform, opacity" }}
            />
          </div>
        </motion.div>
      </div>
    </div>
  );
};

