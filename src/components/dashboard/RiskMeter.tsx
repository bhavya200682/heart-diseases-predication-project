import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Activity, TrendingUp, Shield, AlertTriangle } from "lucide-react";

interface RiskMeterProps {
  riskScore: number;
  riskLevel: string;
  recommendations: string[];
}

const RiskMeter = ({ riskScore, riskLevel, recommendations }: RiskMeterProps) => {
  const [animatedScore, setAnimatedScore] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedScore(riskScore);
    }, 100);
    return () => clearTimeout(timer);
  }, [riskScore]);

  const getRiskColor = () => {
    if (riskScore < 25) return { primary: "text-green-600", bg: "bg-green-100", border: "border-green-300" };
    if (riskScore < 50) return { primary: "text-yellow-600", bg: "bg-yellow-100", border: "border-yellow-300" };
    if (riskScore < 75) return { primary: "text-orange-600", bg: "bg-orange-100", border: "border-orange-300" };
    return { primary: "text-red-600", bg: "bg-red-100", border: "border-red-300" };
  };

  const getRiskIcon = () => {
    if (riskScore < 25) return <Shield className="h-8 w-8 text-green-600" />;
    if (riskScore < 50) return <Activity className="h-8 w-8 text-yellow-600" />;
    if (riskScore < 75) return <TrendingUp className="h-8 w-8 text-orange-600" />;
    return <AlertTriangle className="h-8 w-8 text-red-600" />;
  };

  const colors = getRiskColor();
  const circumference = 2 * Math.PI * 120;
  const strokeDashoffset = circumference - (animatedScore / 100) * circumference;

  return (
    <div className="space-y-6">
      <Card className="border-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {getRiskIcon()}
            Heart Health Risk Assessment
          </CardTitle>
          <CardDescription>AI-powered cardiovascular risk analysis</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center">
          <div className="relative w-64 h-64 mb-6">
            <svg className="transform -rotate-90 w-64 h-64">
              <circle
                cx="128"
                cy="128"
                r="120"
                stroke="currentColor"
                strokeWidth="16"
                fill="transparent"
                className="text-muted"
              />
              <circle
                cx="128"
                cy="128"
                r="120"
                stroke="currentColor"
                strokeWidth="16"
                fill="transparent"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                className={colors.primary}
                style={{
                  transition: "stroke-dashoffset 1.5s ease-in-out",
                }}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className={`text-6xl font-bold ${colors.primary}`}>
                {Math.round(animatedScore)}
              </span>
              <span className="text-sm text-muted-foreground mt-2">Risk Score</span>
            </div>
          </div>
          
          <div className={`w-full p-4 rounded-lg ${colors.bg} ${colors.border} border-2`}>
            <div className="flex items-center justify-center gap-2">
              <span className={`text-lg font-semibold ${colors.primary}`}>
                {riskLevel} Risk
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Personalized Recommendations</CardTitle>
          <CardDescription>AI-generated action items for your health</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            {recommendations.map((rec, index) => (
              <li key={index} className="flex items-start gap-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-semibold">
                  {index + 1}
                </div>
                <p className="text-sm text-foreground">{rec}</p>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default RiskMeter;