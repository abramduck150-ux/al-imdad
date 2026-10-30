import React, { useState } from 'react';
import { CommodityData, LadderLevel } from '../types/commodity';
import { LADDER_STAGE_CATEGORIES } from '../data/commodityData';
import {
  calculateMultiplier,
  formatCurrencyUSD,
  parseMarginPercent,
  getCompetitionMeta,
  getRiskMeta,
} from '../utils/ladderCalculations';
import { Search, ArrowUpDown, Filter, ChevronRight, Zap } from 'lucide-react';

interface LadderVisualizerProps {
  commodity: CommodityData;
  selectedLevel: number;
  onSelectLevel: (level: number) => void;
  lang: 'ar' | 'en';
}

export const LadderVisualizer: React.FC<LadderVisualizerProps> = ({
  commodity,
  selectedLevel,
  onSelectLevel,
  lang,
}) => {
  const isAr = lang === 'ar';
  const [selectedStage, setSelectedStage] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc'); // asc: L1 -> L10, desc: L10 -> L1

  const rawPrice = commodity.ladder[0]?.price_per_kg_usd || 1;

  // Filter levels
  const currentStageObj = LADDER_STAGE_CATEGORIES.find((s) => s.id === selectedStage);
  const activeLevels = currentStageObj ? currentStageObj.levels : [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  const filteredLevels = commodity.ladder
    .filter((lvl) => activeLevels.includes(lvl.level))
    .filter((lvl) => {
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        lvl.level_name.toLowerCase().includes(q) ||
        lvl.product_form.toLowerCase().includes(q) ||
        lvl.where_it_happens.toLowerCase().includes(q) ||
        lvl.who_does_it_now.toLowerCase().includes(q) ||
        lvl.opportunity_gap.toLowerCase().includes(q)
      );
    })
    .sort((a, b) => (sortOrder === 'asc' ? a.level - b.level : b.level - a.level));

  return (
    <div className="bg-slate-900/80 rounded-2xl border border-slate-800 p-4 sm:p-5 flex flex-col h-full shadow-xl">
      {/* Visualizer Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xl">{commodity.icon}</span>
            <h2 className="text-lg font-black text-white">
              {isAr ? `سلم القيمة المضافة: ${commodity.name_ar}` : `${commodity.commodity} Value Ladder`}
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            {isAr
              ? 'تدرج القيمة من المادة الخام إلى الأصول الرقمية والملكية الفكرية'
              : 'Ascending hierarchy from raw commodity to high-tech IP & platforms'}
          </p>
        </div>

        {/* Sort toggle & Count */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700/80 transition"
            title={isAr ? 'عكس الترتيب' : 'Toggle Ascending/Descending'}
          >
            <ArrowUpDown className="w-3.5 h-3.5 text-amber-400" />
            <span>
              {sortOrder === 'asc'
                ? isAr
                  ? 'من الخام للقمة (1-10)'
                  : 'L1 → L10'
                : isAr
                ? 'من القمة للخام (10-1)'
                : 'L10 → L1'}
            </span>
          </button>
        </div>
      </div>

      {/* Stage Categories Filter Pills */}
      <div className="flex items-center gap-1.5 py-3 overflow-x-auto scrollbar-none border-b border-slate-800/60">
        <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1 shrink-0 me-1">
          <Filter className="w-3 h-3" />
          <span>{isAr ? 'المرحلة:' : 'Tier:'}</span>
        </span>
        {LADDER_STAGE_CATEGORIES.map((stage) => {
          const isActive = selectedStage === stage.id;
          return (
            <button
              key={stage.id}
              onClick={() => setSelectedStage(stage.id)}
              className={`text-xs px-2.5 py-1 rounded-lg font-medium whitespace-nowrap transition cursor-pointer ${
                isActive
                  ? 'bg-amber-500 text-slate-950 font-bold shadow'
                  : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700 hover:text-white'
              }`}
            >
              {isAr ? stage.label_ar : stage.label_en}
            </button>
          );
        })}
      </div>

      {/* Search Bar */}
      <div className="pt-3 pb-2">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-500 absolute top-2.5 start-3 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={
              isAr
                ? 'ابحث في أشكال المنتجات، المواقع، أو فجوات الفرص (مثال: نانو، بورتسودان، شاي)...'
                : 'Search products, locations, opportunities (e.g. nano, concentrate)...'
            }
            className="w-full bg-slate-950/70 border border-slate-800 rounded-xl ps-9 pe-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500/70 focus:ring-1 focus:ring-amber-500/50 transition"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute top-2 end-3 text-xs text-slate-500 hover:text-slate-300"
            >
              ×
            </button>
          )}
        </div>
      </div>

      {/* 10-Level Stepped List */}
      <div className="flex-1 overflow-y-auto space-y-2 pe-1 mt-2">
        {filteredLevels.length === 0 ? (
          <div className="text-center py-10 text-slate-500 text-xs">
            {isAr ? 'لا توجد مستويات مطابقة لمعايير البحث' : 'No levels match the filter criteria'}
          </div>
        ) : (
          filteredLevels.map((lvl) => {
            const isSelected = lvl.level === selectedLevel;
            const multiplier = calculateMultiplier(rawPrice, lvl.price_per_kg_usd);
            const marginNum = parseMarginPercent(lvl.margin_percent);
            const compMeta = getCompetitionMeta(lvl.competition_level);
            const riskMeta = getRiskMeta(lvl.risk_level);

            return (
              <div
                key={lvl.level}
                onClick={() => onSelectLevel(lvl.level)}
                className={`relative group p-3 sm:p-3.5 rounded-xl border transition-all duration-200 cursor-pointer ${
                  isSelected
                    ? 'bg-slate-800/90 border-amber-500/60 ring-2 ring-amber-500/20 shadow-lg'
                    : 'bg-slate-950/40 border-slate-800/80 hover:bg-slate-800/40 hover:border-slate-700'
                }`}
              >
                {/* Level Tag & Multiplier Ribbon */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span
                      className={`inline-flex items-center justify-center w-7 h-7 rounded-lg text-xs font-black shadow-sm ${
                        lvl.level >= 8
                          ? 'bg-gradient-to-tr from-purple-600 to-pink-500 text-white'
                          : lvl.level >= 5
                          ? 'bg-gradient-to-tr from-amber-500 to-orange-500 text-slate-950'
                          : lvl.level >= 3
                          ? 'bg-gradient-to-tr from-emerald-600 to-teal-500 text-white'
                          : 'bg-slate-800 text-slate-300'
                      }`}
                    >
                      {lvl.level}
                    </span>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs uppercase tracking-wider text-slate-200">
                          {lvl.level_name}
                        </span>
                        {lvl.level === 1 && (
                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-400 font-mono">
                            {isAr ? 'خط الأساس' : 'Baseline'}
                          </span>
                        )}
                        {lvl.level === 6 && (
                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                            <Zap className="w-2.5 h-2.5" />
                            {isAr ? 'فرصة ذهبية' : 'Sweet Spot'}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Price & Multiplier */}
                  <div className="text-end">
                    <div className="font-black text-sm text-emerald-400 font-mono">
                      {formatCurrencyUSD(lvl.price_per_kg_usd)}
                      <span className="text-[10px] font-normal text-slate-500 ms-0.5">/kg</span>
                    </div>
                    <div className="text-[11px] font-bold text-amber-400">
                      {multiplier > 1 ? `+${multiplier.toLocaleString()}x` : '1x (Raw)'}
                    </div>
                  </div>
                </div>

                {/* Product Form Description */}
                <p className="mt-2 text-xs sm:text-sm text-slate-300 font-medium line-clamp-2">
                  {lvl.product_form}
                </p>

                {/* Key Metrics Chips */}
                <div className="mt-2.5 pt-2 border-t border-slate-800/60 flex flex-wrap items-center justify-between gap-1.5 text-[11px]">
                  <div className="flex items-center gap-1.5">
                    <span className="text-slate-400">{isAr ? 'الهامش:' : 'Margin:'}</span>
                    <span
                      className={`font-bold font-mono px-1.5 py-0.5 rounded ${
                        marginNum >= 100
                          ? 'bg-emerald-500/15 text-emerald-300'
                          : marginNum >= 30
                          ? 'bg-amber-500/15 text-amber-300'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {lvl.margin_percent}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <span className={`px-1.5 py-0.5 rounded text-[10px] border ${compMeta.color}`}>
                      {compMeta.label.split(' ')[0]}
                    </span>
                    <span className={`px-1.5 py-0.5 rounded text-[10px] border ${riskMeta.color}`}>
                      {riskMeta.label}
                    </span>
                  </div>
                </div>

                {/* Visual Active Indicator */}
                {isSelected && (
                  <div className="absolute top-1/2 -end-1 -translate-y-1/2 hidden md:block">
                    <div className="h-6 w-1 bg-amber-400 rounded-full shadow-lg shadow-amber-400/50" />
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
