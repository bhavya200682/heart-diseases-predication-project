import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Heart, LogOut, Calendar, MessageSquare, Activity } from "lucide-react";
import RiskMeter from "@/components/dashboard/RiskMeter";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const PatientDashboard = () => {
  const [user, setUser] = useState<any>(null);
  const [prediction, setPrediction] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/auth');
        return;
      }

      setUser(session.user);

      // Fetch latest prediction
      const { data } = await supabase
        .from('ai_predictions')
        .select('*')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (data) {
        setPrediction(data);
      }
      setLoading(false);
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        navigate('/auth');
      } else {
        setUser(session.user);
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
              <p className="text-xs text-muted-foreground">Patient Portal</p>
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
          <h2 className="text-3xl font-bold mb-2">Welcome back!</h2>
          <p className="text-muted-foreground">Track your heart health and manage appointments</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <Card className="hover-scale cursor-pointer" onClick={() => navigate('/appointments')}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                Appointments
              </CardTitle>
              <CardDescription>Schedule & manage visits</CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover-scale cursor-pointer" onClick={() => navigate('/messages')}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-primary" />
                Messages
              </CardTitle>
              <CardDescription>Chat with your doctor</CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover-scale cursor-pointer" onClick={() => navigate('/')}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-primary" />
                New Assessment
              </CardTitle>
              <CardDescription>Take health screening</CardDescription>
            </CardHeader>
          </Card>
        </div>

        {prediction ? (
          <RiskMeter
            riskScore={prediction.risk_score}
            riskLevel={prediction.risk_level}
            recommendations={prediction.recommendations}
          />
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>No Risk Assessment Yet</CardTitle>
              <CardDescription>
                Complete your health assessment to get your personalized risk analysis
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={() => navigate('/')}>
                <Activity className="h-4 w-4 mr-2" />
                Start Assessment
              </Button>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
};

export default PatientDashboard;