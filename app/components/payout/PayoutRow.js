'use client';
import { useState } from 'react';
import { Edit2, Check, X, Globe } from 'lucide-react';

export default function PayoutRow({ stat, darkMode, updateAuthorPayout, globalPayoutRate }) {
    const [isEditing, setIsEditing] = useState(false);
    const [editingRate, setEditingRate] = useState(stat.rate.toString());

    // Check if this author is using custom rate or global rate
    const isUsingGlobalRate = stat.rate === globalPayoutRate;

    const handleSave = () => {
        const newRate = parseFloat(editingRate);
        if (!isNaN(newRate) && newRate >= 0) {
            updateAuthorPayout(stat.author, newRate);
        }
        setIsEditing(false);
    };

    const handleCancel = () => {
        setEditingRate(stat.rate.toString());
        setIsEditing(false);
    };

    const resetToGlobal = () => {
        updateAuthorPayout(stat.author, undefined);
        setEditingRate(globalPayoutRate.toString());
    };

    return (
        <tr>
            <td className={`px-6 py-4 whitespace-nowrap text-sm ${darkMode ? 'text-gray-300' : 'text-gray-900'}`}>
                {stat.author}
            </td>
            <td className={`px-6 py-4 whitespace-nowrap text-sm ${darkMode ? 'text-gray-300' : 'text-gray-900'}`}>
                {stat.count}
            </td>
            <td className={`px-6 py-4 whitespace-nowrap text-sm ${darkMode ? 'text-gray-300' : 'text-gray-900'}`}>
                {isEditing ? (
                    <div className="flex items-center space-x-2">
                        <input
                            type="number"
                            className={`w-20 px-2 py-1 border rounded ${darkMode
                                    ? 'bg-gray-700 border-gray-600 text-gray-100'
                                    : 'bg-white border-gray-300 text-gray-900'
                                }`}
                            value={editingRate}
                            onChange={(e) => setEditingRate(e.target.value)}
                            min="0"
                            step="0.01"
                        />
                        <button
                            onClick={handleSave}
                            className="text-green-600 hover:text-green-700"
                            title="Save"
                        >
                            <Check className="h-4 w-4" />
                        </button>
                        <button
                            onClick={handleCancel}
                            className="text-red-600 hover:text-red-700"
                            title="Cancel"
                        >
                            <X className="h-4 w-4" />
                        </button>
                        {!isUsingGlobalRate && (
                            <button
                                onClick={resetToGlobal}
                                className="text-blue-600 hover:text-blue-700"
                                title="Reset to global rate"
                            >
                                <Globe className="h-4 w-4" />
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="flex items-center space-x-2">
                        <span>${stat.rate.toFixed(2)}</span>
                        {isUsingGlobalRate && (
                            <span className="text-xs text-gray-500 italic">(global)</span>
                        )}
                        <button
                            onClick={() => setIsEditing(true)}
                            className="text-indigo-600 hover:text-indigo-700"
                            title="Edit rate"
                        >
                            <Edit2 className="h-4 w-4" />
                        </button>
                    </div>
                )}
            </td>
            <td className={`px-6 py-4 whitespace-nowrap text-sm font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-900'}`}>
                ${stat.payout.toFixed(2)}
            </td>
        </tr>
    );
}