
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Mic, MicOff } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface VoiceSearchProps {
  onSearch: (query: string) => void;
}

const VoiceSearch: React.FC<VoiceSearchProps> = ({ onSearch }) => {
  const [isListening, setIsListening] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const startListening = async () => {
    setError(null);
    
    try {
      // Check if browser supports speech recognition
      if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
        setError("Your browser doesn't support voice search");
        toast({
          title: "Voice Search Unavailable",
          description: "Your browser doesn't support voice search",
          variant: "destructive"
        });
        return;
      }
      
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      
      recognition.lang = 'en-US';
      recognition.continuous = false;
      recognition.interimResults = false;
      
      recognition.onstart = () => {
        setIsListening(true);
      };
      
      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setIsListening(false);
        
        if (transcript) {
          toast({
            title: "Voice Input",
            description: `Searching for: "${transcript}"`,
          });
          onSearch(transcript);
        }
      };
      
      recognition.onerror = (event) => {
        setIsListening(false);
        setError(`Error: ${event.error}`);
        toast({
          title: "Voice Search Error",
          description: `Error: ${event.error}`,
          variant: "destructive"
        });
      };
      
      recognition.onend = () => {
        setIsListening(false);
      };
      
      recognition.start();
      
    } catch (err) {
      setIsListening(false);
      setError("Error starting voice search");
      toast({
        title: "Voice Search Error",
        description: "Could not start voice search",
        variant: "destructive"
      });
      console.error("Voice search error:", err);
    }
  };
  
  const stopListening = () => {
    setIsListening(false);
    // If we could access the recognition object outside the startListening function,
    // we would call recognition.stop() here
    window.speechSynthesis?.cancel();
  };
  
  return (
    <Button 
      variant="outline"
      size="icon"
      className={`rounded-full transition-all duration-200 ${isListening ? 'bg-primary text-primary-foreground animate-pulse' : ''}`}
      onClick={isListening ? stopListening : startListening}
      title={isListening ? "Stop voice search" : "Search by voice"}
    >
      {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
    </Button>
  );
};

export default VoiceSearch;
