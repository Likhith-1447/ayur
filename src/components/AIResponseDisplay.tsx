
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { CheckCircle, AlertTriangle, Info, Lightbulb, Heart, Target } from "lucide-react";

interface AIResponseDisplayProps {
  response: string;
  type: "medical" | "symptom" | "nutrition" | "fitness" | "general";
}

const AIResponseDisplay = ({ response, type }: AIResponseDisplayProps) => {
  const formatResponse = (text: string) => {
    // Split by common section headers and format
    const sections = text.split(/(?=\d+\.\s|#{1,3}\s|\*\*[A-Z])/);
    
    return sections.map((section, index) => {
      if (!section.trim()) return null;

      // Check for numbered sections
      const numberedMatch = section.match(/^(\d+)\.\s*([^:]+):?\s*(.*)/s);
      if (numberedMatch) {
        const [, number, title, content] = numberedMatch;
        return (
          <div key={index} className="mb-6">
            <div className="flex items-center gap-3 mb-3">
              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                {number}
              </Badge>
              <h3 className="text-lg font-semibold text-gray-800">{title.trim()}</h3>
            </div>
            <div className="pl-6 border-l-4 border-blue-200 bg-blue-50/30 p-4 rounded-r-lg">
              <p className="text-gray-700 whitespace-pre-wrap">{content.trim()}</p>
            </div>
          </div>
        );
      }

      // Check for bold headers
      const boldMatch = section.match(/^\*\*([^*]+)\*\*:?\s*(.*)/s);
      if (boldMatch) {
        const [, title, content] = boldMatch;
        return (
          <div key={index} className="mb-4">
            <h4 className="text-md font-semibold text-gray-800 mb-2 flex items-center gap-2">
              <Info className="h-4 w-4 text-blue-600" />
              {title.trim()}
            </h4>
            <div className="bg-gray-50 p-3 rounded-lg border-l-4 border-gray-300">
              <p className="text-gray-700 whitespace-pre-wrap">{content.trim()}</p>
            </div>
          </div>
        );
      }

      // Check for markdown headers
      const headerMatch = section.match(/^#{1,3}\s*([^#\n]+)\s*(.*)/s);
      if (headerMatch) {
        const [, title, content] = headerMatch;
        return (
          <div key={index} className="mb-4">
            <h4 className="text-lg font-semibold text-gray-800 mb-2 flex items-center gap-2">
              <Target className="h-4 w-4 text-green-600" />
              {title.trim()}
            </h4>
            <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-400">
              <p className="text-gray-700 whitespace-pre-wrap">{content.trim()}</p>
            </div>
          </div>
        );
      }

      // Regular paragraph
      return (
        <div key={index} className="mb-3">
          <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{section.trim()}</p>
        </div>
      );
    }).filter(Boolean);
  };

  const getHeaderConfig = () => {
    switch (type) {
      case "medical":
        return {
          icon: <Heart className="h-5 w-5" />,
          title: "Medical Analysis Results",
          bgColor: "bg-gradient-to-r from-red-600 to-pink-600",
          textColor: "text-red-100"
        };
      case "symptom":
        return {
          icon: <CheckCircle className="h-5 w-5" />,
          title: "Symptom Analysis",
          bgColor: "bg-gradient-to-r from-blue-600 to-cyan-600",
          textColor: "text-blue-100"
        };
      case "nutrition":
        return {
          icon: <Target className="h-5 w-5" />,
          title: "Nutrition Plan",
          bgColor: "bg-gradient-to-r from-green-600 to-emerald-600",
          textColor: "text-green-100"
        };
      case "fitness":
        return {
          icon: <Lightbulb className="h-5 w-5" />,
          title: "Fitness Plan",
          bgColor: "bg-gradient-to-r from-purple-600 to-indigo-600",
          textColor: "text-purple-100"
        };
      default:
        return {
          icon: <Info className="h-5 w-5" />,
          title: "AI Analysis",
          bgColor: "bg-gradient-to-r from-gray-600 to-slate-600",
          textColor: "text-gray-100"
        };
    }
  };

  const config = getHeaderConfig();

  return (
    <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 animate-fade-in">
      <CardHeader className={`${config.bgColor} text-white rounded-t-lg`}>
        <CardTitle className="flex items-center">
          {config.icon}
          <span className="ml-2">{config.title}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-4">
          {formatResponse(response)}
        </div>
        
        <Separator className="my-6" />
        
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5" />
            <div>
              <h4 className="font-semibold text-amber-800 mb-1">Important Disclaimer</h4>
              <p className="text-sm text-amber-700">
                This AI-generated analysis is for informational purposes only and should not replace professional medical advice. 
                Always consult with a qualified healthcare provider for proper diagnosis and treatment.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AIResponseDisplay;
