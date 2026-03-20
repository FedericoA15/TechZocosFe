import { describe, it, expect } from 'vitest';
import { translations } from './LanguageContext';

describe('LanguageContext translations', () => {
  const esKeys = Object.keys(translations.es);
  const enKeys = Object.keys(translations.en);

  it('should have the same number of keys in both languages', () => {
    expect(esKeys.length).toBe(enKeys.length);
  });

  it('should have matching keys in ES and EN', () => {
    const missingInEn = esKeys.filter(k => !enKeys.includes(k));
    const missingInEs = enKeys.filter(k => !esKeys.includes(k));

    expect(missingInEn).toEqual([]);
    expect(missingInEs).toEqual([]);
  });

  it('should not have empty values in Spanish translations', () => {
    const emptyKeys = esKeys.filter(k => translations.es[k].trim() === '');
    expect(emptyKeys).toEqual([]);
  });

  it('should not have empty values in English translations', () => {
    const emptyKeys = enKeys.filter(k => translations.en[k].trim() === '');
    expect(emptyKeys).toEqual([]);
  });

  it('should have specific critical keys defined', () => {
    const criticalKeys = [
      'loginTitle', 'loginButton', 'logout',
      'navDashboard', 'navProfile', 'navStudies', 'navAddresses',
      'save', 'cancel', 'edit', 'delete', 'add',
      'successAdd', 'successUpdate', 'successDelete',
      'user', 'active',
    ];

    for (const key of criticalKeys) {
      expect(translations.es[key], `Missing ES key: ${key}`).toBeDefined();
      expect(translations.en[key], `Missing EN key: ${key}`).toBeDefined();
    }
  });

  it('should have different values for ES and EN for most keys', () => {
    // Some keys may be the same (e.g. "Email", "Dashboard")
    const sameValues = esKeys.filter(k => translations.es[k] === translations.en[k]);
    // Allow up to 30% of keys to be the same (brand names, tech terms)
    expect(sameValues.length).toBeLessThan(esKeys.length * 0.3);
  });
});
