import React, { useState, useEffect } from 'react';
import { X, UserCheck, Loader2, Users } from 'lucide-react';
import { getAllOfficerNames } from '../lib/firData';

interface TransferCaseModalProps {
  isOpen: boolean;
  caseId: string;
  caseType: string;
  currentOfficer: string;
  onConfirm: (newOfficer: string, reason: string) => Promise<void>;
  onCancel: () => void;
}

const TransferCaseModal: React.FC<TransferCaseModalProps> = ({
  isOpen,
  caseId,
  caseType,
  currentOfficer,
  onConfirm,
  onCancel
}) => {
  const [selectedOfficer, setSelectedOfficer] = useState('');
  const [reason, setReason] = useState('');
  const [isTransferring, setIsTransferring] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [availableOfficers, setAvailableOfficers] = useState<string[]>([]);
  const [loadingOfficers, setLoadingOfficers] = useState(true);
  const [noOfficersAvailable, setNoOfficersAvailable] = useState(false);

  // Load officers from database when modal opens
  useEffect(() => {
    const loadOfficers = async () => {
      try {
        setLoadingOfficers(true);
        console.log('🔄 Loading available officers from database...');
        const allOfficers = await getAllOfficerNames();
        console.log('👥 All officers from database:', allOfficers);
        
        // Filter out current officer (case-insensitive)
        const available = allOfficers.filter(officer => 
          officer.toLowerCase() !== currentOfficer.toLowerCase()
        );
        
        console.log('👮 Available officers for transfer:', available);
        setAvailableOfficers(available);
        
        if (available.length === 0) {
          setNoOfficersAvailable(true);
          console.log('⚠️ No other officers available for transfer');
        } else {
          setNoOfficersAvailable(false);
        }
      } catch (error) {
        console.error('❌ Error loading officers:', error);
        setAvailableOfficers([]);
        setNoOfficersAvailable(true);
      } finally {
        setLoadingOfficers(false);
      }
    };

    if (isOpen) {
      loadOfficers();
    }
  }, [isOpen, currentOfficer]);

  const handleConfirm = async () => {
    if (!selectedOfficer) {
      setError('Please select an officer to transfer the case to');
      return;
    }

    if (!reason.trim()) {
      setError('Please provide a reason for the transfer');
      return;
    }

    if (reason.trim().length < 10) {
      setError('Transfer reason must be at least 10 characters long');
      return;
    }

    try {
      setIsTransferring(true);
      setError(null);
      await onConfirm(selectedOfficer, reason.trim());
      // Reset form on success
      setSelectedOfficer('');
      setReason('');
      setError(null);
    } catch (err) {
      setError('Failed to transfer case. Please try again.');
      console.error('Transfer error:', err);
    } finally {
      setIsTransferring(false);
    }
  };

  const handleCancel = () => {
    setSelectedOfficer('');
    setReason('');
    setError(null);
    onCancel();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-full">
              <UserCheck className="w-6 h-6 text-blue-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">Transfer Case</h2>
          </div>
          <button
            onClick={handleCancel}
            disabled={isTransferring}
            className="text-gray-400 hover:text-gray-600 disabled:opacity-50"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Case Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-start space-x-3">
              <Users className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="text-sm font-medium text-blue-800">
                  Case Transfer Details
                </h3>
                <p className="text-sm text-blue-700 mt-1">
                  You are about to transfer this case to another officer.
                </p>
              </div>
            </div>
          </div>

          {/* Case Details */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h4 className="text-sm font-medium text-gray-900 mb-3">Case Information:</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Case ID:</span>
                <span className="font-medium text-gray-900">{caseId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Type:</span>
                <span className="font-medium text-gray-900">{caseType}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Current Officer:</span>
                <span className="font-medium text-gray-900">{currentOfficer}</span>
              </div>
            </div>
          </div>

          {/* Officer Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Transfer to Officer <span className="text-red-500">*</span>
            </label>
            {noOfficersAvailable && !loadingOfficers && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
                <p className="text-sm text-yellow-700">
                  No other officers found in the database. Please ensure other officers have cases assigned to them first.
                </p>
              </div>
            )}
            <select
              value={selectedOfficer}
              onChange={(e) => {
                setSelectedOfficer(e.target.value);
                if (error) setError(null);
              }}
              disabled={isTransferring || loadingOfficers || noOfficersAvailable}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
            >
              <option value="">
                {loadingOfficers ? 'Loading officers...' : 
                 noOfficersAvailable ? 'No officers available' : 
                 'Select an officer...'}
              </option>
              {availableOfficers.map((officer) => (
                <option key={officer} value={officer}>
                  {officer}
                </option>
              ))}
            </select>
            {loadingOfficers && (
              <p className="text-xs text-blue-600 mt-1 flex items-center">
                <Loader2 className="w-3 h-3 animate-spin mr-1" />
                Loading officers from database...
              </p>
            )}
            {!loadingOfficers && noOfficersAvailable && (
              <p className="text-xs text-amber-600 mt-1">
                No other officers available for transfer.
              </p>
            )}
          </div>

          {/* Reason Input */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Reason for Transfer <span className="text-red-500">*</span>
            </label>
            <textarea
              value={reason}
              onChange={(e) => {
                setReason(e.target.value);
                if (error) setError(null);
              }}
              disabled={isTransferring}
              placeholder="Please provide a detailed reason for transferring this case (minimum 10 characters)..."
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none disabled:bg-gray-100 disabled:cursor-not-allowed"
            />
            <p className="text-xs text-gray-500 mt-1">
              This reason will be logged for audit purposes.
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-6">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {/* Actions */}
          <div className="flex space-x-3">
            <button
              onClick={handleCancel}
              disabled={isTransferring}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              disabled={isTransferring || loadingOfficers || !selectedOfficer || !reason.trim()}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {isTransferring ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Transferring...</span>
                </>
              ) : (
                <>
                  <UserCheck className="w-4 h-4" />
                  <span>Transfer Case</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransferCaseModal;