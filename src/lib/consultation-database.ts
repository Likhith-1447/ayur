import { supabase } from "@/integrations/supabase/client";

export interface ConsultationBooking {
  id: string;
  user_id: string;
  doctor_id: string;
  doctor_name: string;
  patient_name: string;
  patient_email: string;
  patient_phone: string;
  consultation_type: 'video' | 'chat';
  preferred_date: string;
  preferred_time?: string;
  symptoms?: string;
  meeting_link?: string;
  meeting_id?: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  total_amount: number;
  created_at: string;
  updated_at: string;
}

export const createConsultationBooking = async (bookingData: Omit<ConsultationBooking, 'id' | 'created_at' | 'updated_at' | 'status' | 'meeting_link' | 'meeting_id'>) => {
  const { data, error } = await supabase
    .from('consultations')
    .insert(bookingData)
    .select()
    .single();

  if (error) {
    console.error("Error creating consultation booking:", error);
    throw error;
  }

  return data;
};

export const getUserConsultations = async (userId: string) => {
  const { data, error } = await supabase
    .from('consultations')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error("Error fetching user consultations:", error);
    throw error;
  }

  return data;
};

export const updateConsultationMeetingLink = async (consultationId: string, meetingLink: string, meetingId: string) => {
  const { data, error } = await supabase
    .from('consultations')
    .update({ 
      meeting_link: meetingLink,
      meeting_id: meetingId
    })
    .eq('id', consultationId)
    .select()
    .single();

  if (error) {
    console.error("Error updating consultation meeting link:", error);
    throw error;
  }

  return data;
};

export const updateConsultationStatus = async (consultationId: string, status: ConsultationBooking['status']) => {
  const { data, error } = await supabase
    .from('consultations')
    .update({ status })
    .eq('id', consultationId)
    .select()
    .single();

  if (error) {
    console.error("Error updating consultation status:", error);
    throw error;
  }

  return data;
};