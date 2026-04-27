import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Target, Info, AlertCircle, Heart, Star, Compass, CheckCircle2, Flame, TrendingUp, TrendingDown } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { formatCurrency } from '@/lib/utils';
import { BudgetCategory } from '@/lib/models/schema';

interface BudgetRefinementModalProps {
  isOpen: boolean;
  onClose: () => void;
  category: BudgetCategory | null;
}

export const BudgetRefinementModal: React.FC<BudgetRefinementModalProps> = ({ isOpen, onClose, category }) => {
  const { updateBudgetEstimate, getSuggestedBudget, weddingInfo } = useStore();
  const [estimate, setEstimate] = useState<number>(0);
  const [priority, setPriority] = useState<BudgetCategory['priority']>('must_have');
  const [suggested, setSuggested] = useState<{ min: number; max: number }>({ min: 0, max: 0 });

  useEffect(() => {
    if (category) {
      setEstimate(category.customEstimate || category.planned);
      setPriority(category.priority || 'must_have');
      setSuggested(getSuggestedBudget(category.name));
    }
  }, [category, getSuggestedBudget]);

  if (!category) return null;

  const handleSave = () => {
    updateBudgetEstimate(category.id, estimate, priority);
    onClose();
  };

  const isAboveRange = estimate > suggested.max;
  const isBelowRange = estimate < suggested.min;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-white/20 bg-white/10 p-8 shadow-2xl backdrop-blur-xl"
          >
            {/* Header */}
            <div className="mb-6 flex items-start justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                  <Target className="h-6 w-6 text-rose-400" />
                  Refining {category.name}
                </h2>
                <p className="text-rose-100/70">Let's set a realistic goal for your dream celebration</p>
              </div>
              <button
                onClick={onClose}
                className="rounded-full bg-white/10 p-2 text-white/70 transition-colors hover:bg-white/20 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Suggested Range Info */}
            <div className="mb-8 space-y-4">
              <div className="rounded-2xl bg-rose-500/10 p-4 border border-rose-500/20">
                <div className="flex items-center gap-2 text-rose-300 mb-1 font-medium text-xs">
                  <Info className="h-4 w-4" />
                  REALISTIC ANCHORS
                </div>
                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-white text-xl font-bold">
                      {formatCurrency(suggested.min)} — {formatCurrency(suggested.max)}
                    </p>
                    <p className="text-rose-100/50 text-[10px] mt-1">
                      Based on {weddingInfo.guests} guests in {weddingInfo.city}
                    </p>
                  </div>
                  <Compass className="w-8 h-8 text-rose-400/20" />
                </div>
              </div>

              <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
                {[
                  { label: "Lower", value: suggested.min },
                  { label: "Average", value: Math.round((suggested.min + suggested.max) / 2) },
                  { label: "Upper", value: suggested.max },
                ].map((anchor) => (
                  <button
                    key={anchor.label}
                    onClick={() => setEstimate(anchor.value)}
                    className="whitespace-nowrap rounded-xl bg-white/5 border border-white/10 px-4 py-2 text-[10px] font-bold text-rose-100/80 hover:bg-white/10 hover:border-white/20 transition-all uppercase tracking-widest"
                  >
                    Apply {anchor.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Input Section */}
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-rose-100/80 mb-2">
                  Your Rough Estimate
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-rose-300 font-bold text-xl">₹</span>
                  <input
                    type="number"
                    value={estimate}
                    onChange={(e) => setEstimate(Number(e.target.value))}
                    className="w-full rounded-2xl border border-white/10 bg-white/5 py-4 pl-10 pr-4 text-2xl font-bold text-white focus:border-rose-400/50 focus:outline-none focus:ring-2 focus:ring-rose-400/20"
                  />
                </div>
                
                {/* Visual Feedback */}
                {estimate > 0 && (
                  <div className="mt-3 flex items-center gap-2 text-sm">
                    {isAboveRange ? (
                      <div className="flex items-center gap-1.5 text-amber-400">
                        <TrendingUp className="h-4 w-4" />
                        A bit higher than average, but your vision is worth it!
                      </div>
                    ) : isBelowRange ? (
                      <div className="flex items-center gap-1.5 text-sky-400">
                        <TrendingDown className="h-4 w-4" />
                        Great value! Make sure quality matches your expectations.
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5 text-emerald-400">
                        <CheckCircle2 className="h-4 w-4" />
                        Perfectly within the realistic sweet spot.
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Priority Section */}
              <div>
                <label className="block text-sm font-medium text-rose-100/80 mb-3">
                  How important is this to you?
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { id: 'must_have', label: 'Must Have', icon: Heart, color: 'rose' },
                    { id: 'nice_to_have', label: 'Nice to Have', icon: Star, color: 'amber' },
                    { id: 'luxury', label: 'Luxury', icon: Flame, color: 'purple' },
                  ].map((p) => (
                    <button
                      key={p.id}
                      onClick={() => setPriority(p.id as any)}
                      className={`flex flex-col items-center gap-2 rounded-2xl border p-3 transition-all ${
                        priority === p.id
                          ? `border-${p.color}-400/50 bg-${p.color}-500/20 text-white`
                          : 'border-white/5 bg-white/5 text-white/50 hover:bg-white/10'
                      }`}
                    >
                      <p.icon className={`h-5 w-5 ${priority === p.id ? `text-${p.color}-400` : ''}`} />
                      <span className="text-xs font-medium">{p.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-10 flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 rounded-2xl bg-white/5 py-4 font-semibold text-white transition-all hover:bg-white/10"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="flex-1 rounded-2xl bg-rose-500 py-4 font-semibold text-white shadow-lg shadow-rose-500/20 transition-all hover:bg-rose-400 hover:shadow-rose-400/30"
              >
                Save My Goal
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
