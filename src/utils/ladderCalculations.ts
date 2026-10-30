import { CompetitionLevel, RiskLevel, LadderLevel, SimulationResult } from '../types/commodity';

/**
 * Calculates value multiplier between raw base price and target price
 */
export function calculateMultiplier(basePrice: number, currentPrice: number): number {
  if (basePrice <= 0) return 1;
  const mult = currentPrice / basePrice;
  return Number(mult.toFixed(mult >= 10 ? 1 : 2));
}

/**
 * Extracts numeric percentage value from string e.g. "150%" -> 150
 */
export function parseMarginPercent(marginStr: string): number {
  if (!marginStr) return 0;
  const cleaned = marginStr.replace('%', '').trim();
  const num = parseFloat(cleaned);
  return isNaN(num) ? 0 : num;
}

/**
 * Computes the macro-economic transformation impact of shifting export volumes
 * from Level 1 raw state to a targeted value-added level.
 */
export function calculateEconomicImpact(
  rawPricePerKg: number,
  targetPricePerKg: number,
  metricTons: number
): SimulationResult {
  const kgTotal = Math.max(0, metricTons) * 1000;
  const rawRevenueUSD = kgTotal * rawPricePerKg;
  const targetRevenueUSD = kgTotal * targetPricePerKg;
  const valueSurplusUSD = targetRevenueUSD - rawRevenueUSD;
  const valueMultiplier = rawPricePerKg > 0 ? targetPricePerKg / rawPricePerKg : 1;

  // Approximate industrial job creation multiplier per 1,000 tons processed locally
  // Higher value levels require more lab, tech, logistics and packaging workforce
  const multiplierTier = Math.min(10, Math.max(1, Math.log10(valueMultiplier + 1) * 3));
  const jobCreationEstimate = Math.round((metricTons / 100) * multiplierTier * 8);

  return {
    rawPricePerKg,
    targetPricePerKg,
    metricTons,
    rawRevenueUSD,
    targetRevenueUSD,
    valueSurplusUSD,
    valueMultiplier: Number(valueMultiplier.toFixed(2)),
    jobCreationEstimate,
  };
}

/**
 * Formats USD amounts cleanly with suffixes ($1.2M, $45.8B, $3,500)
 */
export function formatCurrencyUSD(amount: number): string {
  if (amount >= 1_000_000_000) {
    return `$${(amount / 1_000_000_000).toFixed(2)}B`;
  }
  if (amount >= 1_000_000) {
    return `$${(amount / 1_000_000).toFixed(2)}M`;
  }
  if (amount >= 1_000) {
    return `$${(amount / 1_000).toFixed(1)}k`;
  }
  return `$${amount.toLocaleString('en-US', { maximumFractionDigits: 2 })}`;
}

/**
 * Formats tonnage with appropriate metrics
 */
export function formatTons(tons: number): string {
  if (tons >= 1_000_000) {
    return `${(tons / 1_000_000).toFixed(2)}M Tons`;
  }
  if (tons >= 1_000) {
    return `${(tons / 1_000).toFixed(0)}k Tons`;
  }
  return `${tons.toLocaleString('en-US')} Tons`;
}

/**
 * Computes a "Sweet Spot Score" (0 to 100)
 * High score = high profit margin + low competition + manageable risk
 */
export function calculateSweetSpotScore(level: LadderLevel): number {
  const margin = parseMarginPercent(level.margin_percent);
  let compScore = 10;
  switch (level.competition_level) {
    case 'None': compScore = 35; break;
    case 'Very Low': compScore = 30; break;
    case 'Low': compScore = 25; break;
    case 'Medium': compScore = 15; break;
    case 'High': compScore = 5; break;
    case 'Very High': compScore = 0; break;
  }

  let riskScore = 10;
  switch (level.risk_level) {
    case 'Low': riskScore = 30; break;
    case 'Medium': riskScore = 20; break;
    case 'High': riskScore = 10; break;
    case 'Very High': riskScore = 0; break;
  }

  // Margin score up to 35
  const marginScore = Math.min(35, Math.round((margin / 200) * 35));

  return Math.min(100, compScore + riskScore + marginScore);
}

/**
 * Returns clean light-theme color classes for competition level
 */
