// services/orderDetailsService.ts
import { supabase } from '../lib/supabase';
import type {
    OrderDetails,
    CreatePaymentParams,
    CreatePaymentResult,
    ServiceResponse
} from '../types/orderDetails';

export class OrderDetailsService {

    /**
     * Fetches full details for a specific order, including items, payments, and installment schedules.
     */
    static async getOrderDetails(orderId: number): Promise<ServiceResponse<OrderDetails>> {
        try {
            const { data, error } = await supabase.rpc('ins_get_order_details', {
                p_order_id: orderId
            });

            if (error) {
                return { data: null, error: error.message };
            }

            if (!data) {
                return { data: null, error: 'Order not found.' };
            }

            return { data: data as OrderDetails, error: null };

        } catch (err: any) {
            return {
                data: null,
                error: err.message || 'An unexpected error occurred while fetching order details.'
            };
        }
    }

    /**
     * Creates a payment for an existing order.
     * If it's an installment order, it applies the waterfall logic to pay off schedule items.
     */
    static async createPayment(params: CreatePaymentParams): Promise<ServiceResponse<CreatePaymentResult>> {
        try {
            const { data, error } = await supabase.rpc('ins_create_payment', {
                p_account_id: params.p_account_id,
                p_order_id: params.p_order_id,
                p_amount_paid: params.p_amount_paid,
                p_payment_method: params.p_payment_method,
                p_tendered_amount: params.p_tendered_amount ?? 0,
                p_created_at: params.p_created_at ?? new Date().toISOString()
            });

            console.log('data: ', data);
            console.log('error: ', error);
            if (error) {
                return { data: null, error: error.message };
            }

            // Function returns a TABLE, so check array length
            if (!data || data.length === 0) {
                return { data: null, error: 'Payment failed. No confirmation received.' };
            }

            return { data: data[0] as CreatePaymentResult, error: null };

        } catch (err: any) {
            return {
                data: null,
                error: err.message || 'An unexpected error occurred while processing the payment.'
            };
        }
    }
}