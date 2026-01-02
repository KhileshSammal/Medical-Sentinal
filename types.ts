
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

export interface GenomicMarker {
  trait: string;
  impact: 'POSITIVE' | 'NEUTRAL' | 'NEGATIVE';
  description: string;
  recommendation: string;
}

export interface EnvironmentData {
  aqi: number;
  temp: number;
  humidity: number;
  mainPollutant: string;
  timestamp: string;
  location: string;
}

export interface ChronicLog {
  id: string;
  symptom: string;
  severity: 1 | 2 | 3 | 4 | 5;
  timestamp: string;
  envContext?: Partial<EnvironmentData>;
}

export interface UserProfile {
  abhaId: string;
  name: string;
  motherName?: string;
  fatherName?: string;
  age: number;
  dob: string;
  gender: 'MALE' | 'FEMALE' | 'OTHER';
  bloodGroup: string;
  weight: number;
  height: number;
  isSmoker: boolean;
  chronicConditions: string[];
  allergies: string[];
  dietaryRestrictions?: string[]; // e.g. "DIABETIC", "HYPERTENSIVE", "GLUTEN_FREE"
  profilePic?: string;
  longevityScore?: number;
  genomicProfile?: GenomicMarker[];
  chronicLogs?: ChronicLog[];
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

export interface ConciergeMessage {
  id: string;
  sender: 'USER' | 'QUARTERMASTER';
  text: string;
  timestamp: string;
  status?: 'SENT' | 'DELIVERED' | 'READ';
}

export interface FoodScanResult {
  id: string;
  productName: string;
  brand: string;
  nutrition: {
    calories: number;
    protein: number;
    carbs: number;
    sugar: number;
    fat: number;
    saturatedFat: number;
    sodium: number;
    fiber: number;
    cholesterol: number;
  };
  ingredients: string[];
  novaScore: 1 | 2 | 3 | 4;
  healthGrade: 'A' | 'B' | 'C' | 'D' | 'E';
  confidenceScore: number;
  timestamp: string;
  servingSize: string;
  alerts: {
    type: 'ALLERGEN' | 'HEALTH' | 'ADDITIVE';
    message: string;
    severity: 'LOW' | 'MEDIUM' | 'HIGH';
  }[];
}
