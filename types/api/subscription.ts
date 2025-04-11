export interface SubscribeResponse{
    status :string
    subscriptionID:string
    trialEnd:string
    trialStart:string
}

export interface StatusResponse {
    id: string;
    userID: string;
    stripeSubscriptionID: string;
    status: string;
    trialStart: string; // ISO timestamp
    trialEnd: string;   // ISO timestamp
    startedAt: string | null;
    nextBillingDate: string | null;
    createdAt: string;
    updatedAt: string;
}
