import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { healthData } = await req.json();
    const authHeader = req.headers.get('Authorization')!;
    const token = authHeader.replace('Bearer ', '');
    
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data: { user } } = await supabase.auth.getUser(token);
    if (!user) throw new Error('Unauthorized');

    console.log('Received health data:', healthData);

    // Call Lovable AI to analyze the data
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) throw new Error('LOVABLE_API_KEY not configured');

    const prompt = `You are a medical AI assistant specializing in cardiovascular health risk assessment. 
    
Analyze the following patient data and provide a heart disease risk assessment:
- Age: ${healthData.age}
- Sex: ${healthData.sex === 1 ? 'Male' : 'Female'}
- Chest Pain Type: ${healthData.cp}
- Resting Blood Pressure: ${healthData.trestbps}
- Cholesterol: ${healthData.chol}
- Fasting Blood Sugar: ${healthData.fbs}
- Resting ECG: ${healthData.restecg}
- Max Heart Rate: ${healthData.thalach}
- Exercise Induced Angina: ${healthData.exang}
- ST Depression: ${healthData.oldpeak}
- Slope: ${healthData.slope}
- Number of Major Vessels: ${healthData.ca}
- Thal: ${healthData.thal}

Provide:
1. A risk score from 0-100 (higher = higher risk)
2. Risk level (Low, Moderate, High, Very High)
3. Three specific, actionable recommendations

Format your response as JSON:
{
  "riskScore": number,
  "riskLevel": "Low" | "Moderate" | "High" | "Very High",
  "recommendations": [string, string, string]
}`;

    const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [{ role: "user", content: prompt }],
      }),
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      console.error("AI gateway error:", aiResponse.status, errorText);
      throw new Error("AI analysis failed");
    }

    const aiData = await aiResponse.json();
    console.log('AI response:', aiData);
    
    const content = aiData.choices[0].message.content;
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    const analysis = jsonMatch ? JSON.parse(jsonMatch[0]) : {
      riskScore: 50,
      riskLevel: "Moderate",
      recommendations: ["Consult with a cardiologist", "Monitor blood pressure regularly", "Maintain a healthy diet"]
    };

    // Save health data
    const { data: healthRecord, error: healthError } = await supabase
      .from('patient_health_data')
      .insert({
        user_id: user.id,
        ...healthData
      })
      .select()
      .single();

    if (healthError) throw healthError;

    // Save prediction
    const { data: prediction, error: predictionError } = await supabase
      .from('ai_predictions')
      .insert({
        user_id: user.id,
        health_data_id: healthRecord.id,
        risk_score: analysis.riskScore,
        risk_level: analysis.riskLevel,
        recommendations: analysis.recommendations,
      })
      .select()
      .single();

    if (predictionError) throw predictionError;

    return new Response(
      JSON.stringify({ success: true, prediction }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});