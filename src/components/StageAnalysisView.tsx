import React, { useState } from 'react';
import { LadderLevel } from '../types/commodity';
import {
  calculateMultiplier,
  formatCurrencyUSD,
  formatTons,
  parseMarginPercent,
  getCompetitionMeta,
  getRiskMeta,
  calculateSweetSpotScore,
  calculateEconomicImpact,
} from '../utils/ladderCalculations';
import {
  TrendingUp,
  Award,
  Zap,
  MapPin,
  Users,
  Lightbulb,
  Briefcase,
  DollarSign,
  CheckCircle2,
  Filter,
  Search,
  Sparkles,
  ArrowUpRight,
} from 'lucide-react';

interface StageAnalysisViewProps {
  commodityName: string;
  rawPrice: number;
  exportTons: number;
  ladder: LadderLevel[];
  selectedTier: string;
  lang: 'ar' | 'en';
}

export const StageAnalysisView: React.FC<StageAnalysisViewProps> = ({
  commodityName,
  rawPrice,
  exportTons,
  ladder,
  selectedTier,
  lang,
}) => {
  const isAr = lang === 'ar';
  const [searchQuery, setSearchQuery] = useState('');
  const [activeStageFilter, setActiveStageFilter] = useState<'all' | 'sweetspot' | 'highmargin'>('all');

  // Filter ladder by tier
  const filteredByTier = ladder.filter((lvl) => {
    if (selectedTier === 'early') return lvl.level <= 4;
    if (selectedTier === 'consumer') return lvl.level === 5 || lvl.level === 6;
    if (selectedTier === 'advanced') return lvl.level >= 7;
    return true;
  });

  // Filter by search and quick badges
  const displayedLevels = filteredByTier
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
    .filter((lvl) => {
      if (activeStageFilter === 'sweetspot') return lvl.level === 4 || lvl.level === 6;
      if (activeStageFilter === 'highmargin') return parseMarginPercent(lvl.margin_percent) >= 100;
      return true;
    });

  // Global calculations for summary cards
  const baselineRevenue = exportTons * 1000 * rawPrice;
  const maxLevel = ladder[ladder.length - 1];
  const maxPrice = maxLevel ? maxLevel.price_per_kg_usd : rawPrice;
  const maxPotentialRevenue = exportTons * 1000 * maxPrice;
  const maxMultiplier = calculateMultiplier(rawPrice, maxPrice);

  // Sweet spot level recommendation (Level 6: Branded Experience)
  const sweetSpotLevel = ladder.find((l) => l.level === 6) || ladder[1];
  const sweetSpotImpact = calculateEconomicImpact(rawPrice, sweetSpotLevel.price_per_kg_usd, exportTons);

  return (
    <div className="space-y-6">
      {/* 1. Top Executive Results Card */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200">
                <TrendingUp className="w-5 h-5" />
              </span>
              <div>
                <h3 className="text-lg sm:text-xl font-black text-slate-900">
                  {isAr ? `نتائج التحليل الشامل لمورد: ${commodityName}` : `Complete Value Analysis: ${commodityName}`}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  {isAr
                    ? `تحليل سلسلة القيمة المضافة لـ ${exportTons.toLocaleString()} طن متري على امتداد 10 مستويات تصنيعية`
                    : `10-stage economic transformation analysis for ${exportTons.toLocaleString()} metric tons`}
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <span>{isAr ? 'التحليل مكتمل وجاهز' : 'Analysis Complete'}</span>
            </span>
          </div>
        </div>

        {/* 4 Scorecards Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 mt-4">
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70 text-center">
            <span className="text-xs text-slate-500 font-medium">
              {isAr ? 'عائد الخام (الوضع الراهن)' : 'Baseline Raw Value'}
            </span>
            <div className="text-xl sm:text-2xl font-black text-slate-800 font-mono mt-1">
              {formatCurrencyUSD(baselineRevenue)}
            </div>
            <span className="text-[11px] text-slate-400 mt-0.5 block">
              100% {isAr ? 'تصدير خام بسعر' : 'raw @'} ${rawPrice}/kg
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-emerald-50/60 border border-emerald-200 text-center">
            <span className="text-xs text-emerald-700 font-bold">
              {isAr ? 'أقصى عائد محتمل (L10)' : 'Max Potential (L10)'}
            </span>
            <div className="text-xl sm:text-2xl font-black text-emerald-700 font-mono mt-1">
              {formatCurrencyUSD(maxPotentialRevenue)}
            </div>
            <span className="text-[11px] text-emerald-600 font-bold mt-0.5 block">
              +{maxMultiplier.toLocaleString()}x {isAr ? 'مضاعفة في القيمة' : 'multiplier'}
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-amber-50/60 border border-amber-200 text-center">
            <span className="text-xs text-amber-800 font-bold">
              {isAr ? 'فرصة سريعة موصى بها (L6)' : 'Sweet Spot ROI (L6)'}
            </span>
            <div className="text-xl sm:text-2xl font-black text-amber-700 font-mono mt-1">
              {formatCurrencyUSD(sweetSpotImpact.targetRevenueUSD)}
            </div>
            <span className="text-[11px] text-amber-700 font-bold mt-0.5 block">
              +{formatCurrencyUSD(sweetSpotImpact.valueSurplusUSD)} {isAr ? 'فائض نقي' : 'surplus'}
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-blue-50/60 border border-blue-200 text-center">
            <span className="text-xs text-blue-700 font-bold">
              {isAr ? 'فرص العمل التقديرية' : 'Industrial Jobs'}
            </span>
            <div className="text-xl sm:text-2xl font-black text-blue-800 font-mono mt-1">
              ~{sweetSpotImpact.jobCreationEstimate.toLocaleString()}
            </div>
            <span className="text-[11px] text-blue-600 font-medium mt-0.5 block">
              {isAr ? 'وظيفة صناعية ولوجستية' : 'direct & indirect jobs'}
            </span>
          </div>
        </div>
      </div>

      {/* 2. Stage Analysis Header & Quick Filter Tools */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            {isAr ? 'تصفية المراحل:' : 'Filter Stages:'}
          </span>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setActiveStageFilter('all')}
              className={`text-xs px-2.5 py-1 rounded-lg border font-medium transition cursor-pointer ${
                activeStageFilter === 'all'
                  ? 'bg-slate-900 text-white border-slate-900 font-bold'
                  : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
              }`}
            >
              {isAr ? 'كافة المراحل' : 'All'}
            </button>
            <button
              onClick={() => setActiveStageFilter('sweetspot')}
              className={`text-xs px-2.5 py-1 rounded-lg border font-medium transition flex items-center gap-1 cursor-pointer ${
                activeStageFilter === 'sweetspot'
                  ? 'bg-amber-500 text-white border-amber-500 font-bold'
                  : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
              }`}
            >
              <Zap className="w-3 h-3" />
              <span>{isAr ? 'الفرص الذهبية (L4 & L6)' : 'Sweet Spots'}</span>
            </button>
            <button
              onClick={() => setActiveStageFilter('highmargin')}
              className={`text-xs px-2.5 py-1 rounded-lg border font-medium transition cursor-pointer ${
                activeStageFilter === 'highmargin'
                  ? 'bg-emerald-600 text-white border-emerald-600 font-bold'
                  : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
              }`}
            >
              {isAr ? 'هوامش تفوق 100%' : 'Margins > 100%'}
            </button>
          </div>
        </div>

        {/* Search inside results */}
        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute top-2.5 start-2.5 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={isAr ? 'ابحث في المخرجات، الفرص، المواقع...' : 'Search in results...'}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl ps-8 pe-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-emerald-500 focus:bg-white transition"
          />
        </div>
      </div>

      {/* 3. The 10 Stage-by-Stage Cards */}
      <div className="space-y-4">
        {displayedLevels.map((lvl) => {
          const multiplier = calculateMultiplier(rawPrice, lvl.price_per_kg_usd);
          const marginNum = parseMarginPercent(lvl.margin_percent);
          const stageTotalRevenue = exportTons * 1000 * lvl.price_per_kg_usd;
          const stageNetSurplus = stageTotalRevenue - baselineRevenue;
          const compMeta = getCompetitionMeta(lvl.competition_level);
          const riskMeta = getRiskMeta(lvl.risk_level);
          const sweetScore = calculateSweetSpotScore(lvl);

          const isSweetSpot = lvl.level === 6 || lvl.level === 4;

          return (
            <div
              key={lvl.level}
              className={`bg-white rounded-2xl border transition-all duration-200 overflow-hidden shadow-xs hover:shadow-md ${
                isSweetSpot ? 'border-amber-300 ring-1 ring-amber-200/50' : 'border-slate-200'
              }`}
            >
              {/* Card Header Strip */}
              <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/50">
                <div className="flex items-center gap-3">
                  <span
                    className={`inline-flex items-center justify-center w-9 h-9 rounded-xl text-sm font-black shadow-xs ${
                      lvl.level >= 8
                        ? 'bg-purple-600 text-white'
                        : lvl.level >= 5
                        ? 'bg-amber-500 text-slate-950 font-bold'
                        : lvl.level >= 3
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    L{lvl.level}
                  </span>

                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-sm sm:text-base text-slate-900 uppercase tracking-tight">
                        {lvl.level_name}
                      </h4>
                      {lvl.level === 1 && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-200 text-slate-700 font-bold">
                          {isAr ? 'الخام الأساسي' : 'Baseline'}
                        </span>
                      )}
                      {isSweetSpot && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-300 font-bold flex items-center gap-1">
                          <Zap className="w-3 h-3 fill-current" />
                          <span>{isAr ? 'فرصة رافعة ذهبية' : 'High ROI Sweet Spot'}</span>
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-slate-500">
                      {isAr ? `المرحلة التحويلية رقم ${lvl.level}` : `Transformation Stage ${lvl.level}`}
                    </span>
                  </div>
                </div>

                {/* Price, Multiplier & Revenue Badge */}
                <div className="flex items-center gap-4 self-start sm:self-auto text-end">
                  <div>
                    <span className="text-[11px] text-slate-400 block">{isAr ? 'سعر الكيلو' : 'Price / kg'}</span>
                    <span className="text-base sm:text-lg font-black text-emerald-700 font-mono">
                      {formatCurrencyUSD(lvl.price_per_kg_usd)}
                    </span>
                  </div>

                  <div className="border-s border-slate-200 ps-4">
                    <span className="text-[11px] text-slate-400 block">{isAr ? 'مضاعف القيمة' : 'Multiplier'}</span>
                    <span className="text-sm sm:text-base font-bold text-amber-600 font-mono">
                      {multiplier > 1 ? `+${multiplier.toLocaleString()}x` : '1x'}
                    </span>
                  </div>

                  <div className="border-s border-slate-200 ps-4">
                    <span className="text-[11px] text-slate-400 block">{isAr ? 'هامش الربح' : 'Margin'}</span>
                    <span className="text-sm sm:text-base font-bold text-rose-600 font-mono">
                      {lvl.margin_percent}
                    </span>
                  </div>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-4 sm:p-5 space-y-4">
                {/* Product Form Description */}
                <div>
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">
                    {isAr ? 'شكل المنتج ومخرجات هذه المرحلة:' : 'Product Form & Outputs:'}
                  </span>
                  <p className="text-sm font-semibold text-slate-800 leading-relaxed bg-slate-50/70 p-3 rounded-xl border border-slate-100">
                    {lvl.product_form}
                  </p>
                </div>

                {/* Economic Financial Projection for this stage */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 rounded-xl bg-emerald-50/40 border border-emerald-100 text-xs">
                  <div>
                    <span className="text-slate-500 block mb-0.5">
                      {isAr ? `إجمالي العائد عند تصنيع كامل الكمية (${exportTons.toLocaleString()} طن):` : 'Total Potential Revenue:'}
                    </span>
                    <span className="text-base font-black text-emerald-800 font-mono">
                      {formatCurrencyUSD(stageTotalRevenue)}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 block mb-0.5">
                      {isAr ? 'صافي الثروة المضافة المكتسبة فوق الخام:' : 'Net Economic Surplus Added:'}
                    </span>
                    <span className="text-base font-black text-amber-700 font-mono">
                      {stageNetSurplus > 0 ? `+${formatCurrencyUSD(stageNetSurplus)}` : '$0'}
                    </span>
                  </div>
                </div>

                {/* Where it happens & Who does it now */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70">
                    <div className="flex items-center gap-1.5 font-bold text-slate-700 mb-1">
                      <MapPin className="w-3.5 h-3.5 text-rose-500" />
                      <span>{isAr ? 'موقع التصنيع وسلسلة المعالجة:' : 'Where it happens:'}</span>
                    </div>
                    <p className="text-slate-600 font-medium">{lvl.where_it_happens}</p>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70">
                    <div className="flex items-center gap-1.5 font-bold text-slate-700 mb-1">
                      <Users className="w-3.5 h-3.5 text-blue-500" />
                      <span>{isAr ? 'الواقع الحالي (من يقوم به الآن):' : 'Who dominates now:'}</span>
                    </div>
                    <p className="text-slate-600 font-medium">{lvl.who_does_it_now}</p>
                  </div>
                </div>

                {/* THE STRATEGIC OPPORTUNITY GAP */}
                <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200">
                  <div className="flex items-center gap-1.5 text-amber-900 font-bold text-xs mb-1">
                    <Lightbulb className="w-4 h-4 text-amber-600" />
                    <span>{isAr ? 'فجوة الفرصة الضائعة والاستراتيجية المتاحة:' : 'The Strategic Opportunity Gap:'}</span>
                  </div>
                  <p className="text-xs sm:text-sm font-bold text-amber-950 leading-relaxed">
                    "{lvl.opportunity_gap}"
                  </p>
                </div>

                {/* Risk, Competition & Rating Badges */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="text-slate-500">{isAr ? 'المنافسة بالسوق:' : 'Competition:'}</span>
                    <span className={`px-2 py-0.5 rounded-full border text-[11px] font-bold ${compMeta.color}`}>
                      {compMeta.label}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-slate-500">{isAr ? 'المخاطرة الاستثمارية:' : 'Risk:'}</span>
                    <span className={`px-2 py-0.5 rounded-full border text-[11px] font-bold ${riskMeta.color}`}>
                      {riskMeta.label}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 text-slate-500">
                    <span>{isAr ? 'مؤشر الجاذبية:' : 'Opportunity Score:'}</span>
                    <strong className="text-purple-700 font-mono font-black">{sweetScore}/100</strong>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
