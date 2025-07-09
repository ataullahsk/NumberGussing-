export interface LoanType {
  id: string;
  typeName: string;
  description: string;
  interestRate: string;
  maxAmount: number;
  minAmount: number;
  tenure: string;
  features: string[];
  eligibility: string[];
  documents: string[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface LoanApplication {
  id: string;
  applicantName: string;
  email: string;
  phone: string;
  loanType: string;
  amount: number;
  tenure: number;
  monthlyIncome: number;
  employmentType: 'salaried' | 'self-employed' | 'business';
  purpose: string;
  status: 'pending' | 'approved' | 'rejected' | 'under-review';
  submittedAt: Date;
  reviewedAt?: Date;
  reviewedBy?: string;
  comments?: string;
  documents: UploadedFile[];
}

export interface UploadedFile {
  id: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  uploadedAt: Date;
  url: string;
}

export interface OrganizationInfo {
  id: string;
  name: string;
  tagline: string;
  description: string;
  address: string;
  phone: string;
  email: string;
  website: string;
  logo: string;
  establishedYear: number;
  licenseNumber: string;
  socialMedia: {
    facebook?: string;
    twitter?: string;
    linkedin?: string;
    instagram?: string;
  };
  bankingPartners: string[];
  achievements: string[];
  updatedAt: Date;
}

export interface User {
  id: string;
  username: string;
  email: string;
  role: 'admin' | 'manager' | 'staff';
  isActive: boolean;
  lastLogin?: Date;
  createdAt: Date;
}

export interface DashboardStats {
  totalApplications: number;
  pendingApplications: number;
  approvedApplications: number;
  rejectedApplications: number;
  totalLoanAmount: number;
  averageLoanAmount: number;
  monthlyApplications: number;
  conversionRate: number;
}