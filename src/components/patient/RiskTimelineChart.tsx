import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Legend, Area, AreaChart } from "recharts";
import { format } from "date-fns";

interface RiskTimelineChartProps {
  predictions: any[];
}

const RiskTimelineChart = ({ predictions }: RiskTimelineChartProps) => {
  const data = [...predictions]
    .reverse()
    .map(prediction => ({
      date: format(new Date(prediction.created_at), 'MMM dd, yyyy'),
      score: prediction.risk_score,
      level: prediction.risk_level,
    }));

  const chartConfig = {
    score: {
      label: "Risk Score",
      color: "hsl(var(--chart-1))",
    },
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Risk Assessment Timeline</CardTitle>
        <CardDescription>Historical cardiovascular risk scores over time</CardDescription>
      </CardHeader>
      <CardContent>
        {data.length > 0 ? (
          <ChartContainer config={chartConfig} className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="date" 
                  tick={{ fontSize: 12 }}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis domain={[0, 100]} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="score"
                  stroke="hsl(var(--chart-1))"
                  strokeWidth={3}
                  fill="url(#colorScore)"
                  name="Risk Score"
                />
              </AreaChart>
            </ResponsiveContainer>
          </ChartContainer>
        ) : (
          <div className="h-[400px] flex items-center justify-center">
            <p className="text-muted-foreground">No risk assessment data available</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RiskTimelineChart;
