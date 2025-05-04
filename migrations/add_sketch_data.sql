-- Add the sketch_data column to the projects table
ALTER TABLE projects ADD COLUMN IF NOT EXISTS sketch_data TEXT; 