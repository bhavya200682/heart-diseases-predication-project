import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, User, Calendar, Activity, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import RiskTimelineChart from "@/components/patient/RiskTimelineChart";
import HealthDataCard from "@/components/patient/HealthDataCard";
import PredictionsHistory from "@/components/patient/PredictionsHistory";
import PatientAppointments from "@/components/patient/PatientAppointments";
import { useToast } from "@/hooks/use-toast";

const PatientDetail = () => {
  const { patientId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [patient, setPatient] = useState<any>(null);
  const [healthData, setHealthData] = useState<any[]>([]);
  const [predictions, setPredictions] = useState<any[]>([]);
  const [appointments, setAppointments] = useState<any[]>([]);

  useEffect(() => {
    const fetchPatientData = async () => {
      try {
        // Verify doctor is logged in
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          navigate('/auth');
          return;
        }

        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (profile?.role !== 'doctor') {
          toast({
            title: "Access Denied",
            description: "You must be a doctor to view patient details",
            variant: "destructive",
          });
          navigate('/');
          return;
        }

        // Fetch patient profile
        const { data: patientData, error: patientError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', patientId)
          .single();

        if (patientError) throw patientError;
        setPatient(patientData);

        // Fetch health data
        const { data: healthDataResults } = await supabase
          .from('patient_health_data')
          .select('*')
          .eq('user_id', patientId)
          .order('created_at', { ascending: false });

        setHealthData(healthDataResults || []);

        // Fetch predictions
        const { data: predictionsData } = await supabase
          .from('ai_predictions')
          .select('*')
          .eq('user_id', patientId)
          .order('created_at', { ascending: false });

        setPredictions(predictionsData || []);

        // Fetch appointments
        const { data: appointmentsData } = await supabase
          .from('appointments')
          .select('*')
          .eq('patient_id', patientId)
          .eq('doctor_id', session.user.id)
          .order('appointment_date', { ascending: false });

        setAppointments(appointmentsData || []);

      } catch (error) {
        console.error('Error fetching patient data:', error);
        toast({
          title: "Error",
          description: "Failed to load patient data",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchPatientData();
  }, [patientId, navigate, toast]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Activity className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading patient data...</p>
        </div>
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>Patient Not Found</CardTitle>
            <CardDescription>The requested patient could not be found</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigate('/doctor-portal')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Portal
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const latestPrediction = predictions[0];
  const latestHealthData = healthData[0];

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card sticky top-0 z-10">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Button variant="ghost" onClick={() => navigate('/doctor-portal')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Portal
          </Button>
          <h1 className="text-lg font-semibold">Patient Details</h1>
          <div className="w-24" />
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Patient Header */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4">
                <div className="h-16 w-16 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                  <User className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold mb-1">{patient.full_name}</h2>
                  <p className="text-muted-foreground mb-2">{patient.email}</p>
                  {patient.phone && (
                    <p className="text-sm text-muted-foreground">{patient.phone}</p>
                  )}
                </div>
              </div>
              
              {latestPrediction && (
                <div className="text-right">
                  <p className="text-sm text-muted-foreground mb-1">Current Risk Level</p>
                  <Badge 
                    variant={
                      latestPrediction.risk_level === 'Low' ? 'default' :
                      latestPrediction.risk_level === 'Moderate' ? 'secondary' : 'destructive'
                    }
                    className="text-lg px-4 py-1"
                  >
                    {latestPrediction.risk_level}
                  </Badge>
                  <p className="text-2xl font-bold mt-2">Score: {latestPrediction.risk_score}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Assessments</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{predictions.length}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Appointments</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{appointments.length}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Health Records</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{healthData.length}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Risk Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                {predictions.length >= 2 && (
                  <>
                    <TrendingUp className={`h-5 w-5 ${
                      predictions[0].risk_score > predictions[1].risk_score 
                        ? 'text-destructive' 
                        : 'text-success'
                    }`} />
                    <p className="text-2xl font-bold">
                      {predictions[0].risk_score > predictions[1].risk_score ? '+' : ''}
                      {predictions[0].risk_score - predictions[1].risk_score}
                    </p>
                  </>
                )}
                {predictions.length < 2 && (
                  <p className="text-sm text-muted-foreground">Not enough data</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Information Tabs */}
        <Tabs defaultValue="timeline" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="timeline">Risk Timeline</TabsTrigger>
            <TabsTrigger value="health">Health Data</TabsTrigger>
            <TabsTrigger value="predictions">Predictions</TabsTrigger>
            <TabsTrigger value="appointments">Appointments</TabsTrigger>
          </TabsList>

          <TabsContent value="timeline">
            <RiskTimelineChart predictions={predictions} />
          </TabsContent>

          <TabsContent value="health">
            <HealthDataCard healthData={healthData} />
          </TabsContent>

          <TabsContent value="predictions">
            <PredictionsHistory predictions={predictions} />
          </TabsContent>

          <TabsContent value="appointments">
            <PatientAppointments appointments={appointments} patientName={patient.full_name} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default PatientDetail;
