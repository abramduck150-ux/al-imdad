import React from 'react';
import { CommodityData } from '../types/commodity';
import { calculateMultiplier, formatCurrencyUSD } from '../utils/ladderCalculations';
import { Sparkles } from 'lucide-react';

interface CommoditySelectorProps {
  commodities: CommodityData[];
  selectedCommodityId: string;
  onSelectCommodity: (id: string) => void;
  lang: 'ar' | 'en';
}

export const CommoditySelector: React.FC<CommoditySelectorProps> = ({
  commodities,
  selectedCommodityId,
  onSelectCommodity,
  lang,
}) => {
  const isAr = lang === 'ar';

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>{isAr ? 'اختر السلعة / المورد الاستراتيجي:' : 'Select Strategic Commodity:'}</span>
        </label>
        <span className="text-xs text-slate-500">
          {commodities.length} {isAr ? 'موارد أساسية مدرجة' : 'core commodities mapped'}
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-2.5">
        {commodities.map((comm) => {
          const isSelected = comm.id === selectedCommodityId;
          const rawPrice = comm.ladder[0]?.price_per_kg_usd || 1;
          const topPrice = comm.ladder[comm.ladder.length - 1]?.price_per_kg_usd || 1;
          const maxMultiplier = calculateMultiplier(rawPrice, topPrice);

          return (
            <button
              key={comm.id}
              onClick={() => onSelectCommodity(comm.id)}
              className={`relative text-start p-2.5 sm:p-3 rounded-xl border transition-all duration-200 cursor-pointer overflow-hidden group ${
                isSelected
                  ? 'bg-slate-800/95 border-amber-500/60 ring-2 ring-amber-500/20 shadow-lg'
                  : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-800/40'
              }`}
            >
              {/* Highlight bar */}
              <div
                className={`absolute top-0 inset-x-0 h-1 transition-opacity ${
                  isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-40'
                }`}
                style={{ backgroundColor: comm.color.primary }}
              />

              <div className="flex items-start justify-between">
                <span className="text-2xl select-none" role="img" aria-label={comm.commodity}>
                  {comm.icon}
                </span>
                <span
                  className="text-[10px] font-black px-1.5 py-0.5 rounded tracking-tight"
                  style={{
                    backgroundColor: `${comm.color.primary}20`,
                    color: comm.color.primary,
                  }}
                >
                  +{maxMultiplier.toLocaleString()}x
                </span>
              </div>

              <div className="mt-2">
                <h3 className="font-bold text-sm sm:text-base text-white tracking-tight line-clamp-1">
                  {isAr ? comm.name_ar.split(' ')[0] : comm.commodity}
                </h3>
                <p className="text-[11px] text-slate-400 line-clamp-1 font-mono">
                  {isAr ? comm.commodity : comm.name_ar}
                </p>
              </div>

              <div className="mt-2.5 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
                <span className="text-slate-500">L1: {formatCurrencyUSD(rawPrice)}</span>
                <span className="text-emerald-400 font-bold">L10: {formatCurrencyUSD(topPrice)}</span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
