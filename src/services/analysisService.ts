
import { supabase } from '@/integrations/supabase/client';

export interface AnalysisResult {
  sperm_count: number;
  motility_percentage: number;
  morphology_percentage: number;
  concentration: number;
  confidence_score: number;
  analysis_duration: number;
  image_quality: 'excellent' | 'good' | 'fair' | 'poor';
  detected_objects?: any[];
}

export interface SavedAnalysisResult extends AnalysisResult {
  id: string;
  file_name: string;
  file_type: string;
  file_size: number;
  file_url: string;
  created_at: string;
}

class AnalysisService {
  async analyzeFile(file: File, userId: string): Promise<SavedAnalysisResult> {
    try {
      // Create FormData for the edge function
      const formData = new FormData();
      formData.append('file', file);
      formData.append('userId', userId);

      // Call the Supabase edge function
      const { data, error } = await supabase.functions.invoke('analyze-sperm', {
        body: formData,
      });

      if (error) {
        console.error('Edge function error:', error);
        throw new Error(`Analysis failed: ${error.message}`);
      }

      if (!data.success) {
        throw new Error(`Analysis failed: ${data.error || 'Unknown error'}`);
      }

      return {
        id: data.data.id,
        sperm_count: data.data.sperm_count,
        motility_percentage: data.data.motility_percentage,
        morphology_percentage: data.data.morphology_percentage,
        concentration: data.data.concentration,
        confidence_score: data.data.confidence_score,
        analysis_duration: data.data.analysis_duration,
        image_quality: data.data.image_quality,
        detected_objects: data.data.detected_objects || [],
        file_name: file.name,
        file_type: file.type,
        file_size: file.size,
        file_url: data.data.file_url,
        created_at: new Date().toISOString()
      };

    } catch (error: any) {
      console.error('Analysis service error:', error);
      throw new Error(`Failed to analyze file: ${error.message}`);
    }
  }

  async getUserAnalysisHistory(userId: string): Promise<SavedAnalysisResult[]> {
    try {
      const { data, error } = await supabase
        .from('sperm_analysis_results')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Database error:', error);
        throw new Error(`Failed to fetch analysis history: ${error.message}`);
      }

      return data.map(result => ({
        id: result.id,
        sperm_count: result.sperm_count,
        motility_percentage: result.motility_percentage || 0,
        morphology_percentage: result.morphology_percentage || 0,
        concentration: result.concentration || 0,
        confidence_score: result.confidence_score,
        analysis_duration: result.analysis_duration,
        image_quality: result.image_quality as 'excellent' | 'good' | 'fair' | 'poor',
        detected_objects: result.detected_objects || [],
        file_name: result.file_name,
        file_type: result.file_type,
        file_size: result.file_size,
        file_url: result.file_url,
        created_at: result.created_at
      }));

    } catch (error: any) {
      console.error('Error fetching analysis history:', error);
      return [];
    }
  }

  async deleteAnalysisResult(resultId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('sperm_analysis_results')
        .delete()
        .eq('id', resultId);

      if (error) {
        throw new Error(`Failed to delete analysis result: ${error.message}`);
      }
    } catch (error: any) {
      console.error('Error deleting analysis result:', error);
      throw error;
    }
  }

  async getAnalysisById(resultId: string): Promise<SavedAnalysisResult | null> {
    try {
      const { data, error } = await supabase
        .from('sperm_analysis_results')
        .select('*')
        .eq('id', resultId)
        .single();

      if (error) {
        console.error('Database error:', error);
        return null;
      }

      return {
        id: data.id,
        sperm_count: data.sperm_count,
        motility_percentage: data.motility_percentage || 0,
        morphology_percentage: data.morphology_percentage || 0,
        concentration: data.concentration || 0,
        confidence_score: data.confidence_score,
        analysis_duration: data.analysis_duration,
        image_quality: data.image_quality as 'excellent' | 'good' | 'fair' | 'poor',
        detected_objects: data.detected_objects || [],
        file_name: data.file_name,
        file_type: data.file_type,
        file_size: data.file_size,
        file_url: data.file_url,
        created_at: data.created_at
      };

    } catch (error: any) {
      console.error('Error fetching analysis by ID:', error);
      return null;
    }
  }
}

export const analysisService = new AnalysisService();
