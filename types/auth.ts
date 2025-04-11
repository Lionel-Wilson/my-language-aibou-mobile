export interface User {
  email: string;
  status?:string
  trialStart?: string; // ISO timestamp
  trialEnd?: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface RegisterResponse {
  token: string;
  user: User;
}

export interface SubscriptionStatus {
  status:string
  trialEnd?: string;
}