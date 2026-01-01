
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
}

export interface UserProfile {
  abhaId: string;
  name: string;
  age: number;
  bloodGroup: string;
  allergies: string[];
}

export interface InsurancePolicy {
  id: string;
  provider: string;
  type: 'HEALTH' | 'TERM_LIFE';
  policyNumber: string;
  sumInsured: number;
  renewalDate: string;
  status: 'ACTIVE' | 'LAPSED' | 'PENDING';
  nominees?: string[];
  coverageDetails?: {
    cashless: boolean;
    noClaimBonus: number;
    roomRentLimit: string;
  };
}
