import React from 'react';
import { CommodityData } from '../types/commodity';
import { formatCurrencyUSD, calculateMultiplier } from '../utils/ladderCalculations';
import {
  Zap,
  Target,
  ArrowRight,
  Layers,
  FlaskConical,
  Globe2,
} from 'lucide-react';

interface OpportunitiesRadarProps {
  commodities: CommodityData[];
  lang: 'ar' | 'en';
  onSelectCommodityAndLevel: (commodityId: string, levelNum: number) => void;
}

export const OpportunitiesRadar: React.FC<OpportunitiesRadarProps> = ({
  commodities,
  lang,
  onSelectCommodityAndLevel,
}) => {
  const isAr = lang === 'ar';

  const opportunityTiers = [
    {
      id: 'consumer_branded',
      badge: isAr ? 'المستوى 6: الفرصة الذهبية الأسرع' : 'Level 6: Fastest Sweet Spot',
      title: isAr ? 'البراندات العصرية وتجارب المستهلك الفاخرة' : 'Branded Consumer Experience Products',
      subtitle: isAr
        ? 'أعلى عائد على الاستثمار بأقل متطلبات تكنولوجية معقدة'
        : 'Highest ROI with accessible manufacturing capex',
      color: 'border-amber-300 bg-amber-50 text-amber-800',
      icon: <Zap className="w-5 h-5 text-amber-600" />,
      items: [
        {
          commId: 'karkade',
          levelNum: 6,
          name: isAr ? 'مشروب كركدي فوار (KARKADE RED Pop)' : 'KARKADE RED - The Sudanese Pop',
          price: 120,
          margin: '150%',
          description: isAr
            ? 'مشروب غازي طبيعي بديل للصودا التقليدية في علبة ألمنيوم بتجربة فتح مميزة.'
            : 'Cold sparkling craft soda in aluminum cans replacing artificial soft drinks.',
        },
        {
          commId: 'gum-arabic',
          levelNum: 6,
          name: isAr ? 'مشروب ألياف الصمغ الفوار الجاهز' : 'Prebiotic Sparkling Acacia Beverage',
          price: 150,
          margin: '180%',
          description: isAr
            ? 'براند صحة يومية عالمي يروج للصمغ العربي كمصدر للألياف والبروبيوتيك الطبيعي.'
            : 'Ready-to-drink functional gut-health drink branded for global wellness retail.',
        },
        {
          commId: 'sesame',
          levelNum: 6,
          name: isAr ? 'زيت سمسم معصور على البارد بزجاج فاخر' : 'Boutique Cold-Pressed Sesame & Tahini',
          price: 85,
          margin: '120%',
          description: isAr
            ? 'طحينة وزيت سمسم سوداني عالي الجودة معبأ في زجاج معتم للسوبرماركت العالمية.'
            : 'Artisanal packaged oils and premium tahini competing with Japanese luxury brands.',
        },
        {
          commId: 'leather',
          levelNum: 6,
          name: isAr ? 'حقائب وأحذية جلدية يدوية فاخرة' : 'African Luxury Leather Goods',
          price: 160,
          margin: '150%',
          description: isAr
            ? 'براند سوداني إفريقي فاخر ينافس دور الأزياء العالمية بتغليف راقٍ.'
            : 'Handcrafted luxury heritage leather accessories exported directly to high-end markets.',
        },
      ],
    },
    {
      id: 'industrial_b2b',
      badge: isAr ? 'المستوى 4: كسر الاحتكار العالمي B2B' : 'Level 4: Breaking Global B2B Monopolies',
      title: isAr ? 'المكونات والمدخلات الصناعية B2B' : 'Industrial Ingredients & B2B Moats',
      subtitle: isAr
        ? 'استبدال الشركات الوسيطة الأوروبية بالبيع المباشر للمصانع العالمية'
        : 'Bypassing European middlemen to supply global food & pharma giants',
      color: 'border-emerald-300 bg-emerald-50 text-emerald-800',
      icon: <Layers className="w-5 h-5 text-emerald-600" />,
      items: [
        {
          commId: 'gum-arabic',
          levelNum: 4,
          name: isAr ? 'بودرة صمغ مجففة بالرذاذ (Spray-Dried)' : 'Spray-Dried Gum Acacia Powder',
          price: 30,
          margin: '50%',
          description: isAr
            ? 'كسر احتكار الشركات الفرنسية التي تشتري الصمغ بـ 3$ وتعيد بيعه بـ 30$ كمستحلب صناعي.'
            : 'Domestic spray drying to retain billions traditionally captured by European processors.',
        },
        {
          commId: 'karkade',
          levelNum: 4,
          name: isAr ? 'مركز خلاصة الكركدي وملون طبيعي' : 'Hibiscus Natural Colorant Extract',
          price: 20,
          margin: '45%',
          description: isAr
            ? 'بديل طبيعي للملونات الصناعية المسرطنة مطلوبة بشدة من كبرى شركات الأغذية العالمية.'
            : 'Natural food colorant concentrate surging in demand amid synthetic dye phase-outs.',
        },
        {
          commId: 'gold',
          levelNum: 4,
          name: isAr ? 'أسلاك ووصلات إلكترونية 99.99%' : 'Bonding Wires for Electronics',
          price: 110000,
          margin: '30%',
          description: isAr
            ? 'تكرير وتصنيع أسلاك الذهب الدقيقة الموصلة للدوائر الإلكترونية ورقائق أشباه الموصلات.'
            : 'Ultra-pure gold bonding wire for semiconductor chip packaging and electronics.',
        },
      ],
    },
    {
      id: 'biotech_wellness',
      badge: isAr ? 'المستوى 7: التجميل والعناية الحيوية' : 'Level 7: Bio-Cosmetics & Clinical Wellness',
      title: isAr ? 'مستحضرات التجميل العضوية والمستخلصات الفائقة' : 'Cosmetics, AHAs & Bio-Active Lipids',
      subtitle: isAr
        ? 'البيع بالجرام والمليلتر بهوامش تفوق 250% - 300%'
        : 'Monetizing active compounds in grams/ml at 250%+ profit margins',
      color: 'border-purple-300 bg-purple-50 text-purple-800',
      icon: <FlaskConical className="w-5 h-5 text-purple-600" />,
      items: [
        {
          commId: 'karkade',
          levelNum: 7,
          name: isAr ? 'سيروم أحماض الفواكه ومقشر البشرة (Organic AHAs)' : 'Organic Hibiscus AHA Skin Serum',
          price: 350,
          margin: '300%',
          description: isAr
            ? 'مستخلص مضادات الأكسدة ومجدد البشرة الطبيعي الذي تشتريه كبرى ماركات العناية الأوروبية.'
            : 'Natural botanical alternative to chemical peel acids sold at $350/kg.',
        },
        {
          commId: 'sesame',
          levelNum: 7,
          name: isAr ? 'مستخلص مركب السيسامين النقي (Sesamin)' : 'Pure Sesamin Anti-Aging Active',
          price: 250,
          margin: '250%',
          description: isAr
            ? 'مضاد أكسدة ودهون نباتية حيوية لحماية الخلايا ومستحضرات مكافحة الشيخوخة.'
            : 'High-purity antioxidant lipid commanding exponential markups in clinical cosmetics.',
        },
        {
          commId: 'leather',
          levelNum: 7,
          name: isAr ? 'ببتيدات الكولاجين الحيوي النقي' : 'Pure Bio-Collagen Peptides',
          price: 380,
          margin: '280%',
          description: isAr
            ? 'استخلاص مكملات الكولاجين الغذائية والتجميلية من مخلفات دباغة الجلود بدلاً من إهدارها.'
            : 'Transforming slaughterhouse byproducts into premium medical & beauty collagen.',
        },
      ],
    },
    {
      id: 'ip_platform',
      badge: isAr ? 'المستوى 10: الملكية الفكرية والمنصات الرقمية' : 'Level 10: Sovereign IP & Data Platforms',
      title: isAr ? 'امتلاك السوق وسلاسل القيمة العالمية' : 'Global IP, Data & Exchange Platforms',
      subtitle: isAr
        ? 'التحول من مورد مواد خام إلى مالك قواعد البيانات وبراءات الاختراع الدولية'
        : 'Moving from commodity supplier to global IP owner and market maker',
      color: 'border-blue-300 bg-blue-50 text-blue-800',
      icon: <Globe2 className="w-5 h-5 text-blue-600" />,
      items: [
        {
          commId: 'gold',
          levelNum: 10,
          name: isAr ? 'منصة تداول واحتياطي الذهب الرقمي الـ Tokenized' : 'Tokenized Real Gold Reserve & Cloud IP',
          price: 25000000,
          margin: '3000%',
          description: isAr
            ? 'ربط سبائك الذهب المودعة بأصول رقمية متداولة دولياً مع تحصيل رسوم التداول والرهن.'
            : 'Digital gold tokens backed by physical reserves, earning global fintech transaction fees.',
        },
        {
          commId: 'gum-arabic',
          levelNum: 10,
          name: isAr ? 'منصة تتبع وحصر براءات الصمغ العربي المستدام' : 'Global Acacia IP & Traceability Exchange',
          price: 450000,
          margin: '2200%',
          description: isAr
            ? 'منصة سلاسل كتل (Blockchain) لتوثيق منشأ الصمغ العضوي وعقود التوريد المباشرة بدون وسيط.'
            : 'Direct origin verification and patent licensing registry setting world market standards.',
        },
      ],
    },
  ];

  return (
    <div className="space-y-6">
      {/* Overview Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-sm">
        <div className="flex items-center gap-3">
          <span className="p-2.5 rounded-xl bg-slate-100 text-slate-800">
            <Target className="w-6 h-6 text-emerald-600" />
          </span>
          <div>
            <h2 className="text-lg sm:text-xl font-black text-slate-900">
              {isAr ? 'رادار الفرص الذهبية ونقاط الرافعة الاقتصادية' : 'Strategic Opportunity Radar & High-Leverage Bets'}
            </h2>
            <p className="text-xs text-slate-500">
              {isAr
                ? 'خارطة طريق مصنفة للمستثمرين، رواد الأعمال، وصناع القرار لاقتناص هوامش الأرباح غير المستغلة'
                : 'Actionable investment tiers categorizing rapid wins, industrial moats, and IP frontiers'}
            </p>
          </div>
        </div>
      </div>

      {/* Tiers List */}
      <div className="space-y-5">
        {opportunityTiers.map((tier) => (
          <div
            key={tier.id}
            className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs"
          >
            {/* Tier Header */}
            <div className="p-4 sm:p-5 border-b border-slate-100 bg-slate-50/60 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <span className="p-2 rounded-lg bg-white border border-slate-200 shadow-2xs">
                  {tier.icon}
                </span>
                <div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${tier.color}`}>
                    {tier.badge}
                  </span>
                  <h3 className="text-base font-black text-slate-900 mt-0.5">
                    {tier.title}
                  </h3>
                  <p className="text-xs text-slate-500">{tier.subtitle}</p>
                </div>
              </div>
            </div>

            {/* Opportunities Grid */}
            <div className="p-4 sm:p-5 grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {tier.items.map((item, idx) => {
                const comm = commodities.find((c) => c.id === item.commId);
                const rawPrice = comm?.ladder[0].price_per_kg_usd || 1;
                const mult = calculateMultiplier(rawPrice, item.price);

                return (
                  <div
                    key={idx}
                    onClick={() => onSelectCommodityAndLevel(item.commId, item.levelNum)}
                    className="p-4 rounded-xl bg-slate-50/70 border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/20 transition cursor-pointer group flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-1.5">
                          <span className="text-lg">{comm?.icon}</span>
                          <span className="text-xs font-bold text-slate-600">
                            {isAr ? comm?.name_ar.split(' ')[0] : comm?.commodity}
                          </span>
                        </div>
                        <div className="text-end">
                          <span className="text-sm font-black text-emerald-700 font-mono">
                            {formatCurrencyUSD(item.price)}
                            <span className="text-[10px] font-normal text-slate-500">/kg</span>
                          </span>
                        </div>
                      </div>

                      <h4 className="text-sm font-bold text-slate-900 mt-2 group-hover:text-emerald-700 transition">
                        {item.name}
                      </h4>

                      <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                        {item.description}
                      </p>
                    </div>

                    <div className="mt-3 pt-2.5 border-t border-slate-200/80 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-bold text-amber-600 font-mono">
                          +{mult.toLocaleString()}x {isAr ? 'مضاعف' : 'value'}
                        </span>
                        <span className="text-[11px] font-bold text-emerald-800 bg-emerald-100 px-1.5 py-0.5 rounded border border-emerald-200 font-mono">
                          {item.margin} {isAr ? 'هامش' : 'margin'}
                        </span>
                      </div>

                      <span className="text-xs text-slate-500 group-hover:text-emerald-700 flex items-center gap-1 font-medium">
                        <span>{isAr ? 'عرض التفاصيل' : 'Inspect'}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
