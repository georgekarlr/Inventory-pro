// types/loans.ts

// --- Generic Response Wrapper ---
export interface ServiceResponse<T> {
    data: T | null;
    error: string | null;
}

// --- Entity Types ---

export interface ActiveLoan {
    installment_id: number;
    order_id: number;
    customer_name: string;
    phone: string | null;
    plan_name: string;
    total_financed: number;
    remaining_balance: number;
    start_date: string; // YYYY-MM-DD
    next_due_date: string | null; // YYYY-MM-DD, can be null if no pending schedule exists
    status: 'active' | 'overdue';
}

// --- Parameter Interfaces ---

export interface GetActiveLoansParams {
    p_search_term?: string;
    p_limit?: number;
    p_offset?: number;
}