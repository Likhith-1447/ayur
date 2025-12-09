
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Activity, 
  Calendar, 
  FileText, 
  Heart, 
  Brain, 
  Stethoscope,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Info
} from "lucide-react";
import { format } from "date-fns";

interface HealthAnalysisResultCardProps {
  analysis: {
    id: string;
    analysis_type: string;
    input_data: any;
    result_data: any;
    created_at: string;
  };
}

const getAnalysisIcon = (type: string) => {
  switch (type.toLowerCase()) {
    case 'medical': return FileText;
    case 'symptom': return Stethoscope;
    case 'nutrition': return Heart;
    case 'fitness': return Activity;
    case 'mental': return Brain;
    default: return Activity;
  }
};

const getSeverityColor = (severity: string) => {
  switch (severity?.toLowerCase()) {
    case 'high': return 'destructive';
    case 'medium': return 'warning';
    case 'low': return 'secondary';
    default: return 'outline';
  }
};

const formatAnalysisData = (data: any) => {
  if (typeof data === 'string') return data;
  if (typeof data === 'object' && data !== null) {
    return Object.entries(data).map(([key, value]) => (
      <div key={key} className="flex justify-between items-start py-1">
        <span className="text-sm font-medium capitalize text-muted-foreground">
          {key.replace(/_/g, ' ')}:
        </span>
        <span className="text-sm text-right max-w-[60%]">
          {typeof value === 'object' ? JSON.stringify(value, null, 2) : String(value)}
        </span>
      </div>
    ));
  }
  return String(data);
};

export const HealthAnalysisResultCard = ({ analysis }: HealthAnalysisResultCardProps) => {
  const Icon = getAnalysisIcon(analysis.analysis_type);
  
  return (
    <Card className="hover:shadow-lg transition-all duration-300 border-l-4 border-l-primary/20">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Icon className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-semibold capitalize">
                {analysis.analysis_type} Analysis
              </h3>
              <CardDescription className="flex items-center gap-2 mt-1">
                <Calendar className="h-3 w-3" />
                {format(new Date(analysis.created_at), 'MMM d, yyyy • h:mm a')}
              </CardDescription>
            </div>
          </CardTitle>
          <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">
            <CheckCircle className="h-3 w-3 mr-1" />
            Completed
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Input Parameters Section */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Info className="h-4 w-4 text-blue-500" />
            <h4 className="font-semibold text-sm">Input Parameters</h4>
          </div>
          <div className="bg-muted/50 rounded-lg p-3 border">
            <div className="space-y-1">
              {formatAnalysisData(analysis.input_data)}
            </div>
          </div>
        </div>

        <Separator />

        {/* Results Section */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-emerald-500" />
            <h4 className="font-semibold text-sm">Analysis Results</h4>
          </div>
          <div className="bg-gradient-to-br from-emerald-50 to-blue-50 dark:from-emerald-950/20 dark:to-blue-950/20 rounded-lg p-4 border border-emerald-200/50 dark:border-emerald-800/50">
            <div className="space-y-2">
              {formatAnalysisData(analysis.result_data)}
            </div>
          </div>
        </div>

        {/* Analysis Insights (if available) */}
        {analysis.result_data?.insights && (
          <>
            <Separator />
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Brain className="h-4 w-4 text-purple-500" />
                <h4 className="font-semibold text-sm">AI Insights</h4>
              </div>
              <div className="bg-purple-50 dark:bg-purple-950/20 rounded-lg p-3 border border-purple-200 dark:border-purple-800">
                <p className="text-sm text-purple-800 dark:text-purple-200">
                  {analysis.result_data.insights}
                </p>
              </div>
            </div>
          </>
        )}

        {/* Recommendations (if available) */}
        {analysis.result_data?.recommendations && (
          <>
            <Separator />
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Heart className="h-4 w-4 text-rose-500" />
                <h4 className="font-semibold text-sm">Recommendations</h4>
              </div>
              <div className="bg-rose-50 dark:bg-rose-950/20 rounded-lg p-3 border border-rose-200 dark:border-rose-800">
                <p className="text-sm text-rose-800 dark:text-rose-200">
                  {analysis.result_data.recommendations}
                </p>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};
