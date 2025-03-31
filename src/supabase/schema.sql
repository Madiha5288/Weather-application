
-- Create users preferences table
CREATE TABLE user_preferences (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  temperature_unit TEXT NOT NULL DEFAULT 'celsius',
  wind_speed_unit TEXT NOT NULL DEFAULT 'kph',
  theme TEXT NOT NULL DEFAULT 'system',
  default_location TEXT,
  show_notifications BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create saved locations table
CREATE TABLE saved_locations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  location_name TEXT NOT NULL,
  location_key TEXT NOT NULL,
  is_favorite BOOLEAN DEFAULT false,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, location_key)
);

-- Create recent searches table
CREATE TABLE recent_searches (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  location TEXT NOT NULL,
  location_key TEXT NOT NULL,
  searched_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, location_key)
);

-- Create weather notes table
CREATE TABLE weather_notes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  location_key TEXT NOT NULL,
  date DATE NOT NULL,
  note TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create RLS policies

-- User preferences policy
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own preferences"
  ON user_preferences FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own preferences"
  ON user_preferences FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own preferences"
  ON user_preferences FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Saved locations policy
ALTER TABLE saved_locations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own saved locations"
  ON saved_locations FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own saved locations"
  ON saved_locations FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own saved locations"
  ON saved_locations FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own saved locations"
  ON saved_locations FOR DELETE
  USING (auth.uid() = user_id);

-- Recent searches policy
ALTER TABLE recent_searches ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own recent searches"
  ON recent_searches FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert or update their own recent searches"
  ON recent_searches FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Weather notes policy
ALTER TABLE weather_notes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own weather notes"
  ON weather_notes FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own weather notes"
  ON weather_notes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own weather notes"
  ON weather_notes FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own weather notes"
  ON weather_notes FOR DELETE
  USING (auth.uid() = user_id);

-- Create functions for managing recent searches
CREATE OR REPLACE FUNCTION update_recent_search()
RETURNS TRIGGER AS $$
BEGIN
  -- Update timestamp if location already exists
  IF EXISTS (SELECT 1 FROM recent_searches 
             WHERE user_id = NEW.user_id AND location_key = NEW.location_key) THEN
    UPDATE recent_searches 
    SET searched_at = NOW()
    WHERE user_id = NEW.user_id AND location_key = NEW.location_key;
    RETURN NULL;
  END IF;
  
  -- Keep only the 10 most recent searches
  DELETE FROM recent_searches
  WHERE user_id = NEW.user_id
  AND id NOT IN (
    SELECT id FROM recent_searches
    WHERE user_id = NEW.user_id
    ORDER BY searched_at DESC
    LIMIT 9
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER manage_recent_searches
BEFORE INSERT ON recent_searches
FOR EACH ROW
EXECUTE FUNCTION update_recent_search();
