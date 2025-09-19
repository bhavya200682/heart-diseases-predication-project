import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { 
  User, 
  Heart, 
  Activity, 
  BarChart3, 
  ArrowRight, 
  ArrowLeft,
  CheckCircle 
} from "lucide-react";

interface FormData {
  // Personal Information
  age: string;
  gender: string;
  // Medical Parameters
  chestPainType: string;
  restingBP: string;
  cholesterol: string;
  fastingBS: string;
  restingECG: string;
  maxHR: string;
  exerciseAngina: string;
  oldpeak: string;
  stSlope: string;
}

const initialFormData: FormData = {
  age: "",
  gender: "",
  chestPainType: "",
  restingBP: "",
  cholesterol: "",
  fastingBS: "",
  restingECG: "",
  maxHR: "",
  exerciseAngina: "",
  oldpeak: "",
  stSlope: ""
};

const PatientForm = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const totalSteps = 4;
  const progress = (currentStep / totalSteps) * 100;

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6 animate-fade-in">
            <div className="text-center mb-8">
              <User className="h-16 w-16 mx-auto text-primary mb-4" />
              <h3 className="text-2xl font-bold">Personal Information</h3>
              <p className="text-muted-foreground">Let's start with basic demographics</p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">Age</label>
                <input
                  type="number"
                  value={formData.age}
                  onChange={(e) => handleInputChange("age", e.target.value)}
                  className="input-medical"
                  placeholder="Enter your age"
                  min="18"
                  max="100"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Gender</label>
                <select
                  value={formData.gender}
                  onChange={(e) => handleInputChange("gender", e.target.value)}
                  className="input-medical"
                >
                  <option value="">Select gender</option>
                  <option value="M">Male</option>
                  <option value="F">Female</option>
                </select>
              </div>
            </div>
          </div>
        );
      
      case 2:
        return (
          <div className="space-y-6 animate-fade-in">
            <div className="text-center mb-8">
              <Heart className="h-16 w-16 mx-auto text-primary mb-4 animate-heartbeat" />
              <h3 className="text-2xl font-bold">Cardiac Symptoms</h3>
              <p className="text-muted-foreground">Information about chest pain and symptoms</p>
            </div>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">Chest Pain Type</label>
                <select
                  value={formData.chestPainType}
                  onChange={(e) => handleInputChange("chestPainType", e.target.value)}
                  className="input-medical"
                >
                  <option value="">Select chest pain type</option>
                  <option value="TA">Typical Angina</option>
                  <option value="ATA">Atypical Angina</option>
                  <option value="NAP">Non-Anginal Pain</option>
                  <option value="ASY">Asymptomatic</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Exercise Induced Angina</label>
                <select
                  value={formData.exerciseAngina}
                  onChange={(e) => handleInputChange("exerciseAngina", e.target.value)}
                  className="input-medical"
                >
                  <option value="">Select option</option>
                  <option value="Y">Yes</option>
                  <option value="N">No</option>
                </select>
              </div>
            </div>
          </div>
        );
      
      case 3:
        return (
          <div className="space-y-6 animate-fade-in">
            <div className="text-center mb-8">
              <Activity className="h-16 w-16 mx-auto text-primary mb-4" />
              <h3 className="text-2xl font-bold">Vital Signs</h3>
              <p className="text-muted-foreground">Blood pressure, heart rate, and ECG data</p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">Resting Blood Pressure (mmHg)</label>
                <input
                  type="number"
                  value={formData.restingBP}
                  onChange={(e) => handleInputChange("restingBP", e.target.value)}
                  className="input-medical"
                  placeholder="120"
                  min="80"
                  max="200"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Maximum Heart Rate</label>
                <input
                  type="number"
                  value={formData.maxHR}
                  onChange={(e) => handleInputChange("maxHR", e.target.value)}
                  className="input-medical"
                  placeholder="150"
                  min="60"
                  max="220"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Resting ECG</label>
                <select
                  value={formData.restingECG}
                  onChange={(e) => handleInputChange("restingECG", e.target.value)}
                  className="input-medical"
                >
                  <option value="">Select ECG result</option>
                  <option value="Normal">Normal</option>
                  <option value="ST">ST-T wave abnormality</option>
                  <option value="LVH">Left ventricular hypertrophy</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">ST Slope</label>
                <select
                  value={formData.stSlope}
                  onChange={(e) => handleInputChange("stSlope", e.target.value)}
                  className="input-medical"
                >
                  <option value="">Select ST slope</option>
                  <option value="Up">Upsloping</option>
                  <option value="Flat">Flat</option>
                  <option value="Down">Downsloping</option>
                </select>
              </div>
            </div>
          </div>
        );
      
      case 4:
        return (
          <div className="space-y-6 animate-fade-in">
            <div className="text-center mb-8">
              <BarChart3 className="h-16 w-16 mx-auto text-primary mb-4" />
              <h3 className="text-2xl font-bold">Laboratory Results</h3>
              <p className="text-muted-foreground">Cholesterol and blood sugar levels</p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">Cholesterol (mg/dl)</label>
                <input
                  type="number"
                  value={formData.cholesterol}
                  onChange={(e) => handleInputChange("cholesterol", e.target.value)}
                  className="input-medical"
                  placeholder="200"
                  min="100"
                  max="400"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Fasting Blood Sugar {">"} 120 mg/dl</label>
                <select
                  value={formData.fastingBS}
                  onChange={(e) => handleInputChange("fastingBS", e.target.value)}
                  className="input-medical"
                >
                  <option value="">Select option</option>
                  <option value="1">Yes ({">"} 120 mg/dl)</option>
                  <option value="0">No (≤ 120 mg/dl)</option>
                </select>
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-2">Oldpeak (ST depression)</label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.oldpeak}
                  onChange={(e) => handleInputChange("oldpeak", e.target.value)}
                  className="input-medical"
                  placeholder="0.0"
                  min="-3"
                  max="7"
                />
              </div>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              Heart Health Assessment
            </h2>
            <p className="text-xl text-muted-foreground">
              Complete your medical assessment for AI-powered risk analysis
            </p>
          </div>
          
          <Card className="card-medical">
            <CardHeader>
              <div className="flex items-center justify-between mb-4">
                <CardTitle>Step {currentStep} of {totalSteps}</CardTitle>
                <div className="text-sm text-muted-foreground">
                  {Math.round(progress)}% Complete
                </div>
              </div>
              <Progress value={progress} className="mb-4" />
              <CardDescription>
                Please provide accurate information for the best assessment results.
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              {renderStepContent()}
              
              <div className="flex justify-between mt-8 pt-6 border-t border-border">
                <Button
                  variant="outline"
                  onClick={prevStep}
                  disabled={currentStep === 1}
                  className="flex items-center space-x-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span>Previous</span>
                </Button>
                
                {currentStep === totalSteps ? (
                  <Button className="btn-primary flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4" />
                    <span>Get Prediction</span>
                  </Button>
                ) : (
                  <Button 
                    onClick={nextStep}
                    className="btn-primary flex items-center space-x-2"
                  >
                    <span>Next</span>
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default PatientForm;