export function getCompetitionMeta(comp: CompetitionLevel) {
  switch (comp) {
    case 'None':
      return { label: 'معدوم (None)', color: 'text-emerald-700 bg-emerald-50 border-emerald-200', dot: 'bg-emerald-500' };
    case 'Very Low':
      return { label: 'منخفض جداً (Very Low)', color: 'text-teal-700 bg-teal-50 border-teal-200', dot: 'bg-teal-500' };
    case 'Low':
      return { label: 'منخفض (Low)', color: 'text-cyan-700 bg-cyan-50 border-cyan-200', dot: 'bg-cyan-500' };
    case 'Medium':
      return { label: 'متوسط (Medium)', color: 'text-amber-700 bg-amber-50 border-amber-200', dot: 'bg-amber-500' };
    case 'High':
      return { label: 'عالي (High)', color: 'text-orange-700 bg-orange-50 border-orange-200', dot: 'bg-orange-500' };
    case 'Very High':
      return { label: 'شديد جداً (Very High)', color: 'text-rose-700 bg-rose-50 border-rose-200', dot: 'bg-rose-500' };
  }
}

/**
 * Returns clean light-theme color classes for risk level
 */
export function getRiskMeta(risk: RiskLevel) {
  switch (risk) {
    case 'Low':
      return { label: 'مخاطرة منخفضة', color: 'text-emerald-700 bg-emerald-50 border-emerald-200' };
    case 'Medium':
      return { label: 'مخاطرة متوسطة', color: 'text-amber-700 bg-amber-50 border-amber-200' };
    case 'High':
      return { label: 'مخاطرة عالية', color: 'text-orange-700 bg-orange-50 border-orange-200' };
    case 'Very High':
      return { label: 'مخاطرة حرجة', color: 'text-rose-700 bg-rose-50 border-rose-200' };
  }
}

/**
 * Generates an intelligent 10-level ladder for any custom commodity typed by the user,
 * anchoring on the user's custom base raw price ($/kg).
 */
