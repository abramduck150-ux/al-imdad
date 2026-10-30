import React, { useState } from 'react';
import { CommodityData } from '../types/commodity';
import {
  calculateEconomicImpact,
  formatCurrencyUSD,
} from '../utils/ladderCalculations';
import {
  TrendingUp,
  DollarSign,
  Briefcase,
  Zap,
  Info,
  Sparkles,
} from 'lucide-react';

interface EconomicSimulatorProps {
  commodities: CommodityData[];
  selectedCommodityId: string;
  targetLevelNum: number;
  lang: 'ar' | 'en';
  onCommodityChange: (id: string) => void;
  onTargetLevelChange: (lvl: number) => void;
}

export const EconomicSimulator: React.FC<EconomicSimulatorProps> = ({
  commodities,
  selectedCommodityId,
  targetLevelNum,
  lang,
  onCommodityChange,
  onTargetLevelChange,
}) => {
  const isAr = lang === 'ar';
  const currentCommodity = commodities.find((c) => c.id === selectedCommodityId) || commodities[0];

  const [exportTons, setExportTons] = useState<number>(currentCommodity.typical_annual_export_tons);
  const [conversionPercent, setConversionPercent] = useState<number>(30); // 30% converted to target level

  const handleSelectCommodity = (id: string) => {
    onCommodityChange(id);
    const comm = commodities.find((c) => c.id === id);
    if (comm) {
      setExportTons(comm.typical_annual_export_tons);
    }
  };

  const rawLevel = currentCommodity.ladder[0];
  const targetLevel =
    currentCommodity.ladder.find((l) => l.level === targetLevelNum) ||
    currentCommodity.ladder[5] || // L6 default
    currentCommodity.ladder[1];

  const rawPrice = rawLevel.price_per_kg_usd;
  const targetPrice = targetLevel.price_per_kg_usd;

  const convertedTons = (exportTons * conversionPercent) / 100;
  const remainingRawTons = exportTons - convertedTons;

  const impactConverted = calculateEconomicImpact(rawPrice, targetPrice, convertedTons);

  const currentTotalRawRevenue = exportTons * 1000 * rawPrice;
  const newUpgradedRevenue = remainingRawTons * 1000 * rawPrice + impactConverted.targetRevenueUSD;
  const netSurplusAdded = newUpgradedRevenue - currentTotalRawRevenue;
  const overallMultiplier = currentTotalRawRevenue > 0 ? newUpgradedRevenue / currentTotalRawRevenue : 1;

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-5 sm:p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200">
                <TrendingUp className="w-5 h-5" />
              </span>
              <div>
                <h2 className="text-lg sm:text-xl font-black text-slate-900">
                  {isAr ? 'محاكي القيمة المضافة والأثر الاقتصادي الكلي' : 'Economic Value-Add Macro Simulator'}
                </h2>
                <p className="text-xs text-slate-500">
                  {isAr
                    ? 'احسب العائد الحقيقي للاقتصاد الوطني عند تصنيع نسبة من صادرات السودان بدلاً من بيعها كخام'
                    : 'Calculate national revenue multiplier when processing export volumes domestically'}
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start md:self-auto bg-slate-50 px-3.5 py-1.5 rounded-xl border border-slate-200">
            <span className="text-xs text-slate-500">{isAr ? 'السلعة النشطة:' : 'Active:'}</span>
            <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <span>{currentCommodity.icon}</span>
              <span>{isAr ? currentCommodity.name_ar : currentCommodity.commodity}</span>
            </span>
          </div>
        </div>
      </div>

      {/* Simulator Inputs & Configuration */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Controls Column */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4 shadow-sm">
          <h3 className="text-xs font-black text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
            <Zap className="w-4 h-4 text-emerald-600" />
            <span>{isAr ? 'إعدادات المحاكاة والسيناريو' : 'Simulation Parameters'}</span>
          </h3>

          {/* Select Commodity */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              {isAr ? '1. اختر السلعة المستهدفة:' : '1. Target Commodity:'}
            </label>
            <div className="grid grid-cols-2 gap-1.5">
              {commodities.map((c) => (
                <button
                  key={c.id}
                  onClick={() => handleSelectCommodity(c.id)}
                  className={`px-2.5 py-2 rounded-xl text-xs font-bold border flex items-center gap-1.5 transition cursor-pointer ${
                    c.id === currentCommodity.id
                      ? 'bg-emerald-50 text-emerald-900 border-emerald-300 shadow-xs'
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <span>{c.icon}</span>
                  <span className="truncate">{isAr ? c.name_ar.split(' ')[0] : c.commodity}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Export Tonnage Input & Slider */}
          <div>
            <div className="flex justify-between items-center text-xs font-bold text-slate-700 mb-1.5">
              <span>{isAr ? '2. حجم الصادرات السنوية:' : '2. Annual Export Tonnage:'}</span>
              <span className="text-emerald-700 font-mono text-xs">
                {exportTons.toLocaleString()} {isAr ? 'طن' : 'Tons'}
              </span>
            </div>
            <input
              type="range"
              min={currentCommodity.id === 'gold' ? 5 : 1000}
              max={currentCommodity.id === 'gold' ? 150 : 800000}
              step={currentCommodity.id === 'gold' ? 1 : 1000}
              value={exportTons}
              onChange={(e) => setExportTons(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-1">
              <span>{currentCommodity.id === 'gold' ? '5 طن' : '1,000 طن'}</span>
              <span>{currentCommodity.id === 'gold' ? '150 طن' : '800k طن'}</span>
            </div>
          </div>

          {/* Target Processing Level */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              {isAr ? '3. مستوى القيمة المضافة المستهدف:' : '3. Target Transformation Level:'}
            </label>
            <select
              value={targetLevel.level}
              onChange={(e) => onTargetLevelChange(Number(e.target.value))}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-emerald-500 focus:bg-white"
            >
              {currentCommodity.ladder.slice(1).map((lvl) => (
                <option key={lvl.level} value={lvl.level}>
                  L{lvl.level} - {lvl.level_name}: {formatCurrencyUSD(lvl.price_per_kg_usd)}/kg ({lvl.margin_percent} Margin)
                </option>
              ))}
            </select>
          </div>

          {/* Conversion Percentage Slider */}
          <div>
            <div className="flex justify-between items-center text-xs font-bold text-slate-700 mb-1.5">
              <span>{isAr ? '4. نسبة التحويل والتصنيع المحلي:' : '4. Domestic Processing Share:'}</span>
              <span className="text-emerald-700 font-mono text-xs">{conversionPercent}%</span>
            </div>
            <input
              type="range"
              min={5}
              max={100}
              step={5}
              value={conversionPercent}
              onChange={(e) => setConversionPercent(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
            />
          </div>
        </div>

        {/* Results & Macro Impact Column */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 flex flex-col justify-between shadow-sm space-y-5">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                <span>{isAr ? 'المخرجات والأثر المالي الكلي' : 'Financial Projections'}</span>
              </h3>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold">
                +{overallMultiplier.toFixed(1)}x {isAr ? 'مضاعفة في الدخل' : 'Jump'}
              </span>
            </div>

            {/* Main Scorecards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 mt-4">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-center">
                <span className="text-xs text-slate-500 block mb-1">
                  {isAr ? 'إيرادات التصدير الخام الحالية' : 'Baseline 100% Raw Export'}
                </span>
                <div className="text-xl sm:text-2xl font-black text-slate-800 font-mono">
                  {formatCurrencyUSD(currentTotalRawRevenue)}
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-200 text-center">
                <span className="text-xs text-emerald-800 font-bold block mb-1">
                  {isAr ? 'الإيرادات بعد التصنيع المضاف' : 'Projected Value-Added Revenue'}
                </span>
                <div className="text-xl sm:text-2xl font-black text-emerald-700 font-mono">
                  {formatCurrencyUSD(newUpgradedRevenue)}
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200 text-center">
                <span className="text-xs text-amber-800 font-bold block mb-1">
                  {isAr ? 'صافي الثروة المضافة للاقتصاد' : 'Net Added Value Surplus'}
                </span>
                <div className="text-xl sm:text-2xl font-black text-amber-700 font-mono">
                  +{formatCurrencyUSD(netSurplusAdded)}
                </div>
              </div>
            </div>

            {/* Jobs & Ripple Effects */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-3">
                <Briefcase className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-slate-800">
                    {isAr ? 'فرص عمل صناعية مباشرة وغير مباشرة' : 'Estimated Industrial Jobs'}
                  </h4>
                  <div className="text-lg font-black text-slate-900 font-mono mt-0.5">
                    ~{impactConverted.jobCreationEstimate.toLocaleString()}{' '}
                    <span className="text-xs font-normal text-slate-500">{isAr ? 'وظيفة' : 'jobs'}</span>
                  </div>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-3">
                <DollarSign className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-slate-800">
                    {isAr ? 'أثر العملات الأجنبية والاحتياطي' : 'Forex Impact on Reserves'}
                  </h4>
                  <div className="text-lg font-black text-emerald-700 font-mono mt-0.5">
                    +{formatCurrencyUSD(netSurplusAdded)}{' '}
                    <span className="text-xs font-normal text-slate-500">{isAr ? 'سنوياً' : '/ year'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Strategic Insight Takeaway */}
          <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 leading-relaxed flex items-center gap-2">
            <Info className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>
              {isAr
                ? `تحويل ${conversionPercent}% فقط من صادرات ${currentCommodity.name_ar} إلى ${targetLevel.level_name} يولد عائداً إضافياً قدره ${formatCurrencyUSD(netSurplusAdded)} دولار!`
                : `Processing just ${conversionPercent}% of ${currentCommodity.commodity} exports into ${targetLevel.level_name} yields ${formatCurrencyUSD(netSurplusAdded)} in new economic value.`}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
