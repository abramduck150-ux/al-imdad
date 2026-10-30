import React from 'react';
import { CommodityData } from '../types/commodity';
import { Play, RotateCcw, Sparkles, SlidersHorizontal, Package, DollarSign, Layers } from 'lucide-react';

interface AnalysisControlBarProps {
  commodities: CommodityData[];
  selectedPresetId: string;
  commodityName: string;
  setCommodityName: (name: string) => void;
  rawPrice: number;
  setRawPrice: (price: number) => void;
  exportTons: number;
  setExportTons: (tons: number) => void;
  selectedTier: string;
  setSelectedTier: (tier: string) => void;
  onSelectPreset: (id: string) => void;
  onRunAnalysis: () => void;
  hasRun: boolean;
  lang: 'ar' | 'en';
}

export const AnalysisControlBar: React.FC<AnalysisControlBarProps> = ({
  commodities,
  selectedPresetId,
  commodityName,
  setCommodityName,
  rawPrice,
  setRawPrice,
  exportTons,
  setExportTons,
  selectedTier,
  setSelectedTier,
  onSelectPreset,
  onRunAnalysis,
  hasRun,
  lang,
}) => {
  const isAr = lang === 'ar';

  const tonnagePresets = [
    { label: '500 طن', value: 500 },
    { label: '10,000 طن', value: 10000 },
    { label: '50,000 طن', value: 50000 },
    { label: '100,000 طن', value: 100000 },
  ];

  const tierOptions = [
    { id: 'all', label_ar: 'كافة المراحل العشرة (1 - 10)', label_en: 'All 10 Stages' },
    { id: 'early', label_ar: 'المرحلة 1-4: المعالجة الأولية والصناعية', label_en: 'Stages 1-4: Processing & B2B' },
    { id: 'consumer', label_ar: 'المرحلة 5-6: المنتجات الاستهلاكية والبراند', label_en: 'Stages 5-6: Consumer & Brands' },
    { id: 'advanced', label_ar: 'المرحلة 7-10: التجميل، النانوتك والملكية الفكرية', label_en: 'Stages 7-10: Deep Tech & IP' },
  ];

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-sm space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <span className="p-2 rounded-xl bg-slate-100 text-slate-800">
            <SlidersHorizontal className="w-5 h-5 text-emerald-600" />
          </span>
          <div>
            <h2 className="text-base sm:text-lg font-black text-slate-900">
              {isAr ? 'لوحة تحديد المعايير وتشغيل التحليل' : 'Analysis Parameters & Control Bar'}
            </h2>
            <p className="text-xs text-slate-500">
              {isAr
                ? 'اختر من القوائم الجاهزة أو اكتب بيانات مخصصة بحرية، ثم اضغط على زر تشغيل التحليل'
                : 'Select from presets or type custom values, then click Run Analysis'}
            </p>
          </div>
        </div>

        {/* Quick helper tag */}
        <span className="text-xs text-slate-500 bg-slate-50 border border-slate-200/60 px-3 py-1 rounded-full font-medium self-start sm:self-auto">
          {isAr ? 'قوائم قابلة للاختيار أو الكتابة ✍️' : 'Selectable or Editable Inputs ✍️'}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Input 1: Commodity Selection or Custom Typing */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
            <span className="flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>{isAr ? '1. السلعة / المحصول:' : '1. Commodity:'}</span>
            </span>
            <span className="text-[11px] font-normal text-slate-400">
              {isAr ? '(اختر أو اكتب)' : '(Pick or Type)'}
            </span>
          </label>

          {/* Quick Preset Selector Buttons */}
          <div className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-none">
            {commodities.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => onSelectPreset(c.id)}
                className={`text-xs px-2 py-1 rounded-lg border font-medium whitespace-nowrap transition cursor-pointer ${
                  selectedPresetId === c.id
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-300 font-bold shadow-xs'
                    : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <span>{c.icon}</span>{' '}
                <span>{isAr ? c.name_ar.split(' ')[0] : c.commodity}</span>
              </button>
            ))}
          </div>

          {/* Writable Input Box */}
          <input
            type="text"
            value={commodityName}
            onChange={(e) => setCommodityName(e.target.value)}
            placeholder={isAr ? 'أو اكتب اسم سلعة مخصصة (مثال: الفول السوداني)...' : 'Or type custom commodity...'}
            className="w-full bg-slate-50/50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-500/20 transition"
          />
        </div>

        {/* Input 2: Baseline Raw Price ($/KG) */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
            <span className="flex items-center gap-1">
              <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
              <span>{isAr ? '2. سعر الكيلو الخام (USD/kg):' : '2. Raw Baseline Price:'}</span>
            </span>
            <span className="text-[11px] font-normal text-slate-400">
              {isAr ? '(قابل للتعديل)' : '(Editable)'}
            </span>
          </label>

          {/* Presets for common prices */}
          <div className="flex items-center gap-1 pb-1">
            {[1.5, 2, 3, 10, 65000].map((pr) => (
              <button
                key={pr}
                type="button"
                onClick={() => setRawPrice(pr)}
                className={`text-xs px-2 py-1 rounded-lg border font-mono whitespace-nowrap transition cursor-pointer ${
                  rawPrice === pr
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-300 font-bold'
                    : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                }`}
              >
                ${pr >= 1000 ? `${pr / 1000}k` : pr}
              </button>
            ))}
          </div>

          <div className="relative">
            <span className="absolute inset-y-0 start-3 flex items-center text-xs text-slate-400 font-bold pointer-events-none">
              $
            </span>
            <input
              type="number"
              step="any"
              min="0.01"
              value={rawPrice}
              onChange={(e) => setRawPrice(Number(e.target.value) || 0)}
              className="w-full bg-slate-50/50 border border-slate-300 rounded-xl ps-7 pe-3 py-2 text-xs text-slate-900 font-mono font-bold focus:outline-none focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-500/20 transition"
            />
          </div>
        </div>

        {/* Input 3: Annual Volume (Metric Tons) */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
            <span className="flex items-center gap-1">
              <Package className="w-3.5 h-3.5 text-blue-600" />
              <span>{isAr ? '3. حجم الصادرات السنوية:' : '3. Annual Volume:'}</span>
            </span>
            <span className="text-[11px] font-normal text-slate-400">
              {isAr ? '(بالطن المتري)' : '(Metric Tons)'}
            </span>
          </label>

          {/* Preset Buttons */}
          <div className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-none">
            {tonnagePresets.map((tp) => (
              <button
                key={tp.value}
                type="button"
                onClick={() => setExportTons(tp.value)}
                className={`text-xs px-1.5 py-1 rounded-lg border font-mono whitespace-nowrap transition cursor-pointer ${
                  exportTons === tp.value
                    ? 'bg-blue-50 text-blue-800 border-blue-300 font-bold'
                    : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                }`}
              >
                {tp.label}
              </button>
            ))}
          </div>

          <div className="relative">
            <input
              type="number"
              min="1"
              value={exportTons}
              onChange={(e) => setExportTons(Number(e.target.value) || 0)}
              className="w-full bg-slate-50/50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 font-mono font-bold focus:outline-none focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-500/20 transition"
              placeholder="اكتب عدد الأطنان..."
            />
          </div>
        </div>

        {/* Input 4: Analysis Scope Tier */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
            <span className="flex items-center gap-1">
              <Layers className="w-3.5 h-3.5 text-purple-600" />
              <span>{isAr ? '4. نطاق مراحل التحليل:' : '4. Analysis Scope:'}</span>
            </span>
            <span className="text-[11px] font-normal text-slate-400">
              {isAr ? '(اختر النطاق)' : '(Filter)'}
            </span>
          </label>

          <select
            value={selectedTier}
            onChange={(e) => setSelectedTier(e.target.value)}
            className="w-full bg-slate-50/50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 font-medium focus:outline-none focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-500/20 transition"
          >
            {tierOptions.map((opt) => (
              <option key={opt.id} value={opt.id}>
                {isAr ? opt.label_ar : opt.label_en}
              </option>
            ))}
          </select>

          <div className="text-[11px] text-slate-400 pt-1">
            {isAr ? 'سيتم تقديم تحليل معمق لكل مرحلة مختارة' : 'In-depth analysis for each selected stage'}
          </div>
        </div>
      </div>

      {/* Prominent RUN Button Bar */}
      <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="text-xs text-slate-600 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>
            {isAr
              ? `جاهز لتحليل ${commodityName} بحجم ${exportTons.toLocaleString()} طن بسعر خام أساسي $${rawPrice}/kg`
              : `Ready to analyze ${commodityName} (${exportTons.toLocaleString()} tons @ $${rawPrice}/kg)`}
          </span>
        </div>

        <button
          onClick={onRunAnalysis}
          className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md shadow-emerald-700/20 active:scale-[0.99] transition cursor-pointer"
        >
          <Play className="w-4 h-4 fill-current" />
          <span>{isAr ? 'تشغيل التحليل الشامل (Run Analysis)' : 'Run Complete Analysis'}</span>
        </button>
      </div>
    </div>
  );
};
