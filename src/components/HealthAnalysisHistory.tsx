
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useHealthData } from "@/hooks/useHealthData";
import { Activity } from "lucide-react";
import { HealthAnalysisResultCard } from "./HealthAnalysisResultCard";

const HealthAnalysisHistory = () => {
  const { healthAnalyses, isLoadingAnalyses, analysesError } = useHealthData();

  if (isLoadingAnalyses) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  if (analysesError) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-destructive">Error loading health analyses</p>
        </CardContent>
      </Card>
    );
  }

  if (!healthAnalyses || healthAnalyses.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <Activity className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <p className="text-muted-foreground">No health analyses yet</p>
          <p className="text-sm text-muted-foreground mt-2">
            Start by taking a health analysis to see your results here
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
          Health Analysis History
        </h2>
        <div className="text-sm text-muted-foreground">
          {healthAnalyses.length} analysis{healthAnalyses.length !== 1 ? 'es' : ''}
        </div>
      </div>
      
      <div className="space-y-4">
        {healthAnalyses.map((analysis) => {
          const adapted = {
            id: analysis.id,
            analysis_type: analysis.analysis_type,
            input_data: analysis.input_data as any,
            result_data: (analysis as any).result,
            created_at: analysis.created_at as string,
          };
          return <HealthAnalysisResultCard key={analysis.id} analysis={adapted} />;
        })}
      </div>
    </div>
  );
};

export default HealthAnalysisHistory;
