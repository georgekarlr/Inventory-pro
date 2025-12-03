// components/loans/ActiveLoansManager.tsx
import React, { useEffect, useState, useCallback } from 'react';

import {
    Search,
    AlertCircle,
    Calendar,
    ChevronRight,
    Users
} from 'lucide-react';
import {ActiveLoan} from "../types/loans.tsx";
import {LoansService} from "../services/loansService.ts";
import Modal from "../components/ui/Modal.tsx";
import LoanDetails from "../components/loans/LoanDetails.tsx";

const ActiveLoansManager: React.FC = () => {

    // 2. State
    const [loans, setLoans] = useState<ActiveLoan[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    // Modal State
    const [selectedLoan, setSelectedLoan] = useState<ActiveLoan | null>(null);

    // 3. Fetch Data
    const fetchLoans = useCallback(async () => {
        setLoading(true);
        const { data, error } = await LoansService.getActiveLoans({
            p_search_term: searchTerm,
            p_limit: 50 // Adjustable limit
        });

        if (error) {
            setError("Failed to load active loans.");
        } else {
            setLoans(data || []);
            setError(null);
        }
        setLoading(false);
    }, [searchTerm]);

    useEffect(() => {
        fetchLoans();
    }, [fetchLoans]);

    // Helper: Currency Formatter
    const formatCurrency = (amount: number) =>
        new Intl.NumberFormat('en-US', { style: 'currency', currency: 'PHP' }).format(amount);

    return (
        <div className="w-full max-w-7xl mx-auto p-4 sm:p-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Active Installments</h1>
                    <p className="text-gray-500 text-sm mt-1">Monitor ongoing loans, overdue payments, and customer balances.</p>
                </div>
            </div>

            {/* Search Bar */}
            <div className="relative mb-6">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                    type="text"
                    placeholder="Search by customer name or phone..."
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-shadow shadow-sm"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
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
                <div className="flex justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
            ) : (
                <>
                    {/* Desktop Table View */}
                    <div className="hidden md:block bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Balance / Total</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Next Due</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                            </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                            {loans.map((loan) => (
                                <tr
                                    key={loan.installment_id}
                                    onClick={() => setSelectedLoan(loan)}
                                    className="hover:bg-blue-50 cursor-pointer transition-colors"
                                >
                                    <td className="px-6 py-4">
                                        <div className="flex items-center">
                                            <div className="bg-gray-100 p-2 rounded-full mr-3 text-gray-600">
                                                <Users size={16} />
                                            </div>
                                            <div>
                                                <div className="font-medium text-gray-900">{loan.customer_name}</div>
                                                <div className="text-sm text-gray-500">{loan.plan_name}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="font-semibold text-gray-900">{formatCurrency(loan.remaining_balance)}</div>
                                        <div className="text-xs text-gray-400">of {formatCurrency(loan.total_financed)}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center text-sm text-gray-700">
                                            <Calendar size={14} className="mr-1.5 text-gray-400" />
                                            {loan.next_due_date ? new Date(loan.next_due_date).toLocaleDateString() : 'N/A'}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${
                                                loan.status === 'overdue'
                                                    ? 'bg-red-100 text-red-800'
                                                    : 'bg-green-100 text-green-800'
                                            }`}>
                                                {loan.status}
                                            </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button className="text-gray-400 hover:text-blue-600">
                                            <ChevronRight size={20} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {loans.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                                        No active loans found matching your search.
                                    </td>
                                </tr>
                            )}
                            </tbody>
                        </table>
                    </div>

                    {/* Mobile Card View */}
                    <div className="md:hidden space-y-4">
                        {loans.map((loan) => (
                            <div
                                key={loan.installment_id}
                                onClick={() => setSelectedLoan(loan)}
                                className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 active:bg-gray-50 transition-colors"
                            >
                                <div className="flex justify-between items-start mb-3">
                                    <div>
                                        <h3 className="font-semibold text-gray-900">{loan.customer_name}</h3>
                                        <p className="text-xs text-gray-500">{loan.plan_name}</p>
                                    </div>
                                    <span className={`px-2 py-1 text-xs font-bold rounded-full uppercase ${
                                        loan.status === 'overdue' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                                    }`}>
                                        {loan.status}
                                    </span>
                                </div>

                                <div className="grid grid-cols-2 gap-4 py-3 border-t border-gray-100">
                                    <div>
                                        <p className="text-xs text-gray-500">Balance</p>
                                        <p className="font-bold text-gray-900">{formatCurrency(loan.remaining_balance)}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs text-gray-500">Next Due</p>
                                        <p className={`font-medium ${loan.status === 'overdue' ? 'text-red-600' : 'text-gray-900'}`}>
                                            {loan.next_due_date ? new Date(loan.next_due_date).toLocaleDateString() : 'N/A'}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex justify-end pt-2">
                                    <div className="text-sm text-blue-600 font-medium flex items-center">
                                        View Details <ChevronRight size={16} />
                                    </div>
                                </div>
                            </div>
                        ))}
                        {loans.length === 0 && (
                            <div className="text-center py-10 text-gray-500">
                                No active loans found.
                            </div>
                        )}
                    </div>
                </>
            )}

            {/* Details Modal */}
            <Modal
                isOpen={!!selectedLoan}
                onClose={() => setSelectedLoan(null)}
                title="Loan Details"
            >
                {selectedLoan && (
                    <LoanDetails loan={selectedLoan} />
                )}
            </Modal>
        </div>
    );
};

export default ActiveLoansManager;