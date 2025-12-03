// types/orderDetails.ts

// --- Generic Response Wrapper ---
export interface ServiceResponse<T> {
    data: T | null;
    error: string | null;
}

// --- Enum Types ---
export type OrderStatus = 'completed' | 'ongoing' | 'defaulted' | 'refunded' | 'partially_refunded';
export type SaleType = 'full_payment' | 'installment_with_down' | 'pure_installment';
export type ScheduleStatus = 'pending' | 'paid' | 'overdue' | 'partial' | 'cancelled';

// --- Nested Objects for Order Details ---

export interface OrderHeaderInfo {
    id: number;
    date: string;
    status: OrderStatus;
    sale_type: SaleType;
    notes: string | null;
}

export interface CustomerSummary {
    id: number | null;
    name: string;
    phone: string | null;
    address: string | null;
    credit_limit: number | null;
}

export interface FinancialSummary {
    total_amount: number;
    total_paid: number;
    remaining_balance: number;
}

export interface OrderItemDetail {
    product_name: string;
    sku: string | null;
    quantity: number;
    unit_price: number;
    line_total: number;
}

export interface PaymentHistoryItem {
    id: number;
    date: string;
    method: string;
    amount: number;
    tendered: number;
    change: number;
}

export interface InstallmentScheduleItem {
    due_date: string;
    amount_due: number;
    amount_paid: number;
    status: ScheduleStatus;
}

export interface InstallmentDetails {
    plan_name: string | null;
    total_financed: number;
    start_date: string;
    schedule: InstallmentScheduleItem[];
}

// --- Main Return Type for ins_get_order_details ---
export interface OrderDetails {
    order_info: OrderHeaderInfo;
    customer: CustomerSummary;
    financials: FinancialSummary;
    items: OrderItemDetail[];
    payments: PaymentHistoryItem[];
    installment_details: InstallmentDetails | null;
}

// --- Parameters & Return for Payment Creation ---

export interface CreatePaymentParams {
    p_account_id: number;
    p_order_id: number;
    p_amount_paid: number;
    p_payment_method: string;
    p_tendered_amount?: number;
    p_created_at?: string; // ISO String
}

export interface CreatePaymentResult {
    payment_id: number;
    new_remaining_balance: number;
    order_status: OrderStatus;
}