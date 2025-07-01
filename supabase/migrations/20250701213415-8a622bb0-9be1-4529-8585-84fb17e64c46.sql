
-- Create table to store analysis results
CREATE TABLE public.sperm_analysis_results (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  file_name TEXT NOT NULL,
  file_type TEXT NOT NULL,
  file_size BIGINT NOT NULL,
  file_url TEXT NOT NULL,
  sperm_count INTEGER NOT NULL DEFAULT 0,
  motility_percentage DECIMAL(5,2) DEFAULT 0,
  morphology_percentage DECIMAL(5,2) DEFAULT 0,
  concentration DECIMAL(10,2) DEFAULT 0,
  confidence_score DECIMAL(5,2) NOT NULL,
  analysis_duration DECIMAL(8,2) NOT NULL,
  detected_objects JSONB DEFAULT '[]'::jsonb,
  image_quality TEXT CHECK (image_quality IN ('excellent', 'good', 'fair', 'poor')) DEFAULT 'good',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.sperm_analysis_results ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own analysis results" 
  ON public.sperm_analysis_results 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own analysis results" 
  ON public.sperm_analysis_results 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own analysis results" 
  ON public.sperm_analysis_results 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own analysis results" 
  ON public.sperm_analysis_results 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Create storage bucket for analysis files
INSERT INTO storage.buckets (id, name, public) 
VALUES ('sperm-analysis-files', 'sperm-analysis-files', false);

-- Create storage policies
CREATE POLICY "Users can upload their own files" 
  ON storage.objects 
  FOR INSERT 
  WITH CHECK (bucket_id = 'sperm-analysis-files' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can view their own files" 
  ON storage.objects 
  FOR SELECT 
  USING (bucket_id = 'sperm-analysis-files' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own files" 
  ON storage.objects 
  FOR DELETE 
  USING (bucket_id = 'sperm-analysis-files' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updated_at
CREATE TRIGGER handle_sperm_analysis_results_updated_at
  BEFORE UPDATE ON public.sperm_analysis_results
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();
