// types/salesList.ts

// --- Generic Response Wrapper ---
export interface ServiceResponse<T> {
    data: T | null;
    error: string | null;
}

// --- Enum Types ---
// Matches PostgreSQL enums
export type SaleType = 'full_payment' | 'installment_with_down' | 'pure_installment';

export type OrderStatus =
    | 'completed'
    | 'ongoing'
    | 'defaulted'
    | 'refunded'
    | 'partially_refunded';

// --- Entity Types ---

export interface SalesListItem {
    order_id: number;
    customer_name: string;
    seller: string;
    total_amount: number;
    paid_amount: number;
    remaining_balance: number;
    sale_date: string; // ISO 8601 Timestamp
    sale_type: SaleType;
    status: OrderStatus;
}

// --- Parameter Interfaces ---

export interface GetSalesListParams {
    p_search_term?: string;
    p_sale_type?: SaleType | null;   // Filter by type
    p_status?: OrderStatus | null;   // Filter by status
    p_start_date?: string | null;    // ISO String
    p_end_date?: string | null;      // ISO String
    p_limit?: number;
    p_offset?: number;
}