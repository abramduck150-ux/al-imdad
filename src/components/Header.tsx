import React from 'react';
import { Layers, TrendingUp, BarChart3, Compass, Download, Globe } from 'lucide-react';

interface HeaderProps {
  activeTab: 'ladder' | 'simulator' | 'matrix' | 'radar';
  setActiveTab: (tab: 'ladder' | 'simulator' | 'matrix' | 'radar') => void;
  lang: 'ar' | 'en';
  setLang: (lang: 'ar' | 'en') => void;
  onExport: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  lang,
  setLang,
  onExport,
}) => {
  const isAr = lang === 'ar';

  return (
    <header className="border-b border-slate-200 bg-white/95 backdrop-blur-md sticky top-0 z-40 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between py-3.5 gap-3">
          {/* Logo & Title */}
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-emerald-600 via-teal-600 to-amber-500 p-0.5 shadow-sm">
              <div className="h-full w-full bg-white rounded-[10px] flex items-center justify-center">
                <Layers className="h-5 w-5 text-emerald-600" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg sm:text-xl font-black tracking-tight text-slate-900 font-['Cairo']">
                  {isAr ? 'استوديو سلم القيمة المضافة للموارد' : 'Commodity Value Ladder Studio'}
                </h1>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                  {isAr ? 'السودان' : 'Sudan'}
                </span>
              </div>
              <p className="text-xs text-slate-500">
                {isAr
                  ? 'مصفوفة التحول الاقتصادي وتحليل مراحل التصنيع من الخام إلى الملكية الفكرية'
                  : '10-Stage Industrial Value Addition & Transformation Platform'}
              </p>
            </div>
          </div>

          {/* Action Tools & Language Toggle */}
          <div className="flex items-center gap-2 self-end md:self-auto">
            <button
              onClick={onExport}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition cursor-pointer"
              title={isAr ? 'تصدير البيانات' : 'Export Data'}
              aria-label={isAr ? 'تصدير البيانات' : 'Export Data'}
            >
              <Download className="w-3.5 h-3.5 text-slate-600" />
              <span>{isAr ? 'تصدير البيانات' : 'Export JSON'}</span>
            </button>

            <button
              onClick={() => setLang(isAr ? 'en' : 'ar')}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 transition cursor-pointer"
              aria-label="Toggle language"
            >
              <Globe className="w-3.5 h-3.5 text-emerald-600" />
              <span>{isAr ? 'English' : 'العربية'}</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center gap-1.5 sm:gap-2 border-t border-slate-100 pt-2 pb-2 overflow-x-auto scrollbar-none" aria-label="Main Navigation">
          <button
            onClick={() => setActiveTab('ladder')}
            className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 text-xs sm:text-sm font-semibold rounded-lg transition whitespace-nowrap cursor-pointer ${
              activeTab === 'ladder'
                ? 'bg-emerald-600 text-white font-bold shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>{isAr ? 'تشغيل وتحليل المراحل' : 'Run Stage Analysis'}</span>
          </button>

          <button
            onClick={() => setActiveTab('simulator')}
            className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 text-xs sm:text-sm font-semibold rounded-lg transition whitespace-nowrap cursor-pointer ${
              activeTab === 'simulator'
                ? 'bg-emerald-600 text-white font-bold shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            <span>{isAr ? 'محاكي الأثر الاقتصادي' : 'Value-Add Simulator'}</span>
          </button>

          <button
            onClick={() => setActiveTab('matrix')}
            className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 text-xs sm:text-sm font-semibold rounded-lg transition whitespace-nowrap cursor-pointer ${
              activeTab === 'matrix'
                ? 'bg-emerald-600 text-white font-bold shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>{isAr ? 'المصفوفة المقارنة (5 موارد)' : '5-Commodity Matrix'}</span>
          </button>

          <button
            onClick={() => setActiveTab('radar')}
            className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 text-xs sm:text-sm font-semibold rounded-lg transition whitespace-nowrap cursor-pointer ${
              activeTab === 'radar'
                ? 'bg-emerald-600 text-white font-bold shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Compass className="w-4 h-4" />
            <span>{isAr ? 'رادار الفرص الاستراتيجية' : 'Opportunity Radar'}</span>
          </button>
        </nav>
      </div>
    </header>
  );
};
