import React, { useState } from "react";
import { Button } from "../ui/button";
import {
  DownloadIcon,
  RefreshCwIcon,
  SettingsIcon,
  DatabaseIcon,
  SunIcon,
  MoonIcon,
} from "lucide-react";
import { toast } from "sonner";
import { useTheme } from "../ThemeProvider";

interface ChatActionButtonsProps {
  apiKey: string | null;
  fontSize: string;
  onOpenProjectViewer: () => void;
  onClearChat: () => void;
  onDownloadHistory: () => void;
  onSetApiKey: () => void;
  onChangeFontSize: (size: "small" | "medium" | "large") => void;
}

const ChatActionButtons: React.FC<ChatActionButtonsProps> = ({
  apiKey,
  fontSize,
  onOpenProjectViewer,
  onClearChat,
  onDownloadHistory,
  onSetApiKey,
  onChangeFontSize,
}) => {
  const { theme, setTheme } = useTheme();
  const [font, setFont] = useState<"small" | "medium" | "large">("small");

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
    toast.success(`${theme === "dark" ? "Light" : "Dark"} mode enabled`, {
      description: "Your theme preference has been saved",
    });
  };

  // useEffect=(()=>{
  //   onChangeFontSize(font)
  // },[font])

  return (
    <div className="flex gap-3 w-full max-w-3xl py-4 overflow-x-auto overflow-y-hidden">
      <div className="mr-auto flex space-x-2">
        <Button
          variant="outline"
          size="sm"
          className="text-xs h-8"
          onClick={onOpenProjectViewer}
        >
          <DatabaseIcon className="h-3.5 w-3.5 mr-1.5" />
          View Projects
        </Button>
      </div>

      <div className="flex space-x-2">
        <Button
          variant="outline"
          size="sm"
          className="text-xs h-8"
          onClick={toggleTheme}
          title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
        >
          {theme === "dark" ? (
            <SunIcon className="h-3.5 w-3.5 mr-1.5" />
          ) : (
            <MoonIcon className="h-3.5 w-3.5 mr-1.5" />
          )}
          {theme === "dark" ? "Light" : "Dark"} Mode
        </Button>

       
        <select
          className="w-16 border py-1 px-2 rounded-xl bg-background"
          onChange={(event: React.ChangeEvent<HTMLSelectElement>) =>
            onChangeFontSize(event.target.value as "small" | "medium" | "large")
          }
        >
          <option value="">Aa</option>
          <option value="small">Small</option>
          <option value="medium">Medium</option>
          <option value="large">Large</option>
        </select>
       
      </div>

      <Button
        variant="outline"
        size="sm"
        className="text-xs h-8"
        onClick={onSetApiKey}
      >
        <SettingsIcon className="h-3.5 w-3.5 mr-1.5" />
        {apiKey ? "Change API Key" : "Set API Key"}
      </Button>
      <Button
        variant="outline"
        size="sm"
        className="text-xs h-8"
        onClick={onClearChat}
      >
        <RefreshCwIcon className="h-3.5 w-3.5 mr-1.5" />
        New Chat
      </Button>
      <Button
        variant="outline"
        size="sm"
        className="text-xs h-8"
        onClick={onDownloadHistory}
      >
        <DownloadIcon className="h-3.5 w-3.5 mr-1.5" />
        Download
      </Button>
    </div>
  );
};

export default ChatActionButtons;
