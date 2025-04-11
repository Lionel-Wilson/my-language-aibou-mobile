


export interface LoginResponse {
    token: string;
    userDetails: userDetails;
}

export interface userDetails{
    email: string
    status?:string
    trialStart?: string; // ISO timestamp
    trialEnd?: string;
}