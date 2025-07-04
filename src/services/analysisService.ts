
import { supabase } from '@/integrations/supabase/client';

export interface DetailedMotilityAnalysis {
  progressive_motility_percentage: number;
  non_progressive_motility_percentage: number;
  immotile_percentage: number;
}

export interface MorphologyAnalysis {
  head_defects_percentage: number;
  midpiece_defects_percentage: number;
  tail_defects_percentage: number;
}

export interface AnalysisResult extends DetailedMotilityAnalysis, MorphologyAnalysis {
  sperm_count: number;
  motility_percentage: number;
  morphology_percentage: number;
  concentration: number;
  confidence_score: number;
  analysis_duration: number;
  image_quality: 'excellent' | 'good' | 'fair' | 'poor';
  detected_objects?: any[];
  vitality_percentage: number;
  volume_ml: number;
  ph_level: number;
  leucocytes_count: number;
  who_classification: 'normozoospermia' | 'oligozoospermia' | 'asthenozoospermia' | 'teratozoospermia' | 'oligoasthenoteratozoospermia' | 'azoospermia';
  analysis_notes?: string;
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
      console.log('Starting analysis for file:', file.name);
      
      // Create FormData for the edge function
      const formData = new FormData();
      formData.append('file', file);
      formData.append('userId', userId);

      console.log('Calling Supabase edge function...');
      
      // Call the Supabase edge function with proper error handling
      const { data, error } = await supabase.functions.invoke('analyze-sperm', {
        body: formData,
      });

      console.log('Edge function response:', { data, error });

      if (error) {
        console.error('Edge function error:', error);
        throw new Error(`تحليل فاشل: ${error.message || 'خطأ في الخادم'}`);
      }

      if (!data || !data.success) {
        console.error('Analysis failed:', data);
        throw new Error(`تحليل فاشل: ${data?.error || 'استجابة غير صحيحة من الخادم'}`);
      }

      console.log('Analysis successful:', data.data);

      return {
        id: data.data.id,
        sperm_count: data.data.sperm_count || 0,
        motility_percentage: data.data.motility_percentage || 0,
        morphology_percentage: data.data.morphology_percentage || 0,
        concentration: data.data.concentration || 0,
        confidence_score: data.data.confidence_score || 0,
        analysis_duration: data.data.analysis_duration || 0,
        image_quality: data.data.image_quality || 'good',
        detected_objects: data.data.detected_objects || [],
        progressive_motility_percentage: data.data.progressive_motility_percentage || 0,
        non_progressive_motility_percentage: data.data.non_progressive_motility_percentage || 0,
        immotile_percentage: data.data.immotile_percentage || 0,
        vitality_percentage: data.data.vitality_percentage || 0,
        head_defects_percentage: data.data.head_defects_percentage || 0,
        midpiece_defects_percentage: data.data.midpiece_defects_percentage || 0,
        tail_defects_percentage: data.data.tail_defects_percentage || 0,
        volume_ml: data.data.volume_ml || 0,
        ph_level: data.data.ph_level || 0,
        leucocytes_count: data.data.leucocytes_count || 0,
        who_classification: data.data.who_classification || 'normozoospermia',
        analysis_notes: data.data.analysis_notes || '',
        file_name: file.name,
        file_type: file.type,
        file_size: file.size,
        file_url: data.data.file_url || '',
        created_at: new Date().toISOString()
      };

    } catch (error: any) {
      console.error('Analysis service error:', error);
      throw new Error(`فشل في تحليل الملف: ${error.message}`);
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

      return data.map(result => {
        // Use type assertion to handle the extended properties
        const extendedResult = result as any;
        
        return {
          id: result.id,
          sperm_count: result.sperm_count,
          motility_percentage: result.motility_percentage || 0,
          morphology_percentage: result.morphology_percentage || 0,
          concentration: result.concentration || 0,
          confidence_score: result.confidence_score,
          analysis_duration: result.analysis_duration,
          image_quality: result.image_quality as 'excellent' | 'good' | 'fair' | 'poor',
          detected_objects: Array.isArray(result.detected_objects) ? result.detected_objects : [],
          progressive_motility_percentage: extendedResult.progressive_motility_percentage || 0,
          non_progressive_motility_percentage: extendedResult.non_progressive_motility_percentage || 0,
          immotile_percentage: extendedResult.immotile_percentage || 0,
          vitality_percentage: extendedResult.vitality_percentage || 0,
          head_defects_percentage: extendedResult.head_defects_percentage || 0,
          midpiece_defects_percentage: extendedResult.midpiece_defects_percentage || 0,
          tail_defects_percentage: extendedResult.tail_defects_percentage || 0,
          volume_ml: extendedResult.volume_ml || 0,
          ph_level: extendedResult.ph_level || 0,
          leucocytes_count: extendedResult.leucocytes_count || 0,
          who_classification: extendedResult.who_classification || 'normozoospermia',
          analysis_notes: extendedResult.analysis_notes || '',
          file_name: result.file_name,
          file_type: result.file_type,
          file_size: result.file_size,
          file_url: result.file_url,
          created_at: result.created_at
        };
      });

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

      // Use type assertion to handle the extended properties
      const extendedData = data as any;

      return {
        id: data.id,
        sperm_count: data.sperm_count,
        motility_percentage: data.motility_percentage || 0,
        morphology_percentage: data.morphology_percentage || 0,
        concentration: data.concentration || 0,
        confidence_score: data.confidence_score,
        analysis_duration: data.analysis_duration,
        image_quality: data.image_quality as 'excellent' | 'good' | 'fair' | 'poor',
        detected_objects: Array.isArray(data.detected_objects) ? data.detected_objects : [],
        progressive_motility_percentage: extendedData.progressive_motility_percentage || 0,
        non_progressive_motility_percentage: extendedData.non_progressive_motility_percentage || 0,
        immotile_percentage: extendedData.immotile_percentage || 0,
        vitality_percentage: extendedData.vitality_percentage || 0,
        head_defects_percentage: extendedData.head_defects_percentage || 0,
        midpiece_defects_percentage: extendedData.midpiece_defects_percentage || 0,
        tail_defects_percentage: extendedData.tail_defects_percentage || 0,
        volume_ml: extendedData.volume_ml || 0,
        ph_level: extendedData.ph_level || 0,
        leucocytes_count: extendedData.leucocytes_count || 0,
        who_classification: extendedData.who_classification || 'normozoospermia',
        analysis_notes: extendedData.analysis_notes || '',
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
