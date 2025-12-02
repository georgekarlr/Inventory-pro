// services/loansService.ts
import { supabase } from '../lib/supabase';
import type {
    ActiveLoan,
    GetActiveLoansParams,
    ServiceResponse
} from '../types/loans';

export class LoansService {

    /**
     * Fetches active loans (installments with remaining balance).
     * Includes calculated fields for next due date and overdue status.
     */
    static async getActiveLoans(params: GetActiveLoansParams = {}): Promise<ServiceResponse<ActiveLoan[]>> {
        try {
            const { data, error } = await supabase.rpc('ins_get_active_loans', {
                p_search_term: params.p_search_term ?? '',
                p_limit: params.p_limit ?? 20,
                p_offset: params.p_offset ?? 0
            });

            if (error) {
                return { data: null, error: error.message };
            }

            return { data: data as ActiveLoan[], error: null };

        } catch (err: any) {
            return {
                data: null,
                error: err.message || 'An unexpected error occurred while fetching active loans.'
            };
        }
    }
}