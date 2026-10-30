import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateMultiplier,
  parseMarginPercent,
  calculateEconomicImpact,
  formatCurrencyUSD,
  calculateSweetSpotScore,
  generateCustomLadder,
} from './ladderCalculations';
import { LadderLevel } from '../types/commodity';

test('calculateMultiplier computes accurate multiplier ratios', () => {
  assert.equal(calculateMultiplier(2, 4), 2);
  assert.equal(calculateMultiplier(2, 120), 60);
  assert.equal(calculateMultiplier(2, 3500), 1750);
  assert.equal(calculateMultiplier(65000, 25000000), 384.6);
  assert.equal(calculateMultiplier(0, 100), 1);
});

test('parseMarginPercent correctly extracts percentages', () => {
  assert.equal(parseMarginPercent('5%'), 5);
  assert.equal(parseMarginPercent('150%'), 150);
  assert.equal(parseMarginPercent('2000%'), 2000);
  assert.equal(parseMarginPercent(''), 0);
});

test('calculateEconomicImpact computes raw vs target revenue surplus', () => {
  // 10,000 tons of Karkade: raw price $2/kg, target price $120/kg (L6 Branded Pop)
  const result = calculateEconomicImpact(2, 120, 10_000);
  // 10,000 tons = 10,000,000 kg
  // raw revenue: $20,000,000 ($20M)
  // target revenue: $1,200,000,000 ($1.2B)
  // surplus: $1,180,000,000
  assert.equal(result.rawRevenueUSD, 20_000_000);
  assert.equal(result.targetRevenueUSD, 1_200_000_000);
  assert.equal(result.valueSurplusUSD, 1_180_000_000);
  assert.equal(result.valueMultiplier, 60);
  assert.ok(result.jobCreationEstimate > 0);
});

test('formatCurrencyUSD produces readable string tokens', () => {
  assert.equal(formatCurrencyUSD(1_500_000_000), '$1.50B');
  assert.equal(formatCurrencyUSD(25_000_000), '$25.00M');
  assert.equal(formatCurrencyUSD(3_500), '$3.5k');
  assert.equal(formatCurrencyUSD(45), '$45');
});

test('generateCustomLadder generates 10 levels with logical price progression', () => {
  const ladder = generateCustomLadder('الفول السوداني', 1.5);
  assert.equal(ladder.length, 10);
  assert.equal(ladder[0].price_per_kg_usd, 1.5);
  assert.ok(ladder[9].price_per_kg_usd > ladder[0].price_per_kg_usd);
  assert.equal(ladder[0].level, 1);
  assert.equal(ladder[9].level, 10);
});

test('calculateSweetSpotScore rewards high margin and low competition/risk', () => {
  const levelLowCompHighMargin: LadderLevel = {
    level: 6,
    level_name: 'BRANDED EXPERIENCE',
    product_form: 'Karkade Pop',
    where_it_happens: 'Plant',
    price_per_kg_usd: 120,
    competition_level: 'Low',
    risk_level: 'Low',
    margin_percent: '150%',
    who_does_it_now: 'None',
    opportunity_gap: 'Massive',
  };

  const levelRawSaturated: LadderLevel = {
    level: 1,
    level_name: 'RAW',
    product_form: 'Raw sack',
    where_it_happens: 'Farm',
    price_per_kg_usd: 2,
    competition_level: 'Very High',
    risk_level: 'Very High',
    margin_percent: '5%',
    who_does_it_now: 'Everyone',
    opportunity_gap: 'Crowded',
  };

  const highSweetSpot = calculateSweetSpotScore(levelLowCompHighMargin);
  const lowSweetSpot = calculateSweetSpotScore(levelRawSaturated);

  assert.ok(highSweetSpot > 70, `Expected sweet spot score > 70, got ${highSweetSpot}`);
  assert.ok(lowSweetSpot < 25, `Expected raw sweet spot score < 25, got ${lowSweetSpot}`);
});
