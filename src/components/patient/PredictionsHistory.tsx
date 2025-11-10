import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { AlertCircle, CheckCircle, AlertTriangle } from "lucide-react";

interface PredictionsHistoryProps {
  predictions: any[];
}

const PredictionsHistory = ({ predictions }: PredictionsHistoryProps) => {
  const getRiskIcon = (level: string) => {
    switch (level) {
      case 'Low':
        return <CheckCircle className="h-5 w-5 text-success" />;
      case 'Moderate':
        return <AlertTriangle className="h-5 w-5 text-warning" />;
      case 'High':
        return <AlertCircle className="h-5 w-5 text-destructive" />;
      default:
        return <AlertCircle className="h-5 w-5 text-muted-foreground" />;
    }
  };

  return (
    <div className="space-y-4">
      {predictions.length > 0 ? (
        predictions.map((prediction, index) => (
          <Card key={prediction.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  {getRiskIcon(prediction.risk_level)}
                  <div>
                    <CardTitle className="text-lg">
                      Assessment #{predictions.length - index}
                    </CardTitle>
                    <CardDescription>
                      {format(new Date(prediction.created_at), 'MMMM dd, yyyy HH:mm')}
                    </CardDescription>
                  </div>
                </div>
                <div className="text-right">
                  <Badge 
                    variant={
                      prediction.risk_level === 'Low' ? 'default' :
                      prediction.risk_level === 'Moderate' ? 'secondary' : 'destructive'
                    }
                  >
                    {prediction.risk_level}
                  </Badge>
                  <p className="text-2xl font-bold mt-1">Score: {prediction.risk_score}</p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {prediction.recommendations && prediction.recommendations.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-2">AI Recommendations:</h4>
                  <ul className="space-y-2">
                    {prediction.recommendations.map((rec: string, idx: number) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-primary mt-1">•</span>
                        <span className="text-sm text-muted-foreground">{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>
        ))
      ) : (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">No predictions available</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PredictionsHistory;
