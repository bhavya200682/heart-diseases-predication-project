import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

interface HealthDataCardProps {
  healthData: any[];
}

const HealthDataCard = ({ healthData }: HealthDataCardProps) => {
  const healthMetrics = [
    { key: 'age', label: 'Age', unit: 'years' },
    { key: 'sex', label: 'Sex', format: (v: number) => v === 1 ? 'Male' : 'Female' },
    { key: 'cp', label: 'Chest Pain Type', format: (v: number) => ['Typical Angina', 'Atypical Angina', 'Non-anginal Pain', 'Asymptomatic'][v] || v },
    { key: 'trestbps', label: 'Resting Blood Pressure', unit: 'mm Hg' },
    { key: 'chol', label: 'Cholesterol', unit: 'mg/dl' },
    { key: 'fbs', label: 'Fasting Blood Sugar', format: (v: number) => v > 120 ? 'High (>120 mg/dl)' : 'Normal' },
    { key: 'restecg', label: 'Resting ECG', format: (v: number) => ['Normal', 'ST-T Abnormality', 'LV Hypertrophy'][v] || v },
    { key: 'thalach', label: 'Max Heart Rate', unit: 'bpm' },
    { key: 'exang', label: 'Exercise Induced Angina', format: (v: number) => v === 1 ? 'Yes' : 'No' },
    { key: 'oldpeak', label: 'ST Depression', unit: '' },
    { key: 'slope', label: 'Slope of ST Segment', format: (v: number) => ['Upsloping', 'Flat', 'Downsloping'][v] || v },
    { key: 'ca', label: 'Major Vessels', unit: '' },
    { key: 'thal', label: 'Thalassemia', format: (v: number) => ['Normal', 'Fixed Defect', 'Reversible Defect'][v] || v },
  ];

  return (
    <div className="space-y-4">
      {healthData.length > 0 ? (
        healthData.map((record, index) => (
          <Card key={record.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Health Assessment #{healthData.length - index}</CardTitle>
                  <CardDescription>
                    Recorded on {format(new Date(record.created_at), 'MMMM dd, yyyy HH:mm')}
                  </CardDescription>
                </div>
                <Badge variant="outline">
                  {format(new Date(record.created_at), 'MMM yyyy')}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {healthMetrics.map(metric => {
                  const value = record[metric.key];
                  const displayValue = metric.format 
                    ? metric.format(value) 
                    : metric.unit 
                    ? `${value} ${metric.unit}` 
                    : value;

                  return (
                    <div key={metric.key} className="border border-border rounded-lg p-3">
                      <p className="text-sm text-muted-foreground mb-1">{metric.label}</p>
                      <p className="text-lg font-semibold">{displayValue}</p>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        ))
      ) : (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">No health data records available</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default HealthDataCard;
