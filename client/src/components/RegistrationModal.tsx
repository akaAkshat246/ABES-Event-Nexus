import React from 'react';
import { X } from 'lucide-react';
import { IEvent, RegistrationConfirmation } from '../types';
import { RegistrationForm } from './RegistrationForm';

interface RegistrationModalProps {
  event: IEvent | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (confirmation: RegistrationConfirmation) => void;
}

export const RegistrationModal: React.FC<RegistrationModalProps> = ({
  event,
  isOpen,
  onClose,
  onSuccess,
}) => {
  if (!isOpen || !event) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white dark:bg-[#16212C] rounded-3xl shadow-2xl overflow-hidden border border-slate-200 dark:border-[#223040] animate-in zoom-in-95 duration-300">
        {/* Modal Header */}
        <div className="p-5 bg-gradient-to-r from-secondary-900 to-primary-950 dark:from-[#16212C] dark:to-[#16212C] text-white flex items-center justify-between border-b border-white/10">
          <div>
            <h3 className="font-display font-bold text-lg text-white">Event Registration</h3>
            <p className="text-xs text-slate-300">Fill in your details to secure your entry pass</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          <RegistrationForm
            event={event}
            onCancel={onClose}
            onSuccess={(conf) => {
              onClose();
              onSuccess(conf);
            }}
          />
        </div>
      </div>
    </div>
  );
};

