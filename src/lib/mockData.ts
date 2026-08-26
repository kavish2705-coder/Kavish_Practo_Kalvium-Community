import { DoctorCardData, Specialty, TimeSlot } from "@/types";

export const MOCK_SPECIALTIES: Specialty[] = [
  {
    id: "cardiology",
    name: "Cardiology",
    description: "Heart specialists and cardiovascular care professionals",
    iconName: "HeartPulse",
    doctorCount: 14,
  },
  {
    id: "dermatology",
    name: "Dermatology",
    description: "Skin, hair, and nail health specialists",
    iconName: "Sparkles",
    doctorCount: 18,
  },
  {
    id: "pediatrics",
    name: "Pediatrics",
    description: "Comprehensive care for infants, children, and teens",
    iconName: "Baby",
    doctorCount: 12,
  },
  {
    id: "general-physician",
    name: "General Physician",
    description: "Primary health consultations, checkups, and illness treatment",
    iconName: "Stethoscope",
    doctorCount: 25,
  },
  {
    id: "orthopedics",
    name: "Orthopedics",
    description: "Bone, joint, spine, and muscle specialists",
    iconName: "Activity",
    doctorCount: 10,
  },
  {
    id: "neurology",
    name: "Neurology",
    description: "Brain, nerve, and spinal cord medical specialists",
    iconName: "Brain",
    doctorCount: 8,
  },
];

export const MOCK_DOCTORS: DoctorCardData[] = [
  {
    id: "doc-1",
    userId: "u-1",
    name: "Dr. Ananya Sharma",
    email: "ananya.sharma@practo.com",
    specialization: "Cardiology",
    qualification: "MBBS, MD (Cardiology), FACC",
    experience: 14,
    fee: 800,
    clinicInfo: "HeartCare Super Specialty Clinic, Indiranagar, Bengaluru",
    rating: 4.9,
    totalReviews: 142,
    nextAvailableSlot: "Today at 04:30 PM",
    about: "Dr. Ananya Sharma is a senior cardiologist with over 14 years of clinical experience in non-invasive cardiology, preventive cardiac care, and echocardiography.",
  },
  {
    id: "doc-2",
    userId: "u-2",
    name: "Dr. Vikramaditya Rao",
    email: "vikram.rao@practo.com",
    specialization: "Dermatology",
    qualification: "MBBS, DVD, MD (Dermatology)",
    experience: 11,
    fee: 650,
    clinicInfo: "Aesthetic Skin & Hair Clinic, Koramangala, Bengaluru",
    rating: 4.8,
    totalReviews: 98,
    nextAvailableSlot: "Tomorrow at 11:00 AM",
    about: "Specialized in clinical dermatology, anti-aging therapies, acne treatments, and advanced laser treatments.",
  },
  {
    id: "doc-3",
    userId: "u-3",
    name: "Dr. Rajesh Iyer",
    email: "rajesh.iyer@practo.com",
    specialization: "General Physician",
    qualification: "MBBS, DNB (Internal Medicine)",
    experience: 18,
    fee: 500,
    clinicInfo: "City Health Care Clinic, HSR Layout, Bengaluru",
    rating: 4.9,
    totalReviews: 215,
    nextAvailableSlot: "Today at 02:00 PM",
    about: "Expert in diabetes management, hypertension, lifestyle disorders, and general adult healthcare.",
  },
  {
    id: "doc-4",
    userId: "u-4",
    name: "Dr. Priya Nair",
    email: "priya.nair@practo.com",
    specialization: "Pediatrics",
    qualification: "MBBS, MD (Pediatrics), DCH",
    experience: 9,
    fee: 600,
    clinicInfo: "Little Angels Child Clinic, Whitefield, Bengaluru",
    rating: 4.9,
    totalReviews: 164,
    nextAvailableSlot: "Today at 05:00 PM",
    about: "Compassionate pediatrician with expertise in infant growth monitoring, vaccinations, and pediatric nutrition.",
  },
  {
    id: "doc-5",
    userId: "u-5",
    name: "Dr. Siddharth Verma",
    email: "siddharth.verma@practo.com",
    specialization: "Orthopedics",
    qualification: "MBBS, MS (Orthopedics), MCh",
    experience: 15,
    fee: 900,
    clinicInfo: "Spine & Joint Institute, Jayanagar, Bengaluru",
    rating: 4.7,
    totalReviews: 87,
    nextAvailableSlot: "Tomorrow at 03:30 PM",
    about: "Senior orthopedic surgeon specializing in joint replacement, sports injuries, and arthroscopic surgery.",
  },
  {
    id: "doc-6",
    userId: "u-6",
    name: "Dr. Meera Kulkarni",
    email: "meera.kulkarni@practo.com",
    specialization: "Neurology",
    qualification: "MBBS, DM (Neurology)",
    experience: 13,
    fee: 1000,
    clinicInfo: "Neuro Wellness Center, MG Road, Bengaluru",
    rating: 4.9,
    totalReviews: 110,
    nextAvailableSlot: "Today at 06:00 PM",
    about: "Specialist in migraine management, epilepsy, stroke rehab, and neuro-muscular disorders.",
  },
  {
    id: "doc-7",
    userId: "u-7",
    name: "Dr. Arvind Menon",
    email: "arvind.menon@practo.com",
    specialization: "Cardiology",
    qualification: "MBBS, DM (Cardiology)",
    experience: 8,
    fee: 750,
    clinicInfo: "Prime Heart Center, BTM Layout, Bengaluru",
    rating: 4.8,
    totalReviews: 76,
    nextAvailableSlot: "Tomorrow at 10:00 AM",
    about: "Dedicated cardiologist focusing on interventional cardiology, ECG diagnostics, and lipid management.",
  },
  {
    id: "doc-8",
    userId: "u-8",
    name: "Dr. Kavita Joshi",
    email: "kavita.joshi@practo.com",
    specialization: "Dermatology",
    qualification: "MBBS, MD (Dermatology & Venereology)",
    experience: 6,
    fee: 600,
    clinicInfo: "Glow Skin & Cosmetic Clinic, JP Nagar, Bengaluru",
    rating: 4.7,
    totalReviews: 54,
    nextAvailableSlot: "Today at 07:15 PM",
    about: "Experienced dermatologist specializing in cosmetic dermatology, trichology, and chemical peels.",
  }
];

