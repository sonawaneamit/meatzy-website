'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type TimePeriod = 'weekly' | 'monthly' | 'yearly';

interface CalculatorState {
  referrals: number;
  avgOrderValue: number;
  growthRate: number;
  timePeriod: TimePeriod;
}

interface CalculatorContextType extends CalculatorState {
  isExpanded: boolean;
  setIsExpanded: (expanded: boolean) => void;
  setReferrals: (value: number) => void;
  setAvgOrderValue: (value: number) => void;
  setGrowthRate: (value: number) => void;
  setTimePeriod: (period: TimePeriod) => void;
  earnings: {
    tier1: number;
    tier2: number;
    tier3: number;
    tier4: number;
    total: number;
  };
}

const CalculatorContext = createContext<CalculatorContextType | undefined>(undefined);

const DEFAULT_STATE: CalculatorState = {
  referrals: 10,
  avgOrderValue: 189,
  growthRate: 2,
  timePeriod: 'monthly',
};

export function CalculatorProvider({ children }: { children: ReactNode }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [state, setState] = useState<CalculatorState>(DEFAULT_STATE);

  // Load state from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('meatzy_calculator_state');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setState(parsed);
      } catch (e) {
        console.error('Failed to parse calculator state:', e);
      }
    }

    const savedExpanded = localStorage.getItem('meatzy_calculator_expanded');
    if (savedExpanded === 'true') {
      setIsExpanded(true);
    }
  }, []);

  // Save state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('meatzy_calculator_state', JSON.stringify(state));
  }, [state]);

  // Save expanded state
  useEffect(() => {
    localStorage.setItem('meatzy_calculator_expanded', String(isExpanded));
  }, [isExpanded]);

  // Calculate earnings based on current state
  const calculateEarnings = () => {
    const { referrals, avgOrderValue, growthRate, timePeriod } = state;

    // Tier 1: Direct referrals (13%)
    const tier1Count = referrals;
    const tier1Monthly = tier1Count * avgOrderValue * 0.13;

    // Tier 2: Each tier 1 brings growthRate people (2%)
    const tier2Count = tier1Count * growthRate;
    const tier2Monthly = tier2Count * avgOrderValue * 0.02;

    // Tier 3: Each tier 2 brings growthRate people (1%)
    const tier3Count = tier2Count * growthRate;
    const tier3Monthly = tier3Count * avgOrderValue * 0.01;

    // Tier 4: Each tier 3 brings growthRate people (1%)
    const tier4Count = tier3Count * growthRate;
    const tier4Monthly = tier4Count * avgOrderValue * 0.01;

    const monthlyTotal = tier1Monthly + tier2Monthly + tier3Monthly + tier4Monthly;

    // Adjust for time period
    let multiplier = 1;
    if (timePeriod === 'weekly') multiplier = 1 / 4;
    if (timePeriod === 'yearly') multiplier = 12;

    return {
      tier1: tier1Monthly * multiplier,
      tier2: tier2Monthly * multiplier,
      tier3: tier3Monthly * multiplier,
      tier4: tier4Monthly * multiplier,
      total: monthlyTotal * multiplier,
    };
  };

  const value: CalculatorContextType = {
    ...state,
    isExpanded,
    setIsExpanded,
    setReferrals: (value) => setState((s) => ({ ...s, referrals: value })),
    setAvgOrderValue: (value) => setState((s) => ({ ...s, avgOrderValue: value })),
    setGrowthRate: (value) => setState((s) => ({ ...s, growthRate: value })),
    setTimePeriod: (period) => setState((s) => ({ ...s, timePeriod: period })),
    earnings: calculateEarnings(),
  };

  return <CalculatorContext.Provider value={value}>{children}</CalculatorContext.Provider>;
}

export function useCalculator() {
  const context = useContext(CalculatorContext);
  if (!context) {
    throw new Error('useCalculator must be used within a CalculatorProvider');
  }
  return context;
}
