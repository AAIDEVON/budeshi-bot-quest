
import React from 'react';
import { Button } from '../ui/button';
import { DownloadIcon, RefreshCwIcon, SettingsIcon, DatabaseIcon, SunIcon, MoonIcon } from 'lucide-react';
import { toast } from 'sonner';
import { useTheme } from '../ThemeProvider';

interface ChatActionButtonsProps {
  apiKey: string | null;
  fontSize: string;
  onOpenProjectViewer: () => void;
  onClearChat: () => void;
  onDownloadHistory: () => void;
  onSetApiKey: () => void;
  onChangeFontSize: (size: 'small' | 'medium' | 'large') => void;
}

const ChatActionButtons: React.FC<ChatActionButtonsProps> = ({
  apiKey,
  fontSize,
  onOpenProjectViewer,
  onClearChat,
  onDownloadHistory,
  onSetApiKey,
  onChangeFontSize
}) => {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
    toast.success(`${theme === 'dark' ? 'Light' : 'Dark'} mode enabled`, {
      description: "Your theme preference has been saved"
    });
  };

  return (
    <div className="flex justify-end space-x-2 mb-4">
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
          title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
        >
          {theme === 'dark' ? (
            <SunIcon className="h-3.5 w-3.5 mr-1.5" />
          ) : (
            <MoonIcon className="h-3.5 w-3.5 mr-1.5" />
          )}
          {theme === 'dark' ? 'Light' : 'Dark'} Mode
        </Button>
        
        <div className="relative group">
          <Button 
            variant="outline" 
            size="sm" 
            className="text-xs h-8"
          >
            <span className="sr-only">Font Size</span>
            Aa
          </Button>
          <div className="absolute right-0 mt-1 bg-background border rounded-md shadow-md hidden group-hover:block z-10">
            <div className="p-1">
              <button 
                className={`block w-full text-left px-3 py-1.5 text-xs rounded ${fontSize === 'small' ? 'bg-primary/10' : 'hover:bg-muted'}`}
                onClick={() => onChangeFontSize('small')}
              >
                Small
              </button>
              <button 
                className={`block w-full text-left px-3 py-1.5 text-xs rounded ${fontSize === 'medium' ? 'bg-primary/10' : 'hover:bg-muted'}`}
                onClick={() => onChangeFontSize('medium')}
              >
                Medium
              </button>
              <button 
                className={`block w-full text-left px-3 py-1.5 text-xs rounded ${fontSize === 'large' ? 'bg-primary/10' : 'hover:bg-muted'}`}
                onClick={() => onChangeFontSize('large')}
              >
                Large
              </button>
            </div>
          </div>
        </div>
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
