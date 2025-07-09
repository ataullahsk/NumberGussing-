import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { LoanType, LoanApplication, OrganizationInfo, User, DashboardStats } from '../types';

interface AppState {
  // Authentication
  user: User | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;

  // Organization Info
  organizationInfo: OrganizationInfo;
  updateOrganizationInfo: (info: Partial<OrganizationInfo>) => void;

  // Loan Types
  loanTypes: LoanType[];
  addLoanType: (loanType: Omit<LoanType, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateLoanType: (id: string, updates: Partial<LoanType>) => void;
  deleteLoanType: (id: string) => void;

  // Loan Applications
  loanApplications: LoanApplication[];
  addLoanApplication: (application: Omit<LoanApplication, 'id' | 'submittedAt' | 'status'>) => void;
  updateApplicationStatus: (id: string, status: LoanApplication['status'], comments?: string) => void;

  // Dashboard Stats
  dashboardStats: DashboardStats;
  updateDashboardStats: () => void;
}

const defaultOrganizationInfo: OrganizationInfo = {
  id: '1',
  name: 'SecureFinance Solutions',
  tagline: 'Your Trusted Financial Partner',
  description: 'We provide comprehensive financial solutions including personal loans, home loans, car loans, and business financing. With over 15 years of experience, we have helped thousands of customers achieve their financial goals.',
  address: '123 Financial District, Business Tower, Floor 15, New York, NY 10001',
  phone: '+1 (555) 123-4567',
  email: 'info@securefinance.com',
  website: 'www.securefinance.com',
  logo: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=200&h=200&fit=crop&crop=center',
  establishedYear: 2008,
  licenseNumber: 'FL-2008-NYC-001234',
  socialMedia: {
    facebook: 'https://facebook.com/securefinance',
    twitter: 'https://twitter.com/securefinance',
    linkedin: 'https://linkedin.com/company/securefinance',
    instagram: 'https://instagram.com/securefinance'
  },
  bankingPartners: ['Chase Bank', 'Bank of America', 'Wells Fargo', 'Citibank'],
  achievements: [
    'Best Financial Services Provider 2023',
    'Customer Choice Award 2022',
    'Excellence in Lending 2021',
    'Top 100 Financial Companies 2020'
  ],
  updatedAt: new Date()
};

const defaultLoanTypes: LoanType[] = [
  {
    id: '1',
    typeName: 'Personal Loan',
    description: 'Quick and easy personal loans for your immediate financial needs',
    interestRate: '10.5% - 18.5%',
    maxAmount: 500000,
    minAmount: 10000,
    tenure: '12 - 60 months',
    features: [
      'No collateral required',
      'Quick approval within 24 hours',
      'Flexible repayment options',
      'Minimal documentation',
      'Competitive interest rates'
    ],
    eligibility: [
      'Age: 21-65 years',
      'Minimum income: $25,000/year',
      'Employment: Minimum 2 years',
      'Credit score: 650+',
      'Valid identification documents'
    ],
    documents: [
      'Identity proof (Passport/Driver\'s License)',
      'Address proof (Utility bill)',
      'Income proof (Salary slips/Tax returns)',
      'Bank statements (3 months)',
      'Employment verification letter'
    ],
    isActive: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date()
  },
  {
    id: '2',
    typeName: 'Home Loan',
    description: 'Realize your dream of owning a home with our competitive home loan rates',
    interestRate: '8.5% - 12.5%',
    maxAmount: 5000000,
    minAmount: 100000,
    tenure: '120 - 360 months',
    features: [
      'Up to 90% financing',
      'Flexible repayment tenure',
      'No prepayment charges',
      'Tax benefits available',
      'Quick processing'
    ],
    eligibility: [
      'Age: 23-65 years',
      'Minimum income: $50,000/year',
      'Employment: Minimum 3 years',
      'Credit score: 700+',
      'Property documents required'
    ],
    documents: [
      'Identity and address proof',
      'Income documents',
      'Property documents',
      'Bank statements (6 months)',
      'NOC from builder/society'
    ],
    isActive: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date()
  },
  {
    id: '3',
    typeName: 'Car Loan',
    description: 'Drive your dream car today with our attractive car loan offers',
    interestRate: '9.5% - 15.5%',
    maxAmount: 2000000,
    minAmount: 50000,
    tenure: '12 - 84 months',
    features: [
      'Up to 85% financing',
      'New and used car loans',
      'Quick approval process',
      'Flexible EMI options',
      'Insurance assistance'
    ],
    eligibility: [
      'Age: 21-65 years',
      'Minimum income: $30,000/year',
      'Employment: Minimum 1 year',
      'Credit score: 650+',
      'Valid driving license'
    ],
    documents: [
      'Identity and address proof',
      'Income proof',
      'Bank statements (3 months)',
      'Driving license',
      'Car quotation/invoice'
    ],
    isActive: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date()
  },
  {
    id: '4',
    typeName: 'Business Loan',
    description: 'Fuel your business growth with our flexible business financing solutions',
    interestRate: '12.5% - 20.5%',
    maxAmount: 10000000,
    minAmount: 100000,
    tenure: '12 - 120 months',
    features: [
      'Collateral-free options available',
      'Working capital financing',
      'Equipment financing',
      'Flexible repayment terms',
      'Quick disbursement'
    ],
    eligibility: [
      'Business vintage: Minimum 2 years',
      'Annual turnover: $100,000+',
      'Credit score: 700+',
      'Valid business registration',
      'Financial statements required'
    ],
    documents: [
      'Business registration documents',
      'Financial statements (2 years)',
      'Bank statements (6 months)',
      'GST returns',
      'Identity proof of directors'
    ],
    isActive: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date()
  }
];

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Authentication
      user: null,
      isAuthenticated: false,
      login: async (username: string, password: string) => {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        if (username === 'admin' && password === 'admin123') {
          const user: User = {
            id: '1',
            username: 'admin',
            email: 'admin@securefinance.com',
            role: 'admin',
            isActive: true,
            lastLogin: new Date(),
            createdAt: new Date('2024-01-01')
          };
          set({ user, isAuthenticated: true });
          return true;
        }
        return false;
      },
      logout: () => {
        set({ user: null, isAuthenticated: false });
      },

