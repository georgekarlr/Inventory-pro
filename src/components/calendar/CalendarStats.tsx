// components/calendar/CalendarStats.tsx
import React from 'react';
import { CalendarItem } from '../../types/calendar';
import { TrendingUp, AlertCircle, Clock } from 'lucide-react';

interface CalendarStatsProps {
    items: CalendarItem[];
}

const CalendarStats: React.FC<CalendarStatsProps> = ({ items }) => {
    // Calculate stats
    const totalAmount = items.reduce((sum, item) => sum + item.amount_due, 0);
    const overdueCount = items.filter(item => item.days_remaining < 0).length;
    const dueTodayCount = items.filter(item => item.days_remaining === 0).length;

    const formatCurrency = (amount: number) =>
        new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);

    return (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center">
                <div className="p-3 bg-blue-50 text-blue-600 rounded-full mr-4">
                    <TrendingUp size={24} />
                </div>
                <div>
                    <p className="text-sm text-gray-500 font-medium">Total Collectible</p>
                    <p className="text-xl font-bold text-gray-900">{formatCurrency(totalAmount)}</p>
                </div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center">
                <div className={`p-3 rounded-full mr-4 ${overdueCount > 0 ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
                    <AlertCircle size={24} />
                </div>
                <div>
                    <p className="text-sm text-gray-500 font-medium">Overdue Payments</p>
                    <p className={`text-xl font-bold ${overdueCount > 0 ? 'text-red-600' : 'text-gray-900'}`}>
                        {overdueCount} <span className="text-sm font-normal text-gray-400">items</span>
                    </p>
                </div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center">
                <div className="p-3 bg-amber-50 text-amber-600 rounded-full mr-4">
                    <Clock size={24} />
                </div>
                <div>
                    <p className="text-sm text-gray-500 font-medium">Due Today</p>
                    <p className="text-xl font-bold text-gray-900">
                        {dueTodayCount} <span className="text-sm font-normal text-gray-400">items</span>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default CalendarStats;