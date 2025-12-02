// components/overdue/OverdueDetails.tsx
import React from 'react';
import { OverduePayment } from '../../types/overdue';
import { User, Phone, MapPin, AlertTriangle } from 'lucide-react';

interface OverdueDetailsProps {
    payment: OverduePayment;
}

const OverdueDetails: React.FC<OverdueDetailsProps> = ({ payment }) => {

    // Formatting helpers
    const formatCurrency = (amount: number) =>
        new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);

    // Dynamic urgency styles
    const isSevere = payment.days_overdue > 30;

    return (
        <div className="space-y-6">
            {/* Urgency Header */}
            <div className={`p-4 rounded-lg border ${
                isSevere ? 'bg-red-50 border-red-200' : 'bg-orange-50 border-orange-200'
            }`}>
                <div className="flex items-start justify-between">
                    <div>
                        <div className="flex items-center space-x-2">
                            <AlertTriangle size={20} className={isSevere ? 'text-red-600' : 'text-orange-600'} />
                            <span className={`font-bold ${isSevere ? 'text-red-700' : 'text-orange-700'}`}>
                                {payment.days_overdue} Days Overdue
                            </span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">
                            Due Date: {new Date(payment.due_date).toLocaleDateString()}
                        </p>
                    </div>
                    <div className="text-right">
                        <div className="text-xs text-gray-500 uppercase font-bold">Amount Due</div>
                        <div className="text-2xl font-bold text-gray-900">{formatCurrency(payment.amount_due)}</div>
                    </div>
                </div>
            </div>

            {/* Customer Contact Card */}
            <div className="bg-white border border-gray-100 rounded-lg p-4 shadow-sm space-y-4">
                <h3 className="text-sm font-semibold text-gray-900 border-b border-gray-100 pb-2">Customer Information</h3>

                <div className="flex items-start">
                    <User className="text-gray-400 mt-1 mr-3" size={18} />
                    <div>
                        <div className="text-xs text-gray-500">Name</div>
                        <div className="font-medium text-gray-900">{payment.customer_name}</div>
                    </div>
                </div>

                <div className="flex items-start">
                    <Phone className="text-gray-400 mt-1 mr-3" size={18} />
                    <div className="flex-1">
                        <div className="text-xs text-gray-500">Phone</div>
                        {payment.customer_phone ? (
                            <div className="flex items-center justify-between">
                                <span className="font-medium text-gray-900">{payment.customer_phone}</span>
                                <a
                                    href={`tel:${payment.customer_phone}`}
                                    className="ml-2 bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-xs font-bold hover:bg-blue-100 transition-colors"
                                >
                                    Call Now
                                </a>
                            </div>
                        ) : (
                            <span className="text-gray-400 italic">No phone on record</span>
                        )}
                    </div>
                </div>

                <div className="flex items-start">
                    <MapPin className="text-gray-400 mt-1 mr-3" size={18} />
                    <div>
                        <div className="text-xs text-gray-500">Address</div>
                        <div className="text-sm text-gray-900">
                            {payment.customer_address || <span className="text-gray-400 italic">No address provided</span>}
                        </div>
                    </div>
                </div>
            </div>

            {/* Technical Details */}
            <div className="grid grid-cols-2 gap-4 text-xs text-gray-500">
                <div className="bg-gray-50 p-2 rounded border border-gray-200">
                    <span className="block font-semibold">Schedule ID</span> #{payment.schedule_id}
                </div>
                <div className="bg-gray-50 p-2 rounded border border-gray-200">
                    <span className="block font-semibold">Installment ID</span> #{payment.installment_id}
                </div>
            </div>

            {/* Action Button */}
            <div className="pt-2">
                <button
                    onClick={() => alert(`Initiate payment collection for Schedule #${payment.schedule_id}`)}
                    className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 shadow-sm transition-all"
                >
                    Process Collection
                </button>
            </div>
        </div>
    );
};

export default OverdueDetails;