export function generateCustomLadder(commodityName: string, basePrice: number): LadderLevel[] {
  const p = Math.max(0.1, basePrice);
  return [
    {
      level: 1,
      level_name: 'RAW',
      product_form: `شوالات خام غير منقاة من ${commodityName} من مواقع الإنتاج ومزارع الحصاد`,
      where_it_happens: `المزارع ومواقع الإنتاج / أسواق المحاصيل التقليدية`,
      price_per_kg_usd: Number(p.toFixed(2)),
      competition_level: 'Very High',
      risk_level: 'Very High',
      margin_percent: '5%',
      who_does_it_now: 'غالبية المنتجين والتجار الصغار',
      opportunity_gap: 'سوق مزدحم بالوسطاء وهوامش ربح متدنية لا تغطي كلفة التضخم',
    },
    {
      level: 2,
      level_name: 'CLEANED',
      product_form: `${commodityName} منقى ومغربل ومفرز حسب درجات النقاء في عبوات تعبئة قياسية`,
      where_it_happens: 'مراكز الغربلة والتنقية المحلية (الموانئ والمحطات الوسيطة)',
      price_per_kg_usd: Number((p * 2).toFixed(2)),
      competition_level: 'High',
      risk_level: 'High',
      margin_percent: '15%',
      who_does_it_now: 'شركات التصدير والوساطة التجارية التقليدية',
      opportunity_gap: 'القيمة المضافة متواضعة والمنافسة السعرية شديدة',
    },
    {
      level: 3,
      level_name: 'POWDER/OIL',
      product_form: `مسحوق ناعم أو زيوت معصورة على البارد ومستخلصات أولية من ${commodityName}`,
      where_it_happens: 'مطاحن ومعاصر ومصانع تجهيز محلية متوسطة',
      price_per_kg_usd: Number((p * 4).toFixed(2)),
      competition_level: 'Medium',
      risk_level: 'Medium',
      margin_percent: '30%',
      who_does_it_now: 'معاصر وورش تحويلية محلية صغيرة',
      opportunity_gap: 'نقص في تقنيات التجفيف الهوائي الحديث والتعبئة العازلة للرطوبة',
    },
    {
      level: 4,
      level_name: 'INDUSTRIAL INGREDIENT',
      product_form: `مدخلات صناعية ومركزات B2B معتمدة لمصانع الأغذية والأدوية والكيماويات من ${commodityName}`,
      where_it_happens: 'مصانع معالجة متقدمة بالمناطق الصناعية الحرة',
      price_per_kg_usd: Number((p * 10).toFixed(2)),
      competition_level: 'Medium',
      risk_level: 'Medium',
      margin_percent: '45%',
      who_does_it_now: 'شركات استيراد ومعالجة أجنبية تشتري الخام وتعيد تصنيعه',
      opportunity_gap: 'احتكار الشركات الأجنبية للربط مع سلاسل التوريد الصناعية الكبرى',
    },
    {
      level: 5,
      level_name: 'SIMPLE CONSUMER PRODUCT',
      product_form: `منتج استهلاكي جاهز للاستخدام المنزلي معبأ في علب وأظرف أنيقة من ${commodityName}`,
      where_it_happens: 'مصانع التعبئة والتغليف الحديثة',
      price_per_kg_usd: Number((p * 22).toFixed(2)),
      competition_level: 'Medium',
      risk_level: 'Low',
      margin_percent: '60%',
      who_does_it_now: 'براندات تجارية محلية وإقليمية ذات تغليف عادي',
      opportunity_gap: 'ضعف التسويق وقصور التوزيع في السلاسل الاستهلاكية الإقليمية',
    },
    {
      level: 6,
      level_name: 'BRANDED EXPERIENCE PRODUCT',
      product_form: `منتج براند راقٍ ذو هوية عصرية (Premium Brand) بتجربة مستهلك فاخرة مشتق من ${commodityName}`,
      where_it_happens: 'مصانع البراندينغ وسلاسل التبريد والتوزيع العصري',
      price_per_kg_usd: Number((p * 60).toFixed(2)),
      competition_level: 'Low',
      risk_level: 'Medium',
      margin_percent: '140%',
      who_does_it_now: 'شركات عالمية تسوق المورد بهويات أجنبية',
      opportunity_gap: 'فرصة ذهبية لاقتناص هوامش الأرباح العالية عبر البراند والهوية الأصلية',
    },
    {
      level: 7,
      level_name: 'COSMETIC / WELLNESS',
      product_form: `مستخلصات عضوية نقية ومواد فعالة لمستحضرات التجميل والعناية بالبشرة من ${commodityName}`,
      where_it_happens: 'مختبرات التكنولوجيا الحيوية ومستحضرات التجميل المتقدمة',
      price_per_kg_usd: Number((p * 175).toFixed(2)),
      competition_level: 'Low',
      risk_level: 'Low',
      margin_percent: '280%',
      who_does_it_now: 'مختبرات تجميل فرنسية وأمريكية ويابانية',
      opportunity_gap: 'البيع بالجرام والمليلتر لمصنعي التجميل العالميين بهوامش قياسية',
    },
    {
      level: 8,
      level_name: 'ADVANCED TECH COMPONENT',
      product_form: `مكونات تقنية نانوية أو مواد بوليمرية خضراء فائقة الأداء للأجهزة المتطورة من ${commodityName}`,
      where_it_happens: 'مختبرات ومراكز أبحاث علوم المواد والنانوتكنولوجي',
      price_per_kg_usd: Number((p * 450).toFixed(2)),
      competition_level: 'Very Low',
      risk_level: 'High',
      margin_percent: '550%',
      who_does_it_now: 'مراكز الأبحاث الدولية وشركات المواد المتطورة',
      opportunity_gap: 'احتكار تطبيقات الطاقة النظيفة والمواد الذكية الصديقة للبيئة',
    },
    {
      level: 9,
      level_name: 'PHARMA / SPACE / LUXURY PATENT',
      product_form: `عقاقير طبية حاصلة على براءات اختراع أو مكونات دقيقة لصناعات الفضاء من ${commodityName}`,
      where_it_happens: 'مراكز البحث والتطوير الصيدلاني (Pharma R&D)',
      price_per_kg_usd: Number((p * 900).toFixed(2)),
      competition_level: 'Very Low',
      risk_level: 'High',
      margin_percent: '1000%',
      who_does_it_now: 'شركات الأدوية والتقنيات الحيوية متعددة الجنسيات',
      opportunity_gap: 'تسجيل براءات اختراع دولية لمركبات النقاء العالي وحصاد العائدات الدوائية',
    },
    {
      level: 10,
      level_name: 'PLATFORM / DATA / IP',
      product_form: `منصة تداول رقمية وتتبع بالبلوكتشين وتأجير حقوق ملكية فكرية (IP) لسلاسل ${commodityName} العالمية`,
      where_it_happens: 'المنصات الرقمية السحابية العالمية وأسواق الملكية الفكرية',
      price_per_kg_usd: Number((p * 1750).toFixed(2)),
      competition_level: 'None',
      risk_level: 'Low',
      margin_percent: '2000%',
      who_does_it_now: 'منصات أسواق التكنولوجيا العالمية',
      opportunity_gap: 'امتلاك سلسلة القيمة الشاملة وقواعد البيانات بدلاً من مجرد توريد الخام',
    },
  ];
}
