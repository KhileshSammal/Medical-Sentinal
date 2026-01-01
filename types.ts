
export enum HealthStatus {
  OPTIMAL = 'OPTIMAL',
  STABLE = 'STABLE',
  WARNING = 'WARNING',
  CRITICAL = 'CRITICAL'
}

export interface Biomarker {
  name: string;
  value: number;
  unit: string;
  referenceRange: string;
  timestamp: string;
  status: HealthStatus;
}

export interface MedicalReport {
  id: string;
  labName: string;
  date: string;
  type: 'BLOOD' | 'IMAGING' | 'PRESCRIPTION' | 'URINE';
  markers: Biomarker[];
  summary?: string;
  fileUrl?: string;
}

export interface UserProfile {
  abhaId: string;
  name: string;
  age: number;
  dob: string;
  gender: 'MALE' | 'FEMALE' | 'OTHER';
  bloodGroup: string;
  weight: number;
  height: number;
  isSmoker: boolean;
  chronicConditions: string[];
  allergies: string[];
  profilePic?: string;
}

export interface Nominee {
  name: string;
  relationship: string;
}

export interface InsurancePolicy {
  id: string;
  provider: string;
  type: 'HEALTH' | 'TERM_LIFE';
  policyNumber: string;
  sumInsured: number;
  renewalDate: string;
  premiumAmount: number;
  status: 'ACTIVE' | 'LAPSED' | 'PENDING';
  nextPremiumDate: string;
  benefitsUsed: {
    freeCheckup: boolean;
    opdUsed: number;
  };
  nominees?: Nominee[];
  coverageDetails?: {
    cashless: boolean;
    noClaimBonus: number;
    roomRentLimit: string;
  };
}
