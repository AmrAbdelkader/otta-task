export interface Reaction {
    user_id: number;
    job_id: number;
    company_id?: number;
    direction: boolean;
    time: string;
}