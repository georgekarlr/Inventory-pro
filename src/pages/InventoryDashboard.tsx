import React, { useEffect, useState, useCallback } from 'react';
import { useAuth } from "../contexts/AuthContext";

import {
    LayoutDashboard,
    Package,
    AlertTriangle,
    Coins,
    RefreshCw,
    AlertCircle
} from 'lucide-react';
import useCurrency from "../hooks/useCurrency.ts";
import {InventoryDashboardSummary} from "../types/inventoryDashboard.ts";
import {InventoryDashboardService} from "../services/inventoryDashboardService.ts";
import {formatCurrency} from "../utils/timezone.ts";

// --- Sub-Component: Stat Card ---
interface StatCardProps {
    title: string;
    value: string | number;
    icon: React.ReactNode;
    colorClass: string;
    subText?: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, colorClass, subText }) => (
    <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-start justify-between">
            <div>
                <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
                <h3 className="text-3xl font-bold text-gray-900">{value}</h3>
                {subText && <p className="text-xs text-gray-400 mt-2">{subText}</p>}
            </div>
            <div className={`p-3 rounded-lg ${colorClass}`}>
                {icon}
            </div>
        </div>
    </div>
);

// --- Main Dashboard Component ---

const InventoryDashboard: React.FC = () => {
    // 1. Contexts
    const { persona } = useAuth();
    const { currency } = useCurrency();
    // Used to gate the view, though the RPC handles data isolation via RLS
    const accountId = persona?.id ?? null;

    // 2. State
    const [stats, setStats] = useState<InventoryDashboardSummary | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // 3. Data Fetching
    const fetchStats = useCallback(async () => {
        setLoading(true);
        const { data, error } = await InventoryDashboardService.getDashboardSummary();

        if (error) {
            setError(error);
        } else {
            setStats(data);
            setError(null);
        }
        setLoading(false);
    }, []);

    useEffect(() => {
        if (accountId) {
            fetchStats();
        }
    }, [fetchStats, accountId]);

    // 4. Render
    return (
        <div className="w-full max-w-7xl mx-auto p-4 sm:p-6">

            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                        <LayoutDashboard className="mr-2" /> Inventory Overview
                    </h1>
                    <p className="text-gray-500 text-sm mt-1">
                        Real-time snapshot of your stock levels and asset value.
                    </p>
                </div>

                <button
                    onClick={fetchStats}
                    disabled={loading}
                    className="flex items-center px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition-colors shadow-sm disabled:opacity-50"
                >
                    <RefreshCw size={16} className={`mr-2 ${loading ? 'animate-spin' : ''}`} />
                    Refresh Data
                </button>
            </div>

            {/* Error State */}
            {error && (
                <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg flex items-center border border-red-200">
                    <AlertCircle size={20} className="mr-2" />
                    {error}
                </div>
            )}

            {/* Content */}
            {loading ? (
                <div className="flex justify-center py-20">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
                </div>
            ) : stats ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                    {/* 1. Total Inventory Value */}
                    <StatCard
                        title="Total Inventory Value"
                        value={formatCurrency(stats.total_inventory_value, currency)}
                        icon={<Coins size={24} className="text-emerald-600" />}
                        colorClass="bg-emerald-50"
                        subText="Total cost/value of stock on hand"
                    />

                    {/* 2. Total Product Count */}
                    <StatCard
                        title="Total Products"
                        value={stats.total_product_count}
                        icon={<Package size={24} className="text-blue-600" />}
                        colorClass="bg-blue-50"
                        subText="Distinct items in catalog"
                    />

                    {/* 3. Low Stock Alerts */}
                    <StatCard
                        title="Low Stock Alerts"
                        value={stats.low_stock_item_count}
                        icon={<AlertTriangle size={24} className="text-orange-600" />}
                        colorClass="bg-orange-50"
                        subText="Items below reorder point"
                    />
                </div>
            ) : null}
        </div>
    );
};

export default InventoryDashboard;