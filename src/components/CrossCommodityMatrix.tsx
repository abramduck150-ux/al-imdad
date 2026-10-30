import React, { useState } from 'react';
import { CommodityData } from '../types/commodity';
import {
  calculateMultiplier,
  formatCurrencyUSD,
  parseMarginPercent,
  getCompetitionMeta,
} from '../utils/ladderCalculations';
import { BarChart3, Zap } from 'lucide-react';

interface CrossCommodityMatrixProps {
  commodities: CommodityData[];
  lang: 'ar' | 'en';
  onSelectCommodityAndLevel: (commodityId: string, levelNum: number) => void;
}

export const CrossCommodityMatrix: React.FC<CrossCommodityMatrixProps> = ({
  commodities,
  lang,
  onSelectCommodityAndLevel,
}) => {
  const isAr = lang === 'ar';
  const [highlightFilter, setHighlightFilter] = useState<'all' | 'sweetspot' | 'highmargin' | 'ip'>('all');

  const levels = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  return (
    <div className="space-y-6">
      {/* Top Overview Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-slate-100 text-slate-800">
                <BarChart3 className="w-5 h-5 text-emerald-600" />
              </span>
              <div>
                <h2 className="text-lg sm:text-xl font-black text-slate-900">
                  {isAr ? 'المصفوفة المقارنة الشاملة عبر الموارد الخمسة' : 'Cross-Commodity 5-Resource Value Matrix'}
                </h2>
                <p className="text-xs text-slate-500">
                  {isAr
                    ? 'تحليل متوازي للمستويات العشرة لمقارنة الأسعار، الهوامش، ونقاط التحول الصناعي'
                    : 'Parallel 10-level matrix comparing pricing, profit margins, and value bottlenecks'}
                </p>
              </div>
            </div>
          </div>

          {/* Filter options */}
          <div className="flex flex-wrap items-center gap-1.5 self-start md:self-auto">
            <button
              onClick={() => setHighlightFilter('all')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg border transition cursor-pointer ${
                highlightFilter === 'all'
                  ? 'bg-slate-900 text-white border-slate-900'
                  : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
              }`}
            >
              {isAr ? 'عرض الكل' : 'View All'}
            </button>
            <button
              onClick={() => setHighlightFilter('sweetspot')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg border transition flex items-center gap-1 cursor-pointer ${
                highlightFilter === 'sweetspot'
                  ? 'bg-amber-500 text-white border-amber-500'
                  : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
              }`}
            >
              <Zap className="w-3.5 h-3.5 fill-current" />
              <span>{isAr ? 'الفرص الذهبية (L5-L6)' : 'Sweet Spots (L5-L6)'}</span>
            </button>
            <button
              onClick={() => setHighlightFilter('highmargin')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg border transition cursor-pointer ${
                highlightFilter === 'highmargin'
                  ? 'bg-emerald-600 text-white border-emerald-600'
                  : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
              }`}
            >
              {isAr ? 'هوامش تفوق 100%' : 'Margins > 100%'}
            </button>
            <button
              onClick={() => setHighlightFilter('ip')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg border transition cursor-pointer ${
                highlightFilter === 'ip'
                  ? 'bg-purple-600 text-white border-purple-600'
                  : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
              }`}
            >
              {isAr ? 'براءات ومنصات (L9-L10)' : 'Deep Tech & IP'}
            </button>
          </div>
        </div>
      </div>

      {/* Comparative Table Container */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-start border-collapse min-w-[850px]">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                <th className="py-3 px-4 text-start w-32 sticky start-0 bg-slate-50 z-10 border-e border-slate-200">
                  {isAr ? 'المستوى' : 'Level'}
                </th>
                {commodities.map((comm) => (
                  <th key={comm.id} className="py-3 px-4 text-start border-e border-slate-200">
                    <div className="flex items-center gap-1.5">
                      <span className="text-base">{comm.icon}</span>
                      <span className="text-slate-900 font-bold text-xs">
                        {isAr ? comm.name_ar.split(' ')[0] : comm.commodity}
                      </span>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {levels.map((lvlNum) => {
                const sampleLevel = commodities[0].ladder.find((l) => l.level === lvlNum);
                const isSweetSpotLevel = lvlNum === 5 || lvlNum === 6;

                if (highlightFilter === 'sweetspot' && !isSweetSpotLevel) return null;
                if (highlightFilter === 'ip' && lvlNum < 9) return null;

                return (
                  <tr
                    key={lvlNum}
                    className={`transition hover:bg-slate-50/70 ${
                      isSweetSpotLevel ? 'bg-amber-50/30' : ''
                    }`}
                  >
                    {/* Level Column */}
                    <td className="py-3 px-4 sticky start-0 bg-white z-10 border-e border-slate-200 font-bold">
                      <div className="flex items-center gap-2">
                        <span
                          className={`w-6 h-6 rounded-md flex items-center justify-center text-[11px] font-black ${
                            lvlNum >= 8
                              ? 'bg-purple-100 text-purple-800'
                              : lvlNum >= 5
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          {lvlNum}
                        </span>
                        <div>
                          <div className="text-slate-900 font-bold uppercase tracking-tight text-[11px]">
                            {sampleLevel?.level_name}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Each Commodity's Column for this level */}
                    {commodities.map((comm) => {
                      const lvlData = comm.ladder.find((l) => l.level === lvlNum);
                      if (!lvlData) return <td key={comm.id} className="p-3">-</td>;

                      const rawPrice = comm.ladder[0].price_per_kg_usd;
                      const mult = calculateMultiplier(rawPrice, lvlData.price_per_kg_usd);
                      const marginNum = parseMarginPercent(lvlData.margin_percent);
                      const compMeta = getCompetitionMeta(lvlData.competition_level);

                      if (highlightFilter === 'highmargin' && marginNum < 100) {
                        return (
                          <td key={comm.id} className="py-2.5 px-3 border-e border-slate-200 opacity-30">
                            <span className="text-[11px] text-slate-400">{lvlData.margin_percent}</span>
                          </td>
                        );
                      }

                      return (
                        <td
                          key={comm.id}
                          onClick={() => onSelectCommodityAndLevel(comm.id, lvlNum)}
                          className="py-2.5 px-3 border-e border-slate-200 cursor-pointer group hover:bg-slate-100/60 transition"
                        >
                          <div className="flex items-center justify-between gap-1">
                            <span className="font-bold text-emerald-700 font-mono text-xs">
                              {formatCurrencyUSD(lvlData.price_per_kg_usd)}
                            </span>
                            <span className="text-[10px] font-bold text-amber-600 font-mono">
                              {mult > 1 ? `+${mult.toLocaleString()}x` : '1x'}
                            </span>
                          </div>

                          <p className="text-[11px] text-slate-600 mt-1 line-clamp-1 group-hover:text-slate-900 font-medium">
                            {lvlData.product_form}
                          </p>

                          <div className="mt-1.5 flex items-center justify-between text-[10px]">
                            <span className="text-slate-500 font-mono font-bold">
                              {lvlData.margin_percent}
                            </span>
                            <span className={`px-1.5 py-0.2 rounded border ${compMeta.color}`}>
                              {compMeta.label.split(' ')[0]}
                            </span>
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
