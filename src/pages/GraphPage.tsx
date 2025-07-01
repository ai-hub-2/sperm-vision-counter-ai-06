
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, BarChart3, LineChart, PieChart } from 'lucide-react';
import { LineChart as RechartsLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart as RechartsBarChart, Bar, PieChart as RechartsPieChart, Pie, Cell } from 'recharts';
import { analysisService } from '@/services/analysisService';
import { useAuth } from '@/hooks/useAuth';

const GraphPage = () => {
  const { user } = useAuth();
  const [chartType, setChartType] = useState<'line' | 'bar' | 'pie'>('line');
  const [analysisHistory, setAnalysisHistory] = useState<any[]>([]);

  useEffect(() => {
    if (user) {
      loadAnalysisHistory();
    }
  }, [user]);

  const loadAnalysisHistory = async () => {
    if (!user) return;
    
    try {
      const history = await analysisService.getUserAnalysisHistory(user.id);
      setAnalysisHistory(history);
    } catch (error) {
      console.error('Error loading analysis history:', error);
    }
  };

  // Generate chart data from real analysis history
  const generateChartData = () => {
    if (analysisHistory.length === 0) {
      // Generate sample data if no history
      return Array.from({ length: 7 }, (_, i) => ({
        day: `Day ${i + 1}`,
        spermCount: Math.floor(Math.random() * 200) + 50,
        confidence: Math.floor(Math.random() * 30) + 70,
        quality: Math.floor(Math.random() * 40) + 60
      }));
    }

    return analysisHistory.slice(-7).map((analysis, index) => ({
      day: `تحليل ${index + 1}`,
      spermCount: analysis.sperm_count,
      confidence: Math.round(analysis.confidence),
      quality: analysis.image_quality === 'excellent' ? 100 : 
               analysis.image_quality === 'good' ? 80 : 
               analysis.image_quality === 'fair' ? 60 : 40
    }));
  };

  const chartData = generateChartData();

  const pieData = [
    { name: 'ممتاز', value: chartData.filter(d => d.quality > 90).length, color: '#00B4D8' },
    { name: 'جيد', value: chartData.filter(d => d.quality > 70 && d.quality <= 90).length, color: '#90E0EF' },
    { name: 'متوسط', value: chartData.filter(d => d.quality > 50 && d.quality <= 70).length, color: '#CAF0F8' },
    { name: 'ضعيف', value: chartData.filter(d => d.quality <= 50).length, color: '#ADE8F4' }
  ];

  const exportChart = () => {
    // In a real app, this would generate and download the chart as an image
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (ctx) {
      // Export logic would go here
      console.log('Exporting chart...');
    }
  };

  const renderChart = () => {
    switch (chartType) {
      case 'line':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <RechartsLineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="day" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1A2332', 
                  border: '1px solid #00B4D8',
                  borderRadius: '8px'
                }}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="spermCount" 
                stroke="#00B4D8" 
                strokeWidth={3}
                name="عدد الحيوانات المنوية"
              />
              <Line 
                type="monotone" 
                dataKey="confidence" 
                stroke="#90E0EF" 
                strokeWidth={2}
                name="دقة التحليل (%)"
              />
            </RechartsLineChart>
          </ResponsiveContainer>
        );
      
      case 'bar':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <RechartsBarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="day" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1A2332', 
                  border: '1px solid #00B4D8',
                  borderRadius: '8px'
                }}
              />
              <Legend />
              <Bar dataKey="spermCount" fill="#00B4D8" name="عدد الحيوانات المنوية" />
              <Bar dataKey="quality" fill="#90E0EF" name="جودة العينة" />
            </RechartsBarChart>
          </ResponsiveContainer>
        );
      
      case 'pie':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <RechartsPieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1A2332', 
                  border: '1px solid #00B4D8',
                  borderRadius: '8px'
                }}
              />
            </RechartsPieChart>
          </ResponsiveContainer>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#0D1B2A] p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white mb-2">الرسوم البيانية</h1>
          <p className="text-gray-400">تحليل بيانات الفحوصات السابقة</p>
        </div>

        {/* Chart Type Selector */}
        <Card className="bg-[#1A2332] border-[#00B4D8]/20 p-4">
          <div className="flex gap-2 justify-center">
            <Button
              variant={chartType === 'line' ? 'default' : 'outline'}
              onClick={() => setChartType('line')}
              className={chartType === 'line' ? 'bg-[#00B4D8] text-white' : 'border-[#00B4D8] text-[#00B4D8]'}
            >
              <LineChart className="w-4 h-4 mr-2" />
              خطي
            </Button>
            <Button
              variant={chartType === 'bar' ? 'default' : 'outline'}
              onClick={() => setChartType('bar')}
              className={chartType === 'bar' ? 'bg-[#00B4D8] text-white' : 'border-[#00B4D8] text-[#00B4D8]'}
            >
              <BarChart3 className="w-4 h-4 mr-2" />
              أعمدة
            </Button>
            <Button
              variant={chartType === 'pie' ? 'default' : 'outline'}
              onClick={() => setChartType('pie')}
              className={chartType === 'pie' ? 'bg-[#00B4D8] text-white' : 'border-[#00B4D8] text-[#00B4D8]'}
            >
              <PieChart className="w-4 h-4 mr-2" />
              دائري
            </Button>
          </div>
        </Card>

        {/* Chart Display */}
        <Card className="bg-[#1A2332] border-[#00B4D8]/20 p-6">
          <div className="mb-4 flex justify-between items-center">
            <h3 className="text-xl font-semibold text-white">
              {chartType === 'line' && 'الاتجاه الزمني للتحليلات'}
              {chartType === 'bar' && 'مقارنة النتائج'}
              {chartType === 'pie' && 'توزيع جودة العينات'}
            </h3>
            <Button
              onClick={exportChart}
              variant="outline"
              className="border-[#00B4D8] text-[#00B4D8] hover:bg-[#00B4D8]/10"
            >
              <Download className="w-4 h-4 mr-2" />
              تصدير
            </Button>
          </div>
          {renderChart()}
        </Card>

        {/* Statistics Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="bg-[#1A2332] border-[#00B4D8]/20 p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-[#00B4D8] mb-1">
                {chartData.length}
              </div>
              <div className="text-sm text-gray-400">إجمالي التحليلات</div>
            </div>
          </Card>
          
          <Card className="bg-[#1A2332] border-[#00B4D8]/20 p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400 mb-1">
                {Math.round(chartData.reduce((sum, d) => sum + d.spermCount, 0) / chartData.length)}
              </div>
              <div className="text-sm text-gray-400">متوسط العدد</div>
            </div>
          </Card>
          
          <Card className="bg-[#1A2332] border-[#00B4D8]/20 p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-400 mb-1">
                {Math.round(chartData.reduce((sum, d) => sum + d.confidence, 0) / chartData.length)}%
              </div>
              <div className="text-sm text-gray-400">متوسط الدقة</div>
            </div>
          </Card>
          
          <Card className="bg-[#1A2332] border-[#00B4D8]/20 p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-400 mb-1">
                {Math.max(...chartData.map(d => d.spermCount))}
              </div>
              <div className="text-sm text-gray-400">أعلى عدد</div>
            </div>
          </Card>
        </div>

        {/* Export Options */}
        <Card className="bg-[#1A2332] border-[#00B4D8]/20 p-6">
          <h3 className="text-xl font-semibold text-white mb-4">خيارات التصدير</h3>
          <div className="grid grid-cols-2 gap-4">
            <Button
              onClick={exportChart}
              variant="outline"
              className="border-[#00B4D8] text-[#00B4D8] hover:bg-[#00B4D8]/10"
            >
              <Download className="w-4 h-4 mr-2" />
              تصدير كصورة PNG
            </Button>
            <Button
              onClick={() => {
                const dataStr = JSON.stringify(chartData, null, 2);
                const dataBlob = new Blob([dataStr], { type: 'application/json' });
                const url = URL.createObjectURL(dataBlob);
                const link = document.createElement('a');
                link.href = url;
                link.download = 'analysis-data.json';
                link.click();
              }}
              variant="outline"
              className="border-[#00B4D8] text-[#00B4D8] hover:bg-[#00B4D8]/10"
            >
              <Download className="w-4 h-4 mr-2" />
              تصدير البيانات JSON
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default GraphPage;
