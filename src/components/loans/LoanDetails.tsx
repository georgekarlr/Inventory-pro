// components/loans/LoanDetails.tsx
import React from 'react';
import { ActiveLoan } from '../../types/loans';
import { User, Calendar, CreditCard, Phone, AlertCircle, CheckCircle2 } from 'lucide-react';

interface LoanDetailsProps {
    loan: ActiveLoan;
}

const LoanDetails: React.FC<LoanDetailsProps> = ({ loan }) => {
    // Calculate progress
    const paidAmount = loan.total_financed - loan.remaining_balance;
    const progressPercentage = Math.min(100, Math.max(0, (paidAmount / loan.total_financed) * 100));

    // Format currency
    const formatCurrency = (amount: number) =>
        new Intl.NumberFormat('en-US', { style: 'currency', currency: 'PHP' }).format(amount);

    return (
        <div className="space-y-6">
            {/* Header / Status */}
            <div className="flex items-center justify-between bg-gray-50 p-4 rounded-lg">
                <div>
                    <span className="text-xs text-gray-500 uppercase font-semibold tracking-wider">Status</span>
                    <div className={`flex items-center mt-1 font-bold ${
                        loan.status === 'overdue' ? 'text-red-600' : 'text-green-600'
                    }`}>
                        {loan.status === 'overdue' ? <AlertCircle size={18} className="mr-1"/> : <CheckCircle2 size={18} className="mr-1"/>}
                        {loan.status.toUpperCase()}
                    </div>
                </div>
                <div className="text-right">
                    <span className="text-xs text-gray-500 uppercase font-semibold tracking-wider">Plan</span>
                    <div className="font-medium text-gray-900">{loan.plan_name}</div>
                </div>
            </div>

            {/* Financials & Progress */}
            <div className="border border-gray-100 rounded-lg p-4 shadow-sm">
                <div className="flex justify-between items-end mb-2">
                    <div>
                        <div className="text-sm text-gray-500">Remaining Balance</div>
                        <div className="text-2xl font-bold text-gray-900">{formatCurrency(loan.remaining_balance)}</div>
                    </div>
                    <div className="text-right">
                        <div className="text-xs text-gray-500">Total Financed</div>
                        <div className="font-medium text-gray-700">{formatCurrency(loan.total_financed)}</div>
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-gray-200 rounded-full h-2.5 mb-1">
                    <div
                        className={`h-2.5 rounded-full ${loan.status === 'overdue' ? 'bg-red-500' : 'bg-blue-600'}`}
                        style={{ width: `${progressPercentage}%` }}
                    ></div>
                </div>
                <div className="text-xs text-right text-gray-500">{progressPercentage.toFixed(1)}% Paid</div>
            </div>

            {/* Customer & Date Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                    <div className="flex items-start">
                        <User className="text-gray-400 mt-1 mr-3" size={18} />
                        <div>
                            <div className="text-xs text-gray-500">Customer</div>
                            <div className="font-medium text-gray-900">{loan.customer_name}</div>
                        </div>
                    </div>
                    <div className="flex items-start">
                        <Phone className="text-gray-400 mt-1 mr-3" size={18} />
                        <div>
                            <div className="text-xs text-gray-500">Phone</div>
                            <div className="font-medium text-gray-900">{loan.phone || 'N/A'}</div>
                        </div>
                    </div>
                </div>

                <div className="space-y-3">
                    <div className="flex items-start">
                        <Calendar className="text-gray-400 mt-1 mr-3" size={18} />
                        <div>
                            <div className="text-xs text-gray-500">Start Date</div>
                            <div className="font-medium text-gray-900">{new Date(loan.start_date).toLocaleDateString()}</div>
                        </div>
                    </div>
                    <div className="flex items-start">
                        <CreditCard className="text-gray-400 mt-1 mr-3" size={18} />
                        <div>
                            <div className="text-xs text-gray-500">Next Due Date</div>
                            <div className={`font-medium ${loan.status === 'overdue' ? 'text-red-600' : 'text-gray-900'}`}>
                                {loan.next_due_date ? new Date(loan.next_due_date).toLocaleDateString() : 'No pending schedule'}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="text-xs text-gray-400 pt-4 border-t border-gray-100 text-center">
                Order ID: #{loan.order_id} | Installment ID: #{loan.installment_id}
            </div>
        </div>
    );
};

export default LoanDetails;