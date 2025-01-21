'use client'

import { Package } from '@/app/types/package';

interface ModalProps {
    onClose: () => void;
    package: Package | null;
}

const Modal = ({ onClose, package: pkg }: ModalProps) => {
    if (!pkg) return null;

    const detailsList = pkg.details.split('\n');
    const excludedItems: any[] = []; // Define excludedItems if needed

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-3xl font-semibold text-gray-800">{pkg.title}</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 transition duration-200 rounded-full"
                    >
                        ✕
                    </button>
                </div>
                <div className="mb-4">
                    <p className="text-lg font-bold text-green-600">{pkg.price}</p>
                </div>
                <div className="text-gray-700 mb-4">
                    <div className="flex flex-col md:flex-row">
                        <img src={pkg.imageUrl} alt={pkg.title} className="w-full md:w-1/3 rounded-lg object-cover mb-4 md:mb-0" />
                        <div className="md:ml-4">
                            <h3 className="text-xl font-semibold text-gray-800">{pkg.title}</h3>
                            <p className="text-gray-600 mb-2">{pkg.description}</p>
                            <h4 className="font-semibold text-gray-700">Included Items:</h4>
                            <ul className="list-disc list-inside text-gray-600">
                                {detailsList.map((detail, index) => (
                                    <li key={index}>{detail.trim()}</li>
                                ))}
                            </ul>
                            <h4 className="font-semibold text-gray-700">Excluded Items:</h4>
                            <ul className="list-disc list-inside text-gray-600">
                                {excludedItems.length > 0 ? (
                                    excludedItems.map((item, index) => <li key={index}>{item}</li>)
                                ) : (
                                    <li>No items available</li>
                                )}
                            </ul>
                        </div>
                    </div>
                </div>
                <div className="flex justify-end">
                    <button
                        onClick={onClose}
                        className="bg-blue-500 text-white rounded px-4 py-2 hover:bg-blue-600 transition duration-200"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Modal;