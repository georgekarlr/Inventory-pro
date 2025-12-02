// types/calendar.ts

// --- Generic Response Wrapper ---
export interface ServiceResponse<T> {
    data: T | null;
    error: string | null;
}

// --- Entity Types ---

export interface CalendarItem {
    schedule_id: number;
    installment_id: number;
    due_date: string;     // YYYY-MM-DD
    amount_due: number;
    customer_name: string;
    customer_phone: string | null;
    order_id: number;
    days_remaining: number; // Positive = Future, Negative = Overdue, 0 = Due Today
}

// --- Parameter Interfaces ---

export interface GetDueCalendarParams {
    /** YYYY-MM-DD string. If omitted, defaults to Today in DB. */
    p_start_date?: string | null;

    /** YYYY-MM-DD string. If omitted, defaults to Today + 30 days in DB. */
    p_end_date?: string | null;

    /** Default is 100 */
    p_limit?: number;
}