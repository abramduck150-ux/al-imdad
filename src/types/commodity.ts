export type CompetitionLevel = 'Very High' | 'High' | 'Medium' | 'Low' | 'Very Low' | 'None';
export type RiskLevel = 'Very High' | 'High' | 'Medium' | 'Low';

export interface LadderLevel {
  level: number;
  level_name: string;
  product_form: string;
  where_it_happens: string;
  price_per_kg_usd: number;
  competition_level: CompetitionLevel;
  risk_level: RiskLevel;
  margin_percent: string;
  who_does_it_now: string;
  opportunity_gap: string;
}

export interface CommodityData {
  id: string;
  commodity: string;
  name_ar: string;
  tagline_ar: string;
  tagline_en: string;
  icon: string;
  color: {
    primary: string;
    light: string;
    dark: string;
    border: string;
    badge: string;
    glow: string;
  };
  typical_annual_export_tons: number;
  key_production_regions: string[];
  ladder: LadderLevel[];
}

export interface SimulationResult {
  rawPricePerKg: number;
  targetPricePerKg: number;
  metricTons: number;
  rawRevenueUSD: number;
  targetRevenueUSD: number;
  valueSurplusUSD: number;
  valueMultiplier: number;
  jobCreationEstimate: number;
}
