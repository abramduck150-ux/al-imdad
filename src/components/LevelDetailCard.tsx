import React from 'react';
import { CommodityData, LadderLevel } from '../types/commodity';
import {
  calculateMultiplier,
  formatCurrencyUSD,
  parseMarginPercent,
  getCompetitionMeta,
  getRiskMeta,
  calculateSweetSpotScore,
} from '../utils/ladderCalculations';
import {
  MapPin,
  Users,
  AlertTriangle,
  Lightbulb,
  TrendingUp,
  Percent,
  CheckCircle2,
  Play,
  Share2,
} from 'lucide-react';

interface LevelDetailCardProps {
  commodity: CommodityData;
  level: LadderLevel;
  lang: 'ar' | 'en';
  onSimulateLevel: (levelNum: number) => void;
}

export const LevelDetailCard: React.FC<LevelDetailCardProps> = ({
  commodity,
  level,
  lang,
  onSimulateLevel,
}) => {
  const isAr = lang === 'ar';
  const rawPrice = commodity.ladder[0]?.price_per_kg_usd || 1;
  const multiplier = calculateMultiplier(rawPrice, level.price_per_kg_usd);
  const marginNum = parseMarginPercent(level.margin_percent);
  const sweetSpotScore = calculateSweetSpotScore(level);
  const compMeta = getCompetitionMeta(level.competition_level);
  const riskMeta = getRiskMeta(level.risk_level);

  // Strategic implementation suggestions based on level tier
  const getStrategicRecommendations = (lvlNum: number) => {
    if (lvlNum <= 2) {
      return isAr
        ? [
            'التحول فوراً من بيع المحصول في الأرض إلى مراكز تنقية وغربلة معتمدة.',
            'الحصول على شهادات الجودة والتتبع العضوي لرفع السعر 15-30%.',
            'التوقف عن بيع المحصول بشوالات غير مصنفة والتكتل في جمعيات تسويق تفاوضية.',
          ]
        : [
            'Transition from farmgate bulk sales to certified local cleaning hubs.',
            'Acquire organic trace certifications to capture 15-30% price premium.',
            'Eliminate unclassified sacks in favor of standardized export packaging.',
          ];
    }
    if (lvlNum <= 4) {
      return isAr
        ? [
            'الاستثمار في مصانع الطحن الدقيق والتجفيف بالرذاذ (Spray Drying) لكسر الاحتكار الأجنبي.',
            'توقيع عقود توريد B2B طويلة الأجل مباشرة مع مصانع الأغذية والأدوية العالمية.',
            'تطبيق معايير ISO وHACCP لضمان مطابقة مواصفات المكونات الصناعية.',
          ]
        : [
            'Invest in domestic spray-drying and precision milling to break foreign processing monopolies.',
            'Establish multi-year direct B2B supply agreements with food & beverage conglomerates.',
            'Obtain ISO & HACCP certifications for industrial ingredient compliance.',
          ];
    }
    if (lvlNum <= 6) {
      return isAr
        ? [
            'إطلاق براند سوداني استهلاكي موثوق بهوية عصرية (مثل المشروبات الباردة والزيوت الفاخرة).',
            'التركيز على سلاسل التبريد والتغليف الجذاب الذي ينافس في رفوف السوبرماركت العالمية.',
            'استغلال قصة المنشأ السوداني الفريدة والأصلية كأعلى جودة في العالم.',
          ]
        : [
            'Launch modern direct-to-consumer branded goods (craft beverages, boutique sesame jars).',
            'Master modern shelf packaging, cold chain, and Amazon/retail distribution.',
            'Monetize the origin story: Sudan as the undisputed gold standard for natural purity.',
          ];
    }
    if (lvlNum <= 8) {
      return isAr
        ? [
            'بناء شراكات بين الجامعات ومختبرات التكنولوجيا الحيوية لاستخلاص المواد الفعالة النقية.',
            'الاستفادة من تطبيقات النانوتكنولوجي في الطاقة النظيفة ومستحضرات التجميل الحيوية.',
            'تصدير المواد الفعالة المركزة بالجرام والمليلتر بدلاً من الأطنان.',
          ]
        : [
            'Form university & biotech lab alliances to isolate high-purity active compounds.',
            'Capitalize on nanotech, clean energy dyes, and clinical cosmetics.',
            'Export active compounds measured in grams and milliliters rather than bulk metric tons.',
          ];
    }
    return isAr
      ? [
          'تسجيل براءات اختراع طبية واستخلاص دولية (IP) باسم مؤسسات ومبتكرين سودانيين.',
          'بناء منصات رقمية وحلول تتبع تعتمد على البلوكتشين لامتلاك سلسلة القيمة العالمية بالكامل.',
          'تحصيل إيرادات التراخيص الحصرية والبيانات من كبرى الشركات العالمية.',
        ]
      : [
          'Register international patents and extraction protocols under sovereign/local IP.',
          'Deploy digital traceability and exchange platforms to own the entire global supply chain.',
          'Earn recurring licensing royalties and premium data subscription revenues from multinationals.',
        ];
  };

  const recommendations = getStrategicRecommendations(level.level);

  return (
    <div className="bg-slate-900/80 rounded-2xl border border-slate-800 p-5 sm:p-6 flex flex-col justify-between shadow-xl">
      <div>
        {/* Header Ribbon */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <span
              className={`inline-flex items-center justify-center w-11 h-11 rounded-xl text-base font-black shadow-lg ${
                level.level >= 8
                  ? 'bg-gradient-to-tr from-purple-600 via-pink-600 to-amber-400 text-white shadow-purple-900/50'
                  : level.level >= 5
                  ? 'bg-gradient-to-tr from-amber-500 to-rose-500 text-slate-950 shadow-amber-900/50'
                  : 'bg-slate-800 text-slate-200'
              }`}
            >
              L{level.level}
            </span>
            <div>
              <span className="text-[11px] font-bold text-amber-400 uppercase tracking-widest">
                {level.level_name}
              </span>
              <h3 className="text-lg sm:text-xl font-black text-white tracking-tight">
                {commodity.name_ar} - المستوى {level.level}
              </h3>
            </div>
          </div>

          {/* Quick Simulation Trigger */}
          <button
            onClick={() => onSimulateLevel(level.level)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition shadow-md shadow-emerald-950/40 cursor-pointer"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>{isAr ? 'حساب الأثر في المحاكي' : 'Simulate Economic Impact'}</span>
          </button>
        </div>

        {/* Big Numbers Value Box */}
        <div className="mt-4 p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
          <div className="p-2">
            <div className="text-[11px] text-slate-400">{isAr ? 'السعر للكيلوجرام' : 'Price / KG'}</div>
            <div className="text-xl sm:text-2xl font-black text-emerald-400 font-mono mt-0.5">
              {formatCurrencyUSD(level.price_per_kg_usd)}
            </div>
            <div className="text-[10px] text-slate-500">{isAr ? 'بالدولار الأمريكي' : 'USD'}</div>
          </div>

          <div className="p-2 border-s border-slate-800/80">
            <div className="text-[11px] text-slate-400">{isAr ? 'مضاعف القيمة' : 'Multiplier'}</div>
            <div className="text-xl sm:text-2xl font-black text-amber-400 font-mono mt-0.5">
              {multiplier > 1 ? `+${multiplier.toLocaleString()}x` : '1x'}
            </div>
            <div className="text-[10px] text-slate-500">{isAr ? 'مقارنة بالخام (L1)' : 'vs Raw L1'}</div>
          </div>

          <div className="p-2 border-s border-slate-800/80">
            <div className="text-[11px] text-slate-400">{isAr ? 'هامش الربح' : 'Profit Margin'}</div>
            <div className="text-xl sm:text-2xl font-black text-rose-400 font-mono mt-0.5">
              {level.margin_percent}
            </div>
            <div className="text-[10px] text-slate-500">{isAr ? 'عائد القيمة المضافة' : 'Value add ROI'}</div>
          </div>

          <div className="p-2 border-s border-slate-800/80">
            <div className="text-[11px] text-slate-400">{isAr ? 'مؤشر الجاذبية' : 'Opportunity Score'}</div>
            <div className="text-xl sm:text-2xl font-black text-purple-400 font-mono mt-0.5">
              {sweetSpotScore}/100
            </div>
            <div className="text-[10px] text-slate-500">
              {sweetSpotScore >= 75 ? (isAr ? 'فرصة فائقة' : 'Top Tier') : (isAr ? 'معياري' : 'Standard')}
            </div>
          </div>
        </div>

        {/* Product Form Detail */}
        <div className="mt-4 p-4 rounded-xl bg-slate-800/40 border border-slate-700/60">
          <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
            {isAr ? 'شكل المنتج وطبيعة المخرجات:' : 'Product Form & Output:'}
          </label>
          <p className="text-sm sm:text-base font-semibold text-white leading-relaxed">
            {level.product_form}
          </p>
        </div>

        {/* Where it happens & Who does it now */}
        <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="p-3.5 rounded-xl bg-slate-950/40 border border-slate-800/80">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400 mb-1">
              <MapPin className="w-3.5 h-3.5 text-rose-400" />
              <span>{isAr ? 'أين وموقع التصنيع / المعالجة:' : 'Where it happens:'}</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-200 font-medium">
              {level.where_it_happens}
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950/40 border border-slate-800/80">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400 mb-1">
              <Users className="w-3.5 h-3.5 text-sky-400" />
              <span>{isAr ? 'من يقوم به حالياً (الواقع الحالي):' : 'Who dominates now:'}</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-200 font-medium">
              {level.who_does_it_now}
            </p>
          </div>
        </div>

        {/* THE STRATEGIC OPPORTUNITY GAP (Golden Highlight Card) */}
        <div className="mt-3.5 p-4 rounded-xl bg-gradient-to-r from-amber-950/40 via-amber-900/20 to-slate-900/60 border border-amber-500/40 shadow-inner">
          <div className="flex items-center gap-2 mb-1.5 text-amber-400 font-bold text-xs">
            <Lightbulb className="w-4 h-4 fill-amber-400/20" />
            <span>{isAr ? 'فجوة الفرصة الضائعة والاستراتيجية المتاحة:' : 'The Strategic Opportunity Gap:'}</span>
          </div>
          <p className="text-sm sm:text-base font-bold text-amber-100 leading-snug">
            "{level.opportunity_gap}"
          </p>
        </div>

        {/* Risk & Competition Breakdown */}
        <div className="mt-4 grid grid-cols-2 gap-3">
          <div className="p-3 rounded-xl bg-slate-950/30 border border-slate-800">
            <span className="text-[11px] text-slate-400 block mb-1">
              {isAr ? 'مستوى المنافسة بالسوق' : 'Market Competition'}
            </span>
            <div className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${compMeta.dot}`} />
              <span className="text-xs font-bold text-slate-200">{compMeta.label}</span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/30 border border-slate-800">
            <span className="text-[11px] text-slate-400 block mb-1">
              {isAr ? 'درجة المخاطرة الاستثمارية' : 'Investment Risk'}
            </span>
            <span className={`text-xs font-bold ${riskMeta.color.split(' ')[0]}`}>
              {riskMeta.label}
            </span>
          </div>
        </div>

        {/* Strategic Roadmap Recommendations */}
        <div className="mt-4 p-4 rounded-xl bg-slate-950/50 border border-slate-800/80">
          <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
            <span>{isAr ? 'خارطة طريق الانتقال واقتناص هذا المستوى:' : 'Actionable Transformation Roadmap:'}</span>
          </h4>
          <ul className="space-y-2 text-xs sm:text-sm text-slate-300">
            {recommendations.map((rec, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>{rec}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
