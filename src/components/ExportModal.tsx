import React, { useState } from 'react';
import { CommodityData } from '../types/commodity';
import { Download, Copy, Check, X, FileText } from 'lucide-react';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  commodities: CommodityData[];
  lang: 'ar' | 'en';
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  commodities,
  lang,
}) => {
  if (!isOpen) return null;
  const isAr = lang === 'ar';
  const [copied, setCopied] = useState(false);

  // Generate clean exportable JSON matching user's structure
  const rawExportData = commodities.map((c) => ({
    commodity: c.commodity,
    ladder: c.ladder,
  }));
  const jsonString = JSON.stringify(rawExportData, null, 2);

  const handleCopy = () => {
    navigator.clipboard.writeText(jsonString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadJSON = () => {
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sudan-commodity-value-ladders-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleDownloadCSV = () => {
    const headers = [
      'Commodity',
      'Level',
      'Level Name',
      'Product Form',
      'Where It Happens',
      'Price Per KG (USD)',
      'Competition Level',
      'Risk Level',
      'Margin Percent',
      'Who Does It Now',
      'Opportunity Gap',
    ];

    const rows: string[] = [headers.join(',')];

    commodities.forEach((c) => {
      c.ladder.forEach((lvl) => {
        const row = [
          `"${c.commodity}"`,
          lvl.level,
          `"${lvl.level_name}"`,
          `"${lvl.product_form.replace(/"/g, '""')}"`,
          `"${lvl.where_it_happens.replace(/"/g, '""')}"`,
          lvl.price_per_kg_usd,
          `"${lvl.competition_level}"`,
          `"${lvl.risk_level}"`,
          `"${lvl.margin_percent}"`,
          `"${lvl.who_does_it_now.replace(/"/g, '""')}"`,
          `"${lvl.opportunity_gap.replace(/"/g, '""')}"`,
        ];
        rows.push(row.join(','));
      });
    });

    const csvContent = '\uFEFF' + rows.join('\n'); // Add BOM for Excel Arabic support
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sudan-commodity-matrix-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200">
              <Download className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black text-slate-900">
                {isAr ? 'تصدير بيانات سلاسل القيمة المضافة' : 'Export Value Ladder Dataset'}
              </h3>
              <p className="text-xs text-slate-500">
                {isAr ? 'تنزيل أو نسخ كامل مصفوفة المحاصيل بصيغ JSON و CSV' : 'Download or copy complete 10-level matrix'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action Buttons */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadJSON}
              className="px-3.5 py-2 text-xs font-bold rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white flex items-center gap-1.5 transition shadow-xs cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>{isAr ? 'تنزيل JSON' : 'Download JSON'}</span>
            </button>

            <button
              onClick={handleDownloadCSV}
              className="px-3.5 py-2 text-xs font-bold rounded-xl bg-slate-800 hover:bg-slate-700 text-white flex items-center gap-1.5 transition shadow-xs cursor-pointer"
            >
              <FileText className="w-4 h-4" />
              <span>{isAr ? 'تنزيل جدول CSV (Excel)' : 'Download CSV'}</span>
            </button>
          </div>

          <button
            onClick={handleCopy}
            className="px-3.5 py-2 text-xs font-bold rounded-xl bg-white hover:bg-slate-100 text-slate-700 flex items-center gap-1.5 transition border border-slate-300 cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-600" />
                <span className="text-emerald-700">{isAr ? 'تم النسخ!' : 'Copied!'}</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 text-slate-500" />
                <span>{isAr ? 'نسخ كود JSON' : 'Copy JSON'}</span>
              </>
            )}
          </button>
        </div>

        {/* Code Preview */}
        <div className="p-4 flex-1 overflow-auto bg-slate-900 font-mono text-xs text-slate-200">
          <pre className="whitespace-pre">{jsonString}</pre>
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-slate-200 bg-slate-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-semibold rounded-lg bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 transition cursor-pointer"
          >
            {isAr ? 'إغلاق' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
};
