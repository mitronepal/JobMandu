
import { Timestamp } from 'firebase/firestore';

export type UserRole = 'seeker' | 'provider' | null;

export interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  role: UserRole;
  membership: boolean;
  isBlocked?: boolean;
  totalReportsReceived?: number;
}

export type ListingStatus = 'Open' | 'Closed' | 'Available' | 'Rented';
export type JobType = 'Full-time' | 'Part-time' | 'Contract' | 'Freelance';
export type ListingCategory = 'job' | 'room';

export interface Listing {
  id: string;
  category: ListingCategory;
  title: string;
  companyName?: string;
  experienceLevel?: string;
  skillsRequired?: string;
  type?: JobType;
  roomCount?: string;
  floorLevel?: string;
  amenities?: string;
  price?: number; 
  latitude?: number;
  longitude?: number;
  description: string;
  contactNumber: string;
  location: string;
  minSalary?: number;
  maxSalary?: number;
  status: ListingStatus;
  providerId: string;
  providerName: string;
  timestamp: Timestamp;
  reports?: string[];
  reportsCount?: number;
  views?: number; 
  viewedBy?: string[]; // Unique users who viewed this
}

export type Job = Listing;
export type JobStatus = ListingStatus;
