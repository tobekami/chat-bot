import { useLanguage } from './LanguageContext';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function LanguageSelector() {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="w-full max-w-2xl mb-4">
      <Select value={language} onValueChange={setLanguage}>
        <SelectTrigger className="w-full bg-white/10 backdrop-blur-md text-white border-gray-300">
          <SelectValue placeholder="Select Language" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="english">English</SelectItem>
          <SelectItem value="espanol">Español</SelectItem>
          <SelectItem value="francais">Français</SelectItem>
          {/* Add more language options as needed */}
        </SelectContent>
      </Select>
    </div>
  );
}