import React, { useState, useEffect } from 'react';
import { INITIAL_COMMODITIES } from './data/commodityData';
import { CommodityData, LadderLevel } from './types/commodity';
import { Header } from './components/Header';
import { AnalysisControlBar } from './components/AnalysisControlBar';
import { StageAnalysisView } from './components/StageAnalysisView';
import { EconomicSimulator } from './components/EconomicSimulator';
import { CrossCommodityMatrix } from './components/CrossCommodityMatrix';
import { OpportunitiesRadar } from './components/OpportunitiesRadar';
import { ExportModal } from './components/ExportModal';
import { generateCustomLadder } from './utils/ladderCalculations';
import { Sparkles, Layers, CheckCircle2 } from 'lucide-react';

export default function App() {
  const [commodities] = useState<CommodityData[]>(INITIAL_COMMODITIES);
  const [selectedPresetId, setSelectedPresetId] = useState<string>('karkade');
  
  // Writable / Selectable Parameters
  const [commodityName, setCommodityName] = useState<string>('الكركدي السوداني');
  const [rawPrice, setRawPrice] = useState<number>(2);
  const [exportTons, setExportTons] = useState<number>(85000);
  const [selectedTier, setSelectedTier] = useState<string>('all');
  
  // Navigation & Analysis State
  const [activeTab, setActiveTab] = useState<'ladder' | 'simulator' | 'matrix' | 'radar'>('ladder');
  const [lang, setLang] = useState<'ar' | 'en'>('ar');
  const [hasRun, setHasRun] = useState<boolean>(true); // Pre-run initial analysis
  const [activeLadder, setActiveLadder] = useState<LadderLevel[]>(INITIAL_COMMODITIES[0].ladder);
  const [isExportModalOpen, setIsExportModalOpen] = useState<boolean>(false);

  const isAr = lang === 'ar';

  // Handle Preset Selection (Auto-populates inputs while keeping them freely editable)
  const handleSelectPreset = (id: string) => {
    setSelectedPresetId(id);
    const found = commodities.find((c) => c.id === id);
    if (found) {
      setCommodityName(found.name_ar);
      setRawPrice(found.ladder[0].price_per_kg_usd);
      setExportTons(found.typical_annual_export_tons);
      setActiveLadder(found.ladder);
    }
  };

  // Run Analysis Action
  const handleRunAnalysis = () => {
    setHasRun(true);
    // Check if current commodity matches one of the presets
    const preset = commodities.find((c) => c.id === selectedPresetId);
    if (preset && preset.name_ar.trim() === commodityName.trim()) {
      // Re-scale prices if user changed the raw price
      const baseL1 = preset.ladder[0].price_per_kg_usd;
      if (rawPrice !== baseL1 && baseL1 > 0) {
        const ratio = rawPrice / baseL1;
        const scaledLadder: LadderLevel[] = preset.ladder.map((lvl) => ({
          ...lvl,
          price_per_kg_usd: Number((lvl.price_per_kg_usd * ratio).toFixed(2)),
        }));
        setActiveLadder(scaledLadder);
      } else {
        setActiveLadder(preset.ladder);
      }
    } else {
      // Custom typed commodity: generate custom 10-level ladder dynamically!
      const customLadder = generateCustomLadder(commodityName || 'المحصول', rawPrice);
      setActiveLadder(customLadder);
    }

    // Scroll smoothly to analysis results
    const resultsElement = document.getElementById('analysis-results-section');
    if (resultsElement) {
      resultsElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSelectCommodityAndLevel = (commId: string, _levelNum: number) => {
    handleSelectPreset(commId);
    setActiveTab('ladder');
    setHasRun(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Adjust document direction
  useEffect(() => {
    document.documentElement.dir = isAr ? 'rtl' : 'ltr';
    document.documentElement.lang = isAr ? 'ar' : 'en';
  }, [isAr]);

  return (
    <div
      dir={isAr ? 'rtl' : 'ltr'}
      className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-['Cairo','Inter',sans-serif] selection:bg-emerald-100 selection:text-emerald-900"
    >
      {/* Clean White Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        lang={lang}
        setLang={setLang}
        onExport={() => setIsExportModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* VIEW 1: RUN STAGE ANALYSIS */}
        {activeTab === 'ladder' && (
          <div className="space-y-6">
            {/* Control Bar: Selectable or Writable inputs + RUN button */}
            <AnalysisControlBar
              commodities={commodities}
              selectedPresetId={selectedPresetId}
              commodityName={commodityName}
              setCommodityName={setCommodityName}
              rawPrice={rawPrice}
              setRawPrice={setRawPrice}
              exportTons={exportTons}
              setExportTons={setExportTons}
              selectedTier={selectedTier}
              setSelectedTier={setSelectedTier}
              onSelectPreset={handleSelectPreset}
              onRunAnalysis={handleRunAnalysis}
              hasRun={hasRun}
              lang={lang}
            />

            {/* Stage-by-Stage Results Section */}
            <div id="analysis-results-section">
              {hasRun ? (
                <StageAnalysisView
                  commodityName={commodityName}
                  rawPrice={rawPrice}
                  exportTons={exportTons}
                  ladder={activeLadder}
                  selectedTier={selectedTier}
                  lang={lang}
                />
              ) : (
                <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3 shadow-xs">
                  <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
                    <Sparkles className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-bold text-slate-800">
                    {isAr ? 'اضغط على زر "تشغيل التحليل الشامل" بالأعلى' : 'Click "Run Complete Analysis" above'}
                  </h3>
                  <p className="text-xs text-slate-500 max-w-md mx-auto">
                    {isAr
                      ? 'سيقوم البرنامج بإنشاء وحساب التحليل الكامل لكل مرحلة من المراحل العشرة للمورد المحدد'
                      : 'The system will generate detailed stage-by-stage financial and strategic analysis'}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* VIEW 2: VALUE-ADD SIMULATOR */}
        {activeTab === 'simulator' && (
          <EconomicSimulator
            commodities={commodities}
            selectedCommodityId={selectedPresetId}
            targetLevelNum={6}
            lang={lang}
            onCommodityChange={handleSelectPreset}
            onTargetLevelChange={() => {}}
          />
        )}

        {/* VIEW 3: 5-COMMODITY MATRIX */}
        {activeTab === 'matrix' && (
          <CrossCommodityMatrix
            commodities={commodities}
            lang={lang}
            onSelectCommodityAndLevel={handleSelectCommodityAndLevel}
          />
        )}

        {/* VIEW 4: OPPORTUNITY RADAR */}
        {activeTab === 'radar' && (
          <OpportunitiesRadar
            commodities={commodities}
            lang={lang}
            onSelectCommodityAndLevel={handleSelectCommodityAndLevel}
          />
        )}
      </main>

      {/* Clean Light Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 mt-12 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-700">
              {isAr ? 'استوديو سلم القيمة المضافة للموارد' : 'Sudan Commodity Value Ladder Studio'}
            </span>
            <span className="text-slate-300">|</span>
            <span className="text-slate-500">
              {isAr ? 'تحليل مراحل التصنيع، المنتجات الاستهلاكية، والملكية الفكرية' : 'Industrial Stages & IP Matrix'}
            </span>
          </div>

          <div className="flex items-center gap-2 text-slate-500 font-medium">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{isAr ? 'تصميم أبيض بسيط وتفاعلي' : 'Clean white interactive architecture'}</span>
          </div>
        </div>
      </footer>

      {/* Export Modal */}
      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        commodities={commodities}
        lang={lang}
      />
    </div>
  );
}
