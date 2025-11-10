import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Legend } from "recharts";

interface HealthMetricsChartProps {
  patients: any[];
}

const HealthMetricsChart = ({ patients }: HealthMetricsChartProps) => {
  // Calculate average metrics by risk level
  type MetricsByRisk = Record<string, { count: number; totalScore: number }>;
  
  const metricsByRisk = patients.reduce((acc: MetricsByRisk, patient) => {
    const level = patient.riskLevel || 'Unknown';
    if (!acc[level]) {
      acc[level] = { count: 0, totalScore: 0 };
    }
    acc[level].count++;
    acc[level].totalScore += patient.latestRisk || 0;
    return acc;
  }, {} as MetricsByRisk);

  const data = Object.entries(metricsByRisk).map(([level, metrics]: [string, { count: number; totalScore: number }]) => ({
    riskLevel: level,
    avgScore: metrics.count > 0 ? Math.round(metrics.totalScore / metrics.count) : 0,
    patients: metrics.count,
  }));

  const chartConfig = {
    avgScore: {
      label: "Avg Risk Score",
      color: "hsl(var(--chart-1))",
    },
    patients: {
      label: "Patient Count",
      color: "hsl(var(--chart-2))",
    },
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Health Metrics Overview</CardTitle>
        <CardDescription>Average risk scores and patient distribution</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="riskLevel" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Legend />
              <Bar 
                yAxisId="left"
                dataKey="avgScore" 
                fill="hsl(var(--chart-1))" 
                name="Avg Risk Score"
                radius={[8, 8, 0, 0]}
              />
              <Bar 
                yAxisId="right"
                dataKey="patients" 
                fill="hsl(var(--chart-2))" 
                name="Patient Count"
                radius={[8, 8, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default HealthMetricsChart;
