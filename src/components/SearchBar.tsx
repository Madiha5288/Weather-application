
import React, { useState, useEffect, useRef } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useDebounce } from "@/hooks/use-debounce";
import VoiceSearch from "@/components/VoiceSearch";
import { ThemeToggle } from "@/components/ThemeToggle";
import { toast } from "sonner";

interface SearchResult {
  id: string;
  name: string;
  region: string;
  country: string;
  lat: number;
  lon: number;
  url: string;
}

interface SearchBarProps {
  onLocationSelect: (location: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onLocationSelect }) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isResultsOpen, setIsResultsOpen] = useState(false);
  const debouncedQuery = useDebounce(query, 300);
  const resultsRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (debouncedQuery.length >= 2) {
      searchLocations(debouncedQuery);
    } else {
      setResults([]);
      setIsResultsOpen(false);
    }
  }, [debouncedQuery]);

  useEffect(() => {
    // Add event listener to detect clicks outside the results dropdown
    const handleClickOutside = (event: MouseEvent) => {
      if (resultsRef.current && !resultsRef.current.contains(event.target as Node)) {
        setIsResultsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const searchLocations = async (searchQuery: string) => {
    if (searchQuery.trim() === "") return;
    
    setIsLoading(true);
    
    try {
      const response = await fetch(
        `https://api.weatherapi.com/v1/search.json?key=b9d8796e16e84432a5f120309252703&q=${encodeURIComponent(searchQuery)}`
      );
      
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      
      const data = await response.json();
      
      if (data.length === 0) {
        toast.error("Location not found", {
          description: `We couldn't find "${searchQuery}". Please check the spelling or try a different location.`,
          duration: 5000,
        });
      }
      
      setResults(data);
      setIsResultsOpen(data.length > 0);
    } catch (error) {
      console.error("Error searching locations:", error);
      setResults([]);
      toast.error("Search failed", {
        description: "There was a problem connecting to the weather service. Please try again later.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLocationClick = (location: SearchResult) => {
    setQuery(`${location.name}, ${location.country}`);
    setIsResultsOpen(false);
    onLocationSelect(`${location.lat},${location.lon}`);
  };

  const handleVoiceSearch = (transcript: string) => {
    setQuery(transcript);
    searchLocations(transcript);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim().length >= 2) {
      if (results.length > 0) {
        // If we have search results, use the first one
        handleLocationClick(results[0]);
      } else {
        // If no results but user is trying to submit, search again
        searchLocations(query);
      }
    } else if (query.trim() !== "") {
      toast.error("Search query too short", {
        description: "Please enter at least 2 characters to search for a location.",
      });
    }
  };

  return (
    <div className="relative w-full max-w-lg mx-auto" ref={resultsRef}>
      <form onSubmit={handleSubmit} className="flex items-center gap-2">
        <div className="relative flex-1">
          <Input
            type="text"
            placeholder="Search for a location..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => results.length > 0 && setIsResultsOpen(true)}
            className="pr-10 rounded-full border-input"
          />
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            {isLoading ? (
              <div className="h-4 w-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            ) : (
              <Search className="h-4 w-4 text-muted-foreground" />
            )}
          </div>
        </div>
        <Button type="submit" size="icon" variant="ghost" className="rounded-full">
          <Search className="h-4 w-4" />
          <span className="sr-only">Search</span>
        </Button>
        <VoiceSearch onSearch={handleVoiceSearch} />
        <ThemeToggle />
      </form>
      
      {isResultsOpen && results.length > 0 && (
        <Card className="absolute z-50 w-full mt-1 p-2 max-h-60 overflow-auto shadow-lg">
          {results.map((result) => (
            <Button
              key={result.id}
              variant="ghost"
              className="w-full justify-start font-normal mb-1 hover:bg-accent rounded-lg"
              onClick={() => handleLocationClick(result)}
            >
              <div className="truncate text-left">
                {result.name}, {result.region && `${result.region}, `}
                {result.country}
              </div>
            </Button>
          ))}
        </Card>
      )}
    </div>
  );
};

export default SearchBar;
