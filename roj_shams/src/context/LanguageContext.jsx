import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { translations } from '../data/translations'

const STORAGE_KEY = 'shamsroj_lang'

const LanguageContext = createContext(null)

export function LanguageProvider({ children }) {
  const [lang, setLangState] = useState(() => {
    try {
      return localStorage.getItem(STORAGE_KEY) || 'EN'
    } catch {
      return 'EN'
    }
  })

  useEffect(() => {
    document.documentElement.dir = lang === 'AR' ? 'rtl' : 'ltr'
    document.documentElement.lang = lang === 'AR' ? 'ar' : 'en'
    try {
      localStorage.setItem(STORAGE_KEY, lang)
    } catch (_) {}
  }, [lang])

  const setLang = useCallback((next) => {
    setLangState(next === 'AR' ? 'AR' : 'EN')
  }, [])

  const t = useCallback(
    (key) => {
      const data = translations[lang] || translations.EN
      const value = data[key]
      return value != null ? value : (translations.EN[key] ?? key)
    },
    [lang]
  )

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const ctx = useContext(LanguageContext)
  if (!ctx) {
    return {
      lang: 'EN',
      setLang: () => {},
      t: (key) => key,
    }
  }
  return ctx
}
