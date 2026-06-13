export const ENQUIRY_TYPES = [
  "General Enquiry",
  "Power Platform Solutions",
  "AI & Agentic Systems",
  "Training & Academy",
  "Partnership & Collaboration",
  "Careers",
] as const;

export type EnquiryType = (typeof ENQUIRY_TYPES)[number];
