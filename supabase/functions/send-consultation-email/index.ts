import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.1';

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ConsultationBookingRequest {
  consultationId: string;
  patientName: string;
  patientEmail: string;
  doctorName: string;
  consultationType: string;
  preferredDate: string;
  preferredTime?: string;
  meetingLink: string;
  totalAmount: number;
}

const generateMeetingLink = (consultationId: string): string => {
  // Generate a unique meeting room URL
  const roomId = `consultation-${consultationId}`;
  return `https://meet.jit.si/${roomId}`;
};

const handler = async (req: Request): Promise<Response> => {
  console.log("Consultation email function called");

  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const {
      consultationId,
      patientName,
      patientEmail,
      doctorName,
      consultationType,
      preferredDate,
      preferredTime,
      meetingLink,
      totalAmount
    }: ConsultationBookingRequest = await req.json();

    console.log("Processing consultation booking email for:", patientEmail);

    // Create meeting link if not provided
    const finalMeetingLink = meetingLink || generateMeetingLink(consultationId);

    // Format date and time
    const formattedDate = new Date(preferredDate).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    const emailContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #8B5CF6, #3B82F6); padding: 30px; border-radius: 12px; text-align: center; margin-bottom: 30px;">
          <h1 style="color: white; margin: 0; font-size: 28px;">Consultation Confirmed!</h1>
          <p style="color: #E0E7FF; margin: 10px 0 0 0; font-size: 16px;">Your Ayurvedic consultation has been scheduled</p>
        </div>
        
        <div style="background: #F8FAFC; padding: 25px; border-radius: 8px; margin-bottom: 25px;">
          <h2 style="color: #334155; margin-top: 0;">Consultation Details</h2>
          <div style="display: grid; gap: 15px;">
            <div style="display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #E2E8F0;">
              <span style="font-weight: 600; color: #475569;">Patient:</span>
              <span style="color: #64748B;">${patientName}</span>
            </div>
            <div style="display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #E2E8F0;">
              <span style="font-weight: 600; color: #475569;">Doctor:</span>
              <span style="color: #64748B;">${doctorName}</span>
            </div>
            <div style="display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #E2E8F0;">
              <span style="font-weight: 600; color: #475569;">Date:</span>
              <span style="color: #64748B;">${formattedDate}</span>
            </div>
            ${preferredTime ? `
            <div style="display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #E2E8F0;">
              <span style="font-weight: 600; color: #475569;">Time:</span>
              <span style="color: #64748B;">${preferredTime}</span>
            </div>` : ''}
            <div style="display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #E2E8F0;">
              <span style="font-weight: 600; color: #475569;">Type:</span>
              <span style="color: #64748B;">${consultationType === 'video' ? 'Video Call' : 'Chat'}</span>
            </div>
            <div style="display: flex; justify-content: space-between; padding: 10px 0;">
              <span style="font-weight: 600; color: #475569;">Total Amount:</span>
              <span style="color: #059669; font-weight: 600;">₹${totalAmount}</span>
            </div>
          </div>
        </div>

        ${consultationType === 'video' ? `
        <div style="background: #EFF6FF; border: 1px solid #BFDBFE; padding: 20px; border-radius: 8px; margin-bottom: 25px;">
          <h3 style="color: #1E40AF; margin-top: 0;">Join Your Video Consultation</h3>
          <p style="color: #374151; margin-bottom: 15px;">Click the button below to join your video consultation at the scheduled time:</p>
          <a href="${finalMeetingLink}" 
             style="display: inline-block; background: linear-gradient(135deg, #8B5CF6, #3B82F6); color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 600;">
            Join Video Call
          </a>
          <p style="color: #6B7280; font-size: 14px; margin-top: 15px;">
            <strong>Meeting Link:</strong> ${finalMeetingLink}
          </p>
        </div>` : ''}

        <div style="background: #FEF3C7; border: 1px solid #F59E0B; padding: 20px; border-radius: 8px; margin-bottom: 25px;">
          <h3 style="color: #92400E; margin-top: 0;">Important Notes</h3>
          <ul style="color: #374151; margin: 0; padding-left: 20px;">
            <li>Please join the consultation 5 minutes before the scheduled time</li>
            <li>Ensure you have a stable internet connection for video calls</li>
            <li>Have your health concerns and questions ready</li>
            <li>Keep any relevant medical records accessible</li>
          </ul>
        </div>

        <div style="text-align: center; color: #6B7280; font-size: 14px; margin-top: 30px;">
          <p>If you have any questions, please contact our support team.</p>
          <p style="margin-top: 20px;">
            <strong>AyurGen Health Platform</strong><br>
            Your trusted partner in Ayurvedic wellness
          </p>
        </div>
      </div>
    `;

    const emailResponse = await resend.emails.send({
      from: "AyurGen <consultation@resend.dev>",
      to: [patientEmail],
      subject: `Consultation Confirmed with ${doctorName} - ${formattedDate}`,
      html: emailContent,
    });

    console.log("Email sent successfully:", emailResponse);

    return new Response(JSON.stringify({ 
      success: true, 
      emailResponse,
      meetingLink: finalMeetingLink 
    }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("Error in send-consultation-email function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);