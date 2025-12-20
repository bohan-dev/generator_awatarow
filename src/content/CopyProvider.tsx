import React, { createContext, useContext, useMemo, useState } from 'react';
import plCopy from './pl-PL.json';
import enCopy from './en-US.json';

type SupportedLocale = 'pl-PL' | 'en-US';

type AppCopy = typeof plCopy;

interface CopyContextValue {
  locale: SupportedLocale;
  setLocale: (locale: SupportedLocale) => void;
  copy: AppCopy;
}

const CopyContext = createContext<CopyContextValue | undefined>(undefined);

export const CopyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [locale, setLocale] = useState<SupportedLocale>('pl-PL');

  const copy = useMemo(() => {
    switch (locale) {
      case 'en-US':
        return enCopy;
      case 'pl-PL':
      default:
        return plCopy;
    }
  }, [locale]);

  const value = useMemo(
    () => ({
      locale,
      setLocale,
      copy,
    }),
    [locale, copy]
  );

  return <CopyContext.Provider value={value}>{children}</CopyContext.Provider>;
};

export const useCopy = (): CopyContextValue => {
  const context = useContext(CopyContext);

  if (!context) {
    throw new Error('useCopy must be used within a CopyProvider');
  }

  return context;
};

export type { SupportedLocale, AppCopy };
