
import { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { searchLocations, SearchResult } from "@/services/weatherApi";
import { Search, MapPin } from "lucide-react";

interface SearchBarProps {
  onLocationSelect: (location: string) => void;
}

const SearchBar = ({ onLocationSelect }: SearchBarProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (searchQuery.length < 2) {
      setSearchResults([]);
      return;
    }

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(async () => {
      setIsLoading(true);
      try {
        const results = await searchLocations(searchQuery);
        setSearchResults(results);
        setIsOpen(results.length > 0);
      } catch (error) {
        console.error("Error searching locations:", error);
      } finally {
        setIsLoading(false);
      }
    }, 500);

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [searchQuery]);

  const handleLocationSelect = (location: SearchResult) => {
    const locationString = `${location.lat},${location.lon}`;
    onLocationSelect(locationString);
    setSearchQuery(`${location.name}, ${location.country}`);
    setIsOpen(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.length > 0) {
      onLocationSelect(searchQuery);
      setIsOpen(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <form onSubmit={handleSubmit} className="relative">
        <Popover open={isOpen} onOpenChange={setIsOpen}>
          <PopoverTrigger asChild>
            <div className="relative">
              <Input
                ref={inputRef}
                type="text"
                placeholder="Search for a location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pr-10 focus:ring-2 focus:ring-sky w-full"
                autoComplete="off"
              />
              <Button 
                type="submit"
                size="icon"
                variant="ghost"
                className="absolute right-0 top-0 h-full aspect-square text-muted-foreground hover:text-foreground"
              >
                <Search className="h-4 w-4" />
                <span className="sr-only">Search</span>
              </Button>
            </div>
          </PopoverTrigger>
          <PopoverContent 
            className="p-0 w-[var(--radix-popover-trigger-width)] max-h-[300px] overflow-y-auto"
            align="start"
          >
            {isLoading ? (
              <div className="p-4 text-center text-sm text-muted-foreground">
                Searching locations...
              </div>
            ) : searchResults.length > 0 ? (
              <ul className="py-2">
                {searchResults.map((result) => (
                  <li key={`${result.name}-${result.lat}-${result.lon}`}>
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-left px-4 py-2 flex items-center gap-2"
                      onClick={() => handleLocationSelect(result)}
                    >
                      <MapPin className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                      <div>
                        <span className="font-medium">{result.name}</span>
                        {result.region && (
                          <span className="text-muted-foreground">, {result.region}</span>
                        )}
                        <span className="text-muted-foreground ml-1">{result.country}</span>
                      </div>
                    </Button>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="p-4 text-center text-sm text-muted-foreground">
                No locations found
              </div>
            )}
          </PopoverContent>
        </Popover>
      </form>
    </div>
  );
};

export default SearchBar;
