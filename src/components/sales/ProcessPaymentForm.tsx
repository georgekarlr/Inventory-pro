import React, { useState } from 'react';
import { OrderDetailsService } from '../../services/orderDetailsService';
import {
    Wallet,
    CreditCard,
    Banknote,
    Loader2,
    AlertCircle,
    ArrowRight
} from 'lucide-react';
import {useAuth} from "../../contexts/AuthContext.tsx";


interface ProcessPaymentFormProps {
    orderId: number;
    remainingBalance: number;
    onSuccess: () => void;
    onCancel: () => void;
}

const ProcessPaymentForm: React.FC<ProcessPaymentFormProps> = ({
                                                                   orderId,
                                                                   remainingBalance,
                                                                   onSuccess,
                                                                   onCancel
                                                               }) => {
    const { persona } = useAuth();
    // --- State ---
    const [amount, setAmount] = useState<string>('');
    const [method, setMethod] = useState<string>('cash');
    const [tendered, setTendered] = useState<string>(''); // For change calculation
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // --- Helpers ---
    const formatCurrency = (val: number) =>
        new Intl.NumberFormat('en-US', { style: 'currency', currency: 'PHP' }).format(val);

    const amountNum = parseFloat(amount) || 0;
    const tenderedNum = parseFloat(tendered) || 0;
    const change = Math.max(0, tenderedNum - amountNum);

    // --- Handlers ---
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        // Validation
        if (amountNum <= 0) {
            setError("Payment amount must be greater than zero.");
            return;
        }
        if (amountNum > remainingBalance) {
            setError(`Amount cannot exceed the remaining balance of ${formatCurrency(remainingBalance)}.`);
            return;
        }
        if (method === 'cash' && tenderedNum < amountNum && tenderedNum > 0) {
            setError("Tendered amount is less than the payment amount.");
            return;
        }

        setIsSubmitting(true);

        // API Call
        const { error: apiError } = await OrderDetailsService.createPayment({
            p_account_id: persona?.id ?? 1, // TODO: Replace with actual User ID from your Auth Context
            p_order_id: orderId,
            p_amount_paid: amountNum,
            p_payment_method: method,
            p_tendered_amount: method === 'cash' ? tenderedNum : amountNum
        });

        if (apiError) {
            setError(apiError);
            setIsSubmitting(false);
        } else {
            setIsSubmitting(false);
            onSuccess(); // Trigger parent refresh
        }
    };

    const setFullPayment = () => {
        setAmount(remainingBalance.toString());
        setError(null);
    };

    return (
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">

            {/* Header */}
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                <h3 className="font-bold text-gray-800 flex items-center">
                    <Wallet className="mr-2 text-blue-600" size={20} />
                    Process Payment
                </h3>
                <div className="text-right">
                    <p className="text-xs text-gray-500 uppercase">Balance Due</p>
                    <p className="text-sm font-bold text-gray-900">{formatCurrency(remainingBalance)}</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5">

                {/* 1. Payment Method Selection */}
                <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">
                        Payment Method
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                        <button
                            type="button"
                            onClick={() => setMethod('cash')}
                            className={`flex items-center justify-center p-3 rounded-lg border text-sm font-medium transition-all ${
                                method === 'cash'
                                    ? 'bg-blue-50 border-blue-500 text-blue-700'
                                    : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'
                            }`}
                        >
                            <Banknote size={18} className="mr-2" /> Cash
                        </button>
                        <button
                            type="button"
                            onClick={() => setMethod('bank_transfer')}
                            className={`flex items-center justify-center p-3 rounded-lg border text-sm font-medium transition-all ${
                                method === 'bank_transfer'
                                    ? 'bg-blue-50 border-blue-500 text-blue-700'
                                    : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'
                            }`}
                        >
                            <CreditCard size={18} className="mr-2" /> Transfer/Card
                        </button>
                    </div>
                </div>

                {/* 2. Amount Input */}
                <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">
                        Amount to Pay
                    </label>
                    <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-lg">$</span>
                        <input
                            type="number"
                            step="0.01"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            className="w-full pl-8 pr-4 py-3 border border-gray-200 rounded-xl text-2xl font-bold text-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                            placeholder="0.00"
                            autoFocus
                        />
                        <button
                            type="button"
                            onClick={setFullPayment}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-xs bg-blue-100 text-blue-700 hover:bg-blue-200 px-2 py-1 rounded font-medium transition-colors"
                        >
                            Full Balance
                        </button>
                    </div>
                </div>

                {/* 3. Cash Tendered (Optional - Only if Cash) */}
                {method === 'cash' && (
                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 animate-in fade-in slide-in-from-top-2">
                        <div className="flex gap-4">
                            <div className="flex-1">
                                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">
                                    Cash Tendered
                                </label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-bold">$</span>
                                    <input
                                        type="number"
                                        step="0.01"
                                        value={tendered}
                                        onChange={(e) => setTendered(e.target.value)}
                                        className="w-full pl-6 pr-3 py-2 border border-gray-200 rounded-lg text-sm font-medium focus:ring-2 focus:ring-blue-500 outline-none"
                                        placeholder="0.00"
                                    />
                                </div>
                            </div>
                            <div className="flex-1 text-right">
                                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">
                                    Change Due
                                </label>
                                <div className={`text-xl font-bold ${change > 0 ? 'text-green-600' : 'text-gray-400'}`}>
                                    {formatCurrency(change)}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Error Message */}
                {error && (
                    <div className="flex items-start p-3 bg-red-50 text-red-700 rounded-lg text-sm border border-red-100">
                        <AlertCircle size={18} className="mr-2 mt-0.5 shrink-0" />
                        <span>{error}</span>
                    </div>
                )}

                {/* Action Buttons */}
                <div className="pt-2 flex gap-3">
                    <button
                        type="button"
                        onClick={onCancel}
                        disabled={isSubmitting}
                        className="flex-1 py-3 px-4 bg-white border border-gray-200 text-gray-700 font-medium rounded-xl hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-200 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={isSubmitting || amountNum <= 0}
                        className={`flex-1 py-3 px-4 rounded-xl font-bold text-white shadow-md flex justify-center items-center transition-all ${
                            isSubmitting || amountNum <= 0
                                ? 'bg-gray-300 cursor-not-allowed'
                                : 'bg-green-600 hover:bg-green-700 hover:shadow-lg transform active:scale-95'
                        }`}
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 size={20} className="animate-spin mr-2" />
                                Processing...
                            </>
                        ) : (
                            <>
                                Confirm Payment <ArrowRight size={18} className="ml-2" />
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ProcessPaymentForm;