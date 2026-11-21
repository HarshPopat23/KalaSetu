import { createContext, useContext } from 'react'
import { messages } from './messages.js'

export const languages = { en: 'English', hi: 'हिन्दी', gu: 'ગુજરાતી' }
export const Locale = createContext('en')

export function useLocale() {
  const language = useContext(Locale)
  const t = (key, values = {}) => (messages[key]?.[language] ?? key)
    .replace(/\{(\w+)\}/g, (token, name) => values[name] ?? token)
  return { language, t }
}