      // Organization Info
      organizationInfo: defaultOrganizationInfo,
      updateOrganizationInfo: (info) => {
        set(state => ({
          organizationInfo: {
            ...state.organizationInfo,
            ...info,
            updatedAt: new Date()
          }
        }));
      },

      // Loan Types
      loanTypes: defaultLoanTypes,
      addLoanType: (loanType) => {
        const newLoanType: LoanType = {
          ...loanType,
          id: Date.now().toString(),
          createdAt: new Date(),
          updatedAt: new Date()
        };
        set(state => ({
          loanTypes: [...state.loanTypes, newLoanType]
        }));
      },
      updateLoanType: (id, updates) => {
        set(state => ({
          loanTypes: state.loanTypes.map(loan =>
            loan.id === id
              ? { ...loan, ...updates, updatedAt: new Date() }
              : loan
          )
        }));
      },
      deleteLoanType: (id) => {
        set(state => ({
          loanTypes: state.loanTypes.filter(loan => loan.id !== id)
        }));
      },

      // Loan Applications
      loanApplications: [],
      addLoanApplication: (application) => {
        const newApplication: LoanApplication = {
          ...application,
          id: Date.now().toString(),
          submittedAt: new Date(),
          status: 'pending',
          documents: []
        };
        set(state => ({
          loanApplications: [...state.loanApplications, newApplication]
        }));
        get().updateDashboardStats();
      },
      updateApplicationStatus: (id, status, comments) => {
        set(state => ({
          loanApplications: state.loanApplications.map(app =>
            app.id === id
              ? {
                  ...app,
                  status,
                  comments,
                  reviewedAt: new Date(),
                  reviewedBy: state.user?.username || 'Admin'
                }
              : app
          )
        }));
        get().updateDashboardStats();
      },

      // Dashboard Stats
      dashboardStats: {
        totalApplications: 0,
        pendingApplications: 0,
        approvedApplications: 0,
        rejectedApplications: 0,
        totalLoanAmount: 0,
        averageLoanAmount: 0,
        monthlyApplications: 0,
        conversionRate: 0
      },
      updateDashboardStats: () => {
        const { loanApplications } = get();
        const total = loanApplications.length;
        const pending = loanApplications.filter(app => app.status === 'pending').length;
        const approved = loanApplications.filter(app => app.status === 'approved').length;
        const rejected = loanApplications.filter(app => app.status === 'rejected').length;
        const totalAmount = loanApplications.reduce((sum, app) => sum + app.amount, 0);
        const avgAmount = total > 0 ? totalAmount / total : 0;
        
        // Calculate monthly applications (last 30 days)
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        const monthlyApps = loanApplications.filter(
          app => app.submittedAt >= thirtyDaysAgo
        ).length;
        
        const conversionRate = total > 0 ? (approved / total) * 100 : 0;

        set({
          dashboardStats: {
            totalApplications: total,
            pendingApplications: pending,
            approvedApplications: approved,
            rejectedApplications: rejected,
            totalLoanAmount: totalAmount,
            averageLoanAmount: avgAmount,
            monthlyApplications: monthlyApps,
            conversionRate
          }
        });
      }
    }),
    {
      name: 'finance-app-storage',
      partialize: (state) => ({
        organizationInfo: state.organizationInfo,
        loanTypes: state.loanTypes,
        loanApplications: state.loanApplications,
        user: state.user,
        isAuthenticated: state.isAuthenticated
      })
    }
  )
);