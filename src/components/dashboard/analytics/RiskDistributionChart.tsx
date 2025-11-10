import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from "recharts";

interface RiskDistributionChartProps {
  patients: any[];
}

const RiskDistributionChart = ({ patients }: RiskDistributionChartProps) => {
  const riskCounts = patients.reduce((acc, patient) => {
    const level = patient.riskLevel || 'Unknown';
    acc[level] = (acc[level] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const data = Object.entries(riskCounts).map(([name, value]) => ({
    name,
    value,
    fill: name === 'Low' ? 'hsl(var(--chart-1))' : 
          name === 'Moderate' ? 'hsl(var(--chart-2))' : 
          name === 'High' ? 'hsl(var(--chart-3))' : 
          'hsl(var(--muted))'
  }));

  const chartConfig = {
    Low: {
      label: "Low Risk",
      color: "hsl(var(--chart-1))",
    },
    Moderate: {
      label: "Moderate Risk",
      color: "hsl(var(--chart-2))",
    },
    High: {
      label: "High Risk",
      color: "hsl(var(--chart-3))",
    },
    Unknown: {
      label: "Unknown",
      color: "hsl(var(--muted))",
    },
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Risk Distribution</CardTitle>
        <CardDescription>Patient cardiovascular risk levels</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <ChartTooltip content={<ChartTooltipContent />} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default RiskDistributionChart;
