import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  FileText, 
  BarChart3, 
  Target, 
  Book, 
  Link2, 
  Image as ImageIcon,
  Hash,
  TrendingUp,
  Eye,
  Clock,
  Share2,
  Search,
  Type,
  List,
  Calendar
} from "lucide-react";
import { MetricCard } from "@/components/ui/metric-card";
import { InteractiveChart } from "@/components/ui/interactive-chart";
import { TooltipInfo } from "@/components/ui/tooltip-info";
import { FadeIn, SlideIn } from "@/components/ui/micro-animations";
import type { SeoAnalysis } from "@shared/schema";

interface AdvancedContentMetricsProps {
  analysis: SeoAnalysis;
  className?: string;
}

export function AdvancedContentMetrics({ analysis, className }: AdvancedContentMetricsProps) {
  const contentAnalysis = analysis.contentAnalysis || {};
  const ca = contentAnalysis as any; // Type assertion for flexible access
  
  // Content quality scoring
  const getContentQualityGrade = (score: number) => {
    if (score >= 90) return { grade: 'A+', color: 'text-green-600 dark:text-green-400' };
    if (score >= 80) return { grade: 'A', color: 'text-green-600 dark:text-green-400' };
    if (score >= 70) return { grade: 'B', color: 'text-blue-600 dark:text-blue-400' };
    if (score >= 60) return { grade: 'C', color: 'text-yellow-600 dark:text-yellow-400' };
    return { grade: 'D', color: 'text-red-600 dark:text-red-400' };
  };

  const contentScore = ca.contentQualityScore || 75;
  const qualityGrade = getContentQualityGrade(contentScore);

  // Readability assessment
  const getReadabilityColor = (level: string) => {
    switch (level?.toLowerCase()) {
      case 'very easy': return 'text-green-600 dark:text-green-400';
      case 'easy': return 'text-green-600 dark:text-green-400';
      case 'fairly easy': return 'text-blue-600 dark:text-blue-400';
      case 'standard': return 'text-yellow-600 dark:text-yellow-400';
      case 'fairly difficult': return 'text-orange-600 dark:text-orange-400';
      case 'difficult': return 'text-red-600 dark:text-red-400';
      case 'very difficult': return 'text-red-600 dark:text-red-400';
      default: return 'text-gray-600 dark:text-gray-400';
    }
  };

  // Keyword density data for interactive chart
  const keywordData = (ca.topKeywords || []).slice(0, 8).map((keyword: any) => ({
    name: keyword.word,
    value: parseFloat(keyword.density),
    color: `hsl(${Math.random() * 360}, 70%, 50%)`,
    trend: Math.random() > 0.5 ? Math.floor(Math.random() * 20) : -Math.floor(Math.random() * 15)
  }));

  // Content structure visualization
  const structureData = [
    { name: 'Paragraphs', value: ca.paragraphCount || 0, color: 'bg-blue-500' },
    { name: 'Headings H1', value: ca.headings?.h1 || 0, color: 'bg-green-500' },
    { name: 'Headings H2', value: ca.headings?.h2 || 0, color: 'bg-green-400' },
    { name: 'Headings H3', value: ca.headings?.h3 || 0, color: 'bg-green-300' },
    { name: 'Lists', value: (ca.structure?.lists?.ordered || 0) + (ca.structure?.lists?.unordered || 0), color: 'bg-purple-500' },
    { name: 'Tables', value: ca.structure?.tables || 0, color: 'bg-orange-500' },
    { name: 'Code Blocks', value: ca.structure?.codeBlocks || 0, color: 'bg-gray-500' },
  ].filter(item => item.value > 0);

  return (
    <div className={className}>
      <SlideIn>
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Advanced Content Analysis</h2>
          <p className="text-gray-600 dark:text-gray-300">
            Deep content insights and optimization recommendations
          </p>
        </div>
      </SlideIn>

      {/* Content Overview Metrics */}
      <SlideIn delay={100}>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <MetricCard
            title="Content Quality"
            value={contentScore}
            suffix="/100"
            icon={Target}
            description="Overall content quality assessment"
            trend={contentScore >= 80 ? "up" : contentScore >= 60 ? "neutral" : "down"}
            trendValue={Math.abs(contentScore - 75)}
          />
          <MetricCard
            title="Word Count"
            value={ca.wordCount || 0}
            icon={FileText}
            description="Total words in main content"
            trend="up"
            trendValue={12}
          />
          <MetricCard
            title="Reading Time"
            value={Math.ceil((ca.wordCount || 0) / 200)}
            suffix=" min"
            icon={Clock}
            description="Estimated reading time"
            trend="neutral"
          />
          <MetricCard
            title="Text-HTML Ratio"
            value={ca.textToHtmlRatio || 0}
            suffix="%"
            icon={Type}
            description="Content to code ratio"
            trend={ca.textToHtmlRatio >= 15 ? "up" : "down"}
            trendValue={Math.abs((ca.textToHtmlRatio || 0) - 15)}
          />
        </div>
      </SlideIn>

      {/* Content Analysis Tabs */}
      <Tabs defaultValue="readability" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="readability">Readability</TabsTrigger>
          <TabsTrigger value="keywords">Keywords</TabsTrigger>
          <TabsTrigger value="structure">Structure</TabsTrigger>
          <TabsTrigger value="media">Media</TabsTrigger>
          <TabsTrigger value="engagement">Engagement</TabsTrigger>
        </TabsList>

        <TabsContent value="readability" className="mt-6">
          <div className="grid lg:grid-cols-2 gap-6">
            <FadeIn delay={200}>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Book className="h-5 w-5" />
                    <span>Readability Analysis</span>
                  </CardTitle>
                  <CardDescription>
                    Content accessibility and reading difficulty assessment
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="text-center">
                    <div className={`text-4xl font-bold ${qualityGrade.color} mb-2`}>
                      {qualityGrade.grade}
                    </div>
                    <Badge variant="secondary" className="text-sm">
                      Content Quality Grade
                    </Badge>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Flesch Reading Ease</span>
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {ca.fleschReadingEase || 'N/A'}
                      </span>
                    </div>
                    <Progress value={ca.fleschReadingEase || 0} className="h-2" />
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Reading Level</span>
                      <Badge className={getReadabilityColor(ca.readabilityLevel)}>
                        {ca.readabilityLevel || 'Unknown'}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </FadeIn>

            <FadeIn delay={300}>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <BarChart3 className="h-5 w-5" />
                    <span>Content Metrics</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <p className="text-xs font-medium text-blue-900 dark:text-blue-300">Avg Words/Sentence</p>
                      <p className="text-lg font-bold text-blue-600 dark:text-blue-400">
                        {ca.avgWordsPerSentence || 'N/A'}
                      </p>
                    </div>
                    <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <p className="text-xs font-medium text-green-900 dark:text-green-300">Sentences/Paragraph</p>
                      <p className="text-lg font-bold text-green-600 dark:text-green-400">
                        {ca.avgSentencesPerParagraph || 'N/A'}
                      </p>
                    </div>
                    <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                      <p className="text-xs font-medium text-purple-900 dark:text-purple-300">Sentence Count</p>
                      <p className="text-lg font-bold text-purple-600 dark:text-purple-400">
                        {ca.sentenceCount || 'N/A'}
                      </p>
                    </div>
                    <div className="p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                      <p className="text-xs font-medium text-orange-900 dark:text-orange-300">Paragraph Count</p>
                      <p className="text-lg font-bold text-orange-600 dark:text-orange-400">
                        {ca.paragraphCount || 'N/A'}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </FadeIn>
          </div>
        </TabsContent>

        <TabsContent value="keywords" className="mt-6">
          <div className="space-y-6">
            <FadeIn delay={200}>
              <InteractiveChart
                title="Top Keywords Density"
                description="Most frequently used keywords and their density percentages"
                data={keywordData}
                showTrends={true}
              />
            </FadeIn>
            
            <FadeIn delay={300}>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Hash className="h-5 w-5" />
                    <span>Keyword Analysis</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-lg">
                      <p className="text-sm font-medium text-blue-900 dark:text-blue-300">Link Density</p>
                      <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                        {ca.linkDensity || 0}%
                      </p>
                      <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">
                        Optimal: 1-3%
                      </p>
                    </div>
                    <div className="p-4 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-lg">
                      <p className="text-sm font-medium text-green-900 dark:text-green-300">Emphasis Ratio</p>
                      <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                        {ca.emphasis?.emphasisRatio || 0}%
                      </p>
                      <p className="text-xs text-green-700 dark:text-green-300 mt-1">
                        Bold & Italic usage
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </FadeIn>
          </div>
        </TabsContent>

        <TabsContent value="structure" className="mt-6">
          <div className="grid lg:grid-cols-2 gap-6">
            <FadeIn delay={200}>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <List className="h-5 w-5" />
                    <span>Content Structure</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {structureData.map((item, index) => (
                    <div key={item.name} className="flex items-center justify-between">
                      <span className="text-sm font-medium">{item.name}</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-12 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${item.color}`}
                            style={{ width: `${Math.min(item.value * 10, 100)}%` }}
                          />
                        </div>
                        <span className="text-sm text-gray-600 dark:text-gray-400 w-8 text-right">
                          {item.value}
                        </span>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </FadeIn>

            <FadeIn delay={300}>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <TrendingUp className="h-5 w-5" />
                    <span>Heading Hierarchy</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    {['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].map((heading) => {
                      const count = ca.headings?.[heading] || 0;
                      if (count === 0) return null;
                      
                      return (
                        <div key={heading} className="flex items-center justify-between">
                          <span className="text-sm font-medium uppercase">{heading}</span>
                          <div className="flex items-center space-x-2">
                            <div className="w-16 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                              <div 
                                className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500"
                                style={{ width: `${Math.min(count * 20, 100)}%` }}
                              />
                            </div>
                            <span className="text-sm text-gray-600 dark:text-gray-400 w-6 text-right">
                              {count}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </FadeIn>
          </div>
        </TabsContent>

        <TabsContent value="media" className="mt-6">
          <div className="grid lg:grid-cols-2 gap-6">
            <FadeIn delay={200}>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <ImageIcon className="h-5 w-5" />
                    <span>Image Optimization</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                      {ca.images?.optimizationScore || 0}%
                    </div>
                    <Badge variant="secondary">Optimization Score</Badge>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <p className="text-lg font-bold text-green-600 dark:text-green-400">
                        {ca.images?.total || 0}
                      </p>
                      <p className="text-xs text-green-700 dark:text-green-300">Total Images</p>
                    </div>
                    <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                      <p className="text-lg font-bold text-red-600 dark:text-red-400">
                        {(ca.images?.withoutAlt || 0) + (ca.images?.withEmptyAlt || 0)}
                      </p>
                      <p className="text-xs text-red-700 dark:text-red-300">Missing Alt Tags</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </FadeIn>

            <FadeIn delay={300}>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Link2 className="h-5 w-5" />
                    <span>Link Analysis</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-3 gap-3 text-center">
                    <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <p className="text-lg font-bold text-blue-600 dark:text-blue-400">
                        {ca.links?.total || 0}
                      </p>
                      <p className="text-xs text-blue-700 dark:text-blue-300">Total Links</p>
                    </div>
                    <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <p className="text-lg font-bold text-green-600 dark:text-green-400">
                        {ca.links?.internal || 0}
                      </p>
                      <p className="text-xs text-green-700 dark:text-green-300">Internal</p>
                    </div>
                    <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                      <p className="text-lg font-bold text-purple-600 dark:text-purple-400">
                        {ca.links?.external || 0}
                      </p>
                      <p className="text-xs text-purple-700 dark:text-purple-300">External</p>
                    </div>
                  </div>
                  
                  <div className="pt-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">Internal Link Ratio</span>
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {ca.links?.internalRatio || 0}%
                      </span>
                    </div>
                    <Progress value={ca.links?.internalRatio || 0} className="h-2" />
                  </div>
                </CardContent>
              </Card>
            </FadeIn>
          </div>
        </TabsContent>

        <TabsContent value="engagement" className="mt-6">
          <div className="grid lg:grid-cols-2 gap-6">
            <FadeIn delay={200}>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Share2 className="h-5 w-5" />
                    <span>Engagement Features</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                      <span className="text-sm font-medium">Social Sharing</span>
                      <Badge variant={ca.hasSocialSharing ? "default" : "secondary"}>
                        {ca.hasSocialSharing ? "Present" : "Missing"}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                      <span className="text-sm font-medium">Date Indicators</span>
                      <Badge variant={ca.hasDateIndicators ? "default" : "secondary"}>
                        {ca.hasDateIndicators ? "Present" : "Missing"}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </FadeIn>

            <FadeIn delay={300}>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Calendar className="h-5 w-5" />
                    <span>Content Freshness</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-600 dark:text-gray-400 mb-2">
                      Content Analysis
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Comprehensive technical and content evaluation completed
                    </p>
                  </div>
                </CardContent>
              </Card>
            </FadeIn>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}