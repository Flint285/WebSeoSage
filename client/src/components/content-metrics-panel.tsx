import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  FileText, 
  Hash, 
  Eye, 
  Link, 
  Image, 
  List, 
  Type,
  BarChart3,
  CheckCircle,
  AlertCircle,
  XCircle
} from "lucide-react";
import type { SeoAnalysis } from "@shared/schema";

interface ContentMetricsPanelProps {
  analysis: SeoAnalysis;
}

export function ContentMetricsPanel({ analysis }: ContentMetricsPanelProps) {
  // Parse the content analysis data from the analysis
  const contentData = typeof analysis.technicalChecks === 'object' && analysis.technicalChecks !== null
    ? (analysis.technicalChecks as any).contentAnalysis || {}
    : {};

  const getReadabilityColor = (score: number) => {
    if (score >= 70) return "text-green-600";
    if (score >= 50) return "text-yellow-600";
    return "text-red-600";
  };

  const getReadabilityBadgeVariant = (level: string) => {
    const easyLevels = ["Very Easy", "Easy", "Fairly Easy"];
    const standardLevels = ["Standard"];
    
    if (easyLevels.includes(level)) return "default";
    if (standardLevels.includes(level)) return "secondary";
    return "destructive";
  };

  const getOptimizationColor = (score: number) => {
    if (score >= 90) return "text-green-600";
    if (score >= 70) return "text-yellow-600";
    return "text-red-600";
  };

  const getQualityBadgeVariant = (score: number) => {
    if (score >= 80) return "default";
    if (score >= 60) return "secondary";
    return "destructive";
  };

  return (
    <div className="space-y-6">
      {/* Content Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl text-foreground flex items-center">
            <FileText className="h-5 w-5 mr-2" />
            Content Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">
                {contentData.wordCount || 0}
              </div>
              <div className="text-sm text-muted-foreground">Words</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-secondary">
                {contentData.sentenceCount || 0}
              </div>
              <div className="text-sm text-muted-foreground">Sentences</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {contentData.paragraphCount || 0}
              </div>
              <div className="text-sm text-muted-foreground">Paragraphs</div>
            </div>
            <div className="text-center">
              <div className={`text-2xl font-bold ${getOptimizationColor(contentData.contentQualityScore || 0)}`}>
                {contentData.contentQualityScore || 0}
              </div>
              <div className="text-sm text-muted-foreground">Quality Score</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Readability Analysis */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg text-foreground flex items-center">
            <Eye className="h-5 w-5 mr-2" />
            Readability Analysis
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium text-foreground">Flesch Reading Ease</div>
              <div className="text-sm text-muted-foreground">
                {contentData.avgWordsPerSentence ? `${contentData.avgWordsPerSentence} words per sentence` : 'No data'}
              </div>
            </div>
            <div className="text-right">
              <div className={`text-2xl font-bold ${getReadabilityColor(contentData.fleschReadingEase || 0)}`}>
                {contentData.fleschReadingEase || 0}
              </div>
              <Badge variant={getReadabilityBadgeVariant(contentData.readabilityLevel || "Unknown")}>
                {contentData.readabilityLevel || "Unknown"}
              </Badge>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Readability Score</span>
              <span>{contentData.fleschReadingEase || 0}/100</span>
            </div>
            <Progress value={Math.max(0, Math.min(100, contentData.fleschReadingEase || 0))} className="h-2" />
          </div>

          <div className="grid grid-cols-2 gap-4 pt-2">
            <div className="text-center">
              <div className="text-lg font-semibold text-foreground">
                {contentData.avgWordsPerSentence || 0}
              </div>
              <div className="text-xs text-muted-foreground">Avg Words/Sentence</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold text-foreground">
                {contentData.avgSentencesPerParagraph || 0}
              </div>
              <div className="text-xs text-muted-foreground">Avg Sentences/Paragraph</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Heading Structure */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg text-foreground flex items-center">
            <Hash className="h-5 w-5 mr-2" />
            Heading Structure
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
            {['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].map((level) => (
              <div key={level} className="text-center">
                <div className="text-lg font-semibold text-foreground">
                  {contentData.headings?.[level] || 0}
                </div>
                <div className="text-xs text-muted-foreground uppercase">{level}</div>
              </div>
            ))}
          </div>

          {contentData.headingHierarchy && (
            <div className="mt-4 p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                {contentData.headingHierarchy.isProper ? (
                  <CheckCircle className="h-4 w-4 text-green-600" />
                ) : (
                  <XCircle className="h-4 w-4 text-red-600" />
                )}
                <span className="font-medium text-sm">
                  Heading Hierarchy {contentData.headingHierarchy.isProper ? 'Valid' : 'Issues Found'}
                </span>
              </div>
              {contentData.headingHierarchy.issues?.length > 0 && (
                <ul className="text-sm text-red-600 space-y-1">
                  {contentData.headingHierarchy.issues.map((issue: string, index: number) => (
                    <li key={index}>• {issue}</li>
                  ))}
                </ul>
              )}
            </div>
          )}

          {contentData.topHeadings && (
            <div className="space-y-2">
              <div className="text-sm font-medium text-foreground">Top Headings Preview</div>
              {contentData.topHeadings.h1?.length > 0 && (
                <div>
                  <div className="text-xs text-muted-foreground mb-1">H1 Tags:</div>
                  {contentData.topHeadings.h1.map((heading: string, index: number) => (
                    <div key={index} className="text-sm text-foreground bg-blue-50 px-2 py-1 rounded mb-1">
                      {heading}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Images & Media */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg text-foreground flex items-center">
            <Image className="h-5 w-5 mr-2" />
            Images & Media
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-lg font-semibold text-foreground">
                {contentData.images?.total || 0}
              </div>
              <div className="text-xs text-muted-foreground">Total Images</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold text-red-600">
                {contentData.images?.withoutAlt || 0}
              </div>
              <div className="text-xs text-muted-foreground">Missing Alt</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold text-foreground">
                {contentData.structure?.videos || 0}
              </div>
              <div className="text-xs text-muted-foreground">Videos</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold text-foreground">
                {contentData.structure?.audioElements || 0}
              </div>
              <div className="text-xs text-muted-foreground">Audio</div>
            </div>
          </div>

          {contentData.images && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Image Optimization</span>
                <span className={getOptimizationColor(contentData.images.optimizationScore)}>
                  {contentData.images.optimizationScore}%
                </span>
              </div>
              <Progress value={contentData.images.optimizationScore} className="h-2" />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Links Analysis */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg text-foreground flex items-center">
            <Link className="h-5 w-5 mr-2" />
            Links Analysis
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-lg font-semibold text-blue-600">
                {contentData.links?.internal || 0}
              </div>
              <div className="text-xs text-muted-foreground">Internal Links</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold text-green-600">
                {contentData.links?.external || 0}
              </div>
              <div className="text-xs text-muted-foreground">External Links</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold text-foreground">
                {contentData.links?.total || 0}
              </div>
              <div className="text-xs text-muted-foreground">Total Links</div>
            </div>
          </div>

          {contentData.links && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Internal Link Ratio</span>
                <span>{contentData.links.internalRatio || 0}%</span>
              </div>
              <Progress value={contentData.links.internalRatio || 0} className="h-2" />
              <div className="text-xs text-muted-foreground">
                Optimal range: 60-80% internal links
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Content Structure */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg text-foreground flex items-center">
            <List className="h-5 w-5 mr-2" />
            Content Structure
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-lg font-semibold text-foreground">
                {contentData.structure?.lists?.items || 0}
              </div>
              <div className="text-xs text-muted-foreground">List Items</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold text-foreground">
                {contentData.structure?.tables || 0}
              </div>
              <div className="text-xs text-muted-foreground">Tables</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold text-foreground">
                {contentData.structure?.blockquotes || 0}
              </div>
              <div className="text-xs text-muted-foreground">Blockquotes</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold text-foreground">
                {contentData.structure?.codeBlocks || 0}
              </div>
              <div className="text-xs text-muted-foreground">Code Blocks</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Meta Content */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg text-foreground flex items-center">
            <Type className="h-5 w-5 mr-2" />
            Meta Content
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-medium text-foreground">Title Tag</span>
                <Badge variant={
                  contentData.meta?.title?.length >= 30 && contentData.meta?.title?.length <= 60 
                    ? "default" : "destructive"
                }>
                  {contentData.meta?.title?.length || 0} chars
                </Badge>
              </div>
              <div className="text-sm text-muted-foreground bg-gray-50 p-2 rounded">
                {contentData.meta?.title?.text || "No title tag found"}
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-medium text-foreground">Meta Description</span>
                <Badge variant={
                  contentData.meta?.description?.length >= 120 && contentData.meta?.description?.length <= 160 
                    ? "default" : "destructive"
                }>
                  {contentData.meta?.description?.length || 0} chars
                </Badge>
              </div>
              <div className="text-sm text-muted-foreground bg-gray-50 p-2 rounded">
                {contentData.meta?.description?.text || "No meta description found"}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Content Quality Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg text-foreground flex items-center">
            <BarChart3 className="h-5 w-5 mr-2" />
            Content Quality Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-medium text-foreground">Overall Content Quality</span>
              <Badge variant={getQualityBadgeVariant(contentData.contentQualityScore || 0)} className="text-lg px-3 py-1">
                {contentData.contentQualityScore || 0}/100
              </Badge>
            </div>
            
            <Progress value={contentData.contentQualityScore || 0} className="h-3" />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="space-y-2">
                <div className="font-medium text-foreground">Strengths:</div>
                <ul className="space-y-1 text-muted-foreground">
                  {contentData.wordCount >= 300 && (
                    <li className="flex items-center">
                      <CheckCircle className="h-3 w-3 text-green-600 mr-2" />
                      Good content length
                    </li>
                  )}
                  {contentData.headings?.h1 === 1 && (
                    <li className="flex items-center">
                      <CheckCircle className="h-3 w-3 text-green-600 mr-2" />
                      Proper H1 structure
                    </li>
                  )}
                  {contentData.images?.optimizationScore >= 90 && (
                    <li className="flex items-center">
                      <CheckCircle className="h-3 w-3 text-green-600 mr-2" />
                      Well-optimized images
                    </li>
                  )}
                </ul>
              </div>
              
              <div className="space-y-2">
                <div className="font-medium text-foreground">Areas for Improvement:</div>
                <ul className="space-y-1 text-muted-foreground">
                  {contentData.wordCount < 300 && (
                    <li className="flex items-center">
                      <AlertCircle className="h-3 w-3 text-yellow-600 mr-2" />
                      Increase content length
                    </li>
                  )}
                  {contentData.images?.withoutAlt > 0 && (
                    <li className="flex items-center">
                      <AlertCircle className="h-3 w-3 text-yellow-600 mr-2" />
                      Add missing alt text
                    </li>
                  )}
                  {(contentData.fleschReadingEase || 0) < 50 && (
                    <li className="flex items-center">
                      <AlertCircle className="h-3 w-3 text-yellow-600 mr-2" />
                      Improve readability
                    </li>
                  )}
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}