import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Legend } from "recharts";
import { format, subDays, startOfDay } from "date-fns";

interface AppointmentTrendsChartProps {
  appointments: any[];
}

const AppointmentTrendsChart = ({ appointments }: AppointmentTrendsChartProps) => {
  // Group appointments by date for the last 30 days
  const last30Days = Array.from({ length: 30 }, (_, i) => {
    const date = startOfDay(subDays(new Date(), 29 - i));
    return date;
  });

  const data = last30Days.map(date => {
    const dateStr = format(date, 'yyyy-MM-dd');
    const dayAppointments = appointments.filter(apt => {
      const aptDate = format(new Date(apt.appointment_date), 'yyyy-MM-dd');
      return aptDate === dateStr;
    });

    return {
      date: format(date, 'MMM dd'),
      total: dayAppointments.length,
      pending: dayAppointments.filter(a => a.status === 'pending').length,
      confirmed: dayAppointments.filter(a => a.status === 'confirmed').length,
      completed: dayAppointments.filter(a => a.status === 'completed').length,
    };
  });

  const chartConfig = {
    total: {
      label: "Total",
      color: "hsl(var(--chart-1))",
    },
    pending: {
      label: "Pending",
      color: "hsl(var(--chart-2))",
    },
    confirmed: {
      label: "Confirmed",
      color: "hsl(var(--chart-3))",
    },
    completed: {
      label: "Completed",
      color: "hsl(var(--chart-4))",
    },
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Appointment Trends</CardTitle>
        <CardDescription>Last 30 days appointment statistics</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="date" 
                tick={{ fontSize: 12 }}
                interval="preserveStartEnd"
              />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="total" 
                stroke="hsl(var(--chart-1))" 
                strokeWidth={2}
                name="Total"
              />
              <Line 
                type="monotone" 
                dataKey="completed" 
                stroke="hsl(var(--chart-4))" 
                strokeWidth={2}
                name="Completed"
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default AppointmentTrendsChart;
