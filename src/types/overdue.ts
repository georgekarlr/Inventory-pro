// types/overdue.ts

// --- Generic Response Wrapper ---
export interface ServiceResponse<T> {
    data: T | null;
    error: string | null;
}

// --- Enum Types ---
// Updated based on your specific list: pending, paid, overdue, partial, cancelled
export type ScheduleStatus = 'pending' | 'paid' | 'overdue' | 'partial' | 'cancelled';

// --- Entity Types ---

export interface OverduePayment {
    schedule_id: number;
    installment_id: number;
    due_date: string;     // YYYY-MM-DD
    amount_due: number;
    customer_name: string;
    customer_phone: string | null;
    customer_address: string | null;
    days_overdue: number; // Positive integer indicating how many days late
    status: ScheduleStatus;
}

// --- Parameter Interfaces ---

export interface GetOverduePaymentsParams {
    p_search_term?: string;
    p_limit?: number;
}