// types/inventoryDashboard.ts

// --- Generic Response Wrapper ---
export interface ServiceResponse<T> {
    data: T | null;
    error: string | null;
}

// --- Entity Types ---

export interface InventoryDashboardSummary {
    total_inventory_value: number;
    total_product_count: number;
    low_stock_item_count: number;
}