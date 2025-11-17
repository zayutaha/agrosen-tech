-- Enable realtime for sensor data
CREATE TABLE IF NOT EXISTS public.sensor_readings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  timestamp TIMESTAMPTZ NOT NULL DEFAULT now(),
  nitrogen INTEGER NOT NULL,
  phosphorus INTEGER NOT NULL,
  potassium INTEGER NOT NULL,
  moisture INTEGER NOT NULL,
  temperature DECIMAL(5,2),
  humidity DECIMAL(5,2),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type TEXT NOT NULL,
  message TEXT NOT NULL,
  severity TEXT NOT NULL CHECK (severity IN ('info', 'warning', 'critical')),
  resolved BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.phenology_stages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  stage_name TEXT NOT NULL,
  start_date TIMESTAMPTZ NOT NULL,
  expected_next_stage TEXT,
  expected_next_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.health_scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  score INTEGER NOT NULL CHECK (score >= 0 AND score <= 100),
  factors JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.user_feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Add indexes for performance
CREATE INDEX idx_sensor_readings_timestamp ON public.sensor_readings(timestamp DESC);
CREATE INDEX idx_alerts_created_at ON public.alerts(created_at DESC);
CREATE INDEX idx_health_scores_created_at ON public.health_scores(created_at DESC);

-- Enable realtime for sensor_readings table
ALTER PUBLICATION supabase_realtime ADD TABLE public.sensor_readings;

-- Enable RLS (making all tables publicly readable for now since no auth)
ALTER TABLE public.sensor_readings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.phenology_stages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.health_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_feedback ENABLE ROW LEVEL SECURITY;

-- Public read policies (since no authentication required)
CREATE POLICY "Allow public read access to sensor readings" ON public.sensor_readings FOR SELECT USING (true);
CREATE POLICY "Allow public read access to alerts" ON public.alerts FOR SELECT USING (true);
CREATE POLICY "Allow public read access to phenology" ON public.phenology_stages FOR SELECT USING (true);
CREATE POLICY "Allow public read access to health scores" ON public.health_scores FOR SELECT USING (true);
CREATE POLICY "Allow public insert to feedback" ON public.user_feedback FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public read access to feedback" ON public.user_feedback FOR SELECT USING (true);

-- Service role policies for edge functions to insert data
CREATE POLICY "Allow service role to insert sensor readings" ON public.sensor_readings FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow service role to insert alerts" ON public.alerts FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow service role to insert phenology" ON public.phenology_stages FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow service role to insert health scores" ON public.health_scores FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow service role to update alerts" ON public.alerts FOR UPDATE USING (true);