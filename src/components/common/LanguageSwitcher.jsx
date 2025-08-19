import { Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLocalStorage } from "@uidotdev/usehooks";

export default function LanguageSwitcher({ className }) {
  const [, setLanguage] = useLocalStorage("languagePreference", "he");
  const setLanguagePreference = async (language) => {
    // Always save to localStorage for non-logged in users and as a backup
    setLanguage(language);

    // Reload the current page to apply language change
    window.location.reload();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className={className}>
          <Globe className="h-5 w-5" />
          <span className="sr-only">Toggle language</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setLanguagePreference("en")}>
          🇺🇸 English
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setLanguagePreference("he")}>
          🇮🇱 עברית
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
