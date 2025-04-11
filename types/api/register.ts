

export interface RegisterResponse{
    userDetails:userDetails
    token:string
}

export interface userDetails{
    email: string
    status?:string
    trialStart?: string; // ISO timestamp
    trialEnd?: string;
}