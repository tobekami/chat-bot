// components/LanguageSelector.tsx

import { useLanguage } from './LanguageContext';

export default function LanguageSelector() {
  const { language, setLanguage } = useLanguage();

  return (
    <select
      value={language}
      onChange={(e) => setLanguage(e.target.value)}
      className="mb-6 p-2 border rounded"
    >
      <option value="english">English</option>
      <option value="espanol">Español</option>
      <option value="francais">Français</option>
      {/* Add more language options as needed */}
    </select>
  );
}