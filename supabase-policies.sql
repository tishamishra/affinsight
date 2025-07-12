-- Enable RLS on tables
ALTER TABLE networks ENABLE ROW LEVEL SECURITY;
ALTER TABLE offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Create policies for networks table
CREATE POLICY "Enable read access for all users" ON networks
    FOR SELECT USING (true);

CREATE POLICY "Enable insert for authenticated users" ON networks
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable update for authenticated users" ON networks
    FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Enable delete for authenticated users" ON networks
    FOR DELETE USING (auth.role() = 'authenticated');

-- Create policies for offers table
CREATE POLICY "Enable read access for all users" ON offers
    FOR SELECT USING (true);

CREATE POLICY "Enable insert for authenticated users" ON offers
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable update for authenticated users" ON offers
    FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Enable delete for authenticated users" ON offers
    FOR DELETE USING (auth.role() = 'authenticated');

-- Create policies for reviews table
CREATE POLICY "Enable read access for all users" ON reviews
    FOR SELECT USING (true);

CREATE POLICY "Enable insert for anonymous users" ON reviews
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable update for authenticated users" ON reviews
    FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Enable delete for authenticated users" ON reviews
    FOR DELETE USING (auth.role() = 'authenticated'); 