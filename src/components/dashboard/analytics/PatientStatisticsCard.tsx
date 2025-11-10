import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Activity } from "lucide-react";

interface PatientStatisticsCardProps {
  patients: any[];
  appointments: any[];
}

const PatientStatisticsCard = ({ patients, appointments }: PatientStatisticsCardProps) => {
  const highRiskCount = patients.filter(p => p.riskLevel === 'High').length;
  const moderateRiskCount = patients.filter(p => p.riskLevel === 'Moderate').length;
  const lowRiskCount = patients.filter(p => p.riskLevel === 'Low').length;
  
  const totalAppointments = appointments.length;
  const completedAppointments = appointments.filter(a => a.status === 'completed').length;
  const completionRate = totalAppointments > 0 
    ? Math.round((completedAppointments / totalAppointments) * 100) 
    : 0;

  const avgRiskScore = patients.length > 0
    ? Math.round(patients.reduce((sum, p) => sum + (p.latestRisk || 0), 0) / patients.length)
    : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">High Risk Patients</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="text-2xl font-bold text-destructive">{highRiskCount}</div>
            <TrendingUp className="h-4 w-4 text-destructive" />
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {patients.length > 0 ? Math.round((highRiskCount / patients.length) * 100) : 0}% of total patients
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Moderate Risk</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="text-2xl font-bold text-warning">{moderateRiskCount}</div>
            <Activity className="h-4 w-4 text-warning" />
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {patients.length > 0 ? Math.round((moderateRiskCount / patients.length) * 100) : 0}% of total patients
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Low Risk Patients</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="text-2xl font-bold text-success">{lowRiskCount}</div>
            <TrendingDown className="h-4 w-4 text-success" />
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {patients.length > 0 ? Math.round((lowRiskCount / patients.length) * 100) : 0}% of total patients
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Avg Risk Score</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="text-2xl font-bold">{avgRiskScore}</div>
            <Activity className="h-4 w-4 text-primary" />
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Appointment completion: {completionRate}%
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default PatientStatisticsCard;
