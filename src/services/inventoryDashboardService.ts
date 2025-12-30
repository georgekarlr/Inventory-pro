// services/inventoryDashboardService.ts
import { supabase } from '../lib/supabase';
import type {
    InventoryDashboardSummary,
    ServiceResponse
} from '../types/inventoryDashboard';

export class InventoryDashboardService {

    /**
     * Fetches high-level inventory statistics: Total Value, Product Count, and Low Stock Alerts.
     */
    static async getDashboardSummary(): Promise<ServiceResponse<InventoryDashboardSummary>> {
        try {
            const { data, error } = await supabase.rpc('inv_get_dashboard_summary');

            if (error) {
                return { data: null, error: error.message };
            }

            // The function returns a TABLE, so data is an array.
            // Based on the SQL logic, it always returns exactly one row.
            if (!data || data.length === 0) {
                return { data: null, error: 'No dashboard data available.' };
            }

            return { data: data[0] as InventoryDashboardSummary, error: null };

        } catch (err: any) {
            return {
                data: null,
                error: err.message || 'An unexpected error occurred while fetching inventory dashboard stats.'
            };
        }
    }
}