export function getMockSlotsForDate(doctorId: string, dateStr: string): TimeSlot[] {
  const times = [
    { start: "09:00", end: "09:30", isBooked: false },
    { start: "09:30", end: "10:00", isBooked: true },
    { start: "10:00", end: "10:30", isBooked: false },
    { start: "10:30", end: "11:00", isBooked: false },
    { start: "11:30", end: "12:00", isBooked: true },
    { start: "14:00", end: "14:30", isBooked: false },
    { start: "14:30", end: "15:00", isBooked: false },
    { start: "15:30", end: "16:00", isBooked: true },
    { start: "16:30", end: "17:00", isBooked: false },
    { start: "17:00", end: "17:30", isBooked: false },
    { start: "18:00", end: "18:30", isBooked: false },
    { start: "19:00", end: "19:30", isBooked: true },
  ];

  const baseDate = dateStr ? new Date(dateStr) : new Date();

  return times.map((t) => {
    const [startH, startM] = t.start.split(":").map(Number);
    const [endH, endM] = t.end.split(":").map(Number);

    const startTime = new Date(baseDate);
    startTime.setHours(startH, startM, 0, 0);

    const endTime = new Date(baseDate);
    endTime.setHours(endH, endM, 0, 0);

    const slotHash = (doctorId.length + startH * 7) % 5;
    const isAvailable = !t.isBooked && slotHash !== 0;

    return {
      startTime,
      endTime,
      isAvailable,
    };
  });
}

export function getDoctorById(id: string): DoctorCardData | undefined {
  return MOCK_DOCTORS.find((d) => d.id === id);
}
