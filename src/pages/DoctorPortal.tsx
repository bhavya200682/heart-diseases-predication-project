import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Heart, LogOut, Users, Calendar, MessageSquare, Activity } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

const DoctorPortal = () => {
  const [user, setUser] = useState<any>(null);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [patients, setPatients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
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
        navigate('/patient-dashboard');
        return;
      }

      setUser({ ...session.user, ...profile });

      // Fetch appointments
      const { data: appointmentsData } = await supabase
        .from('appointments')
        .select(`
          *,
          patient:patient_id (full_name, email)
        `)
        .eq('doctor_id', session.user.id)
        .order('appointment_date', { ascending: true });

      setAppointments(appointmentsData || []);

      // Fetch patients with predictions
      const { data: predictionsData } = await supabase
        .from('ai_predictions')
        .select('*')
        .order('created_at', { ascending: false });

      if (predictionsData && predictionsData.length > 0) {
        // Get unique patient IDs
        const patientIds = [...new Set(predictionsData.map(p => p.user_id))];
        
        // Fetch patient profiles
        const { data: profilesData } = await supabase
          .from('profiles')
          .select('*')
          .in('id', patientIds);

        // Combine profiles with latest predictions
        const patientsWithRisk = profilesData?.map(profile => {
          const latestPrediction = predictionsData.find(p => p.user_id === profile.id);
          return {
            ...profile,
            latestRisk: latestPrediction?.risk_score || 0,
            riskLevel: latestPrediction?.risk_level || 'Unknown'
          };
        }) || [];

        setPatients(patientsWithRisk);
      }
      setLoading(false);
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        navigate('/auth');
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  if (loading) {
    return <div className="min-h-screen bg-background flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card sticky top-0 z-10">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-gradient-to-r from-primary to-accent rounded-lg">
              <Heart className="h-6 w-6 text-white animate-heartbeat" />
            </div>
            <div>
              <h1 className="text-xl font-bold gradient-text">HeartGuard AI</h1>
              <p className="text-xs text-muted-foreground">Doctor Portal</p>
            </div>
          </div>
          <Button variant="outline" onClick={handleSignOut}>
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">Welcome, Dr. {user?.full_name}</h2>
          <p className="text-muted-foreground">{user?.specialization}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                Total Patients
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold">{patients.length}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                Appointments
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold">{appointments.length}</p>
            </CardContent>
          </Card>

          <Card className="hover-scale cursor-pointer" onClick={() => navigate('/messages')}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-primary" />
                Messages
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">View patient messages</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Appointments</CardTitle>
              <CardDescription>Your scheduled patient consultations</CardDescription>
            </CardHeader>
            <CardContent>
              {appointments.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Patient</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {appointments.slice(0, 5).map((apt) => (
                      <TableRow key={apt.id}>
                        <TableCell>{apt.patient?.full_name}</TableCell>
                        <TableCell>{new Date(apt.appointment_date).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <Badge variant={apt.status === 'pending' ? 'secondary' : 'default'}>
                            {apt.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <p className="text-muted-foreground">No upcoming appointments</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Patient Risk Overview</CardTitle>
              <CardDescription>Recent cardiovascular assessments</CardDescription>
            </CardHeader>
            <CardContent>
              {patients.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Patient</TableHead>
                      <TableHead>Risk Score</TableHead>
                      <TableHead>Level</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {patients.slice(0, 5).map((patient: any) => (
                      <TableRow key={patient.id}>
                        <TableCell>{patient.full_name}</TableCell>
                        <TableCell>{patient.latestRisk}</TableCell>
                        <TableCell>
                          <Badge 
                            variant={
                              patient.riskLevel === 'Low' ? 'default' :
                              patient.riskLevel === 'Moderate' ? 'secondary' : 'destructive'
                            }
                          >
                            {patient.riskLevel}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <p className="text-muted-foreground">No patient data available</p>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default DoctorPortal;