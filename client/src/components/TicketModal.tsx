import React, { useRef } from 'react';
import { CheckCircle2, Printer, X, Calendar, MapPin, Tag, User, Sparkles } from 'lucide-react';
import { RegistrationConfirmation } from '../types';

interface TicketModalProps {
  confirmation: RegistrationConfirmation | null;
  onClose: () => void;
}

export const TicketModal: React.FC<TicketModalProps> = ({ confirmation, onClose }) => {
  const ticketRef = useRef<HTMLDivElement>(null);

  if (!confirmation) return null;

  const handlePrint = () => {
    window.print();
  };

  const formattedDate = new Date(confirmation.eventDate).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-paper dark:bg-[#16212C] rounded-[4px] shadow-2xl overflow-hidden border border-line dark:border-[#223040] animate-in zoom-in-95 duration-300">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-navy/60 hover:bg-navy text-white transition-colors"
          aria-label="Close ticket"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Top Green Success Banner (HackIndia style) */}
        <div className="bg-[#0b6623] p-5 text-white text-center space-y-1">
          <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/20 backdrop-blur-md mb-1">
            <CheckCircle2 className="w-6 h-6 text-white" />
          </div>
          <h3 className="font-display font-bold text-lg text-white">Registration Confirmed!</h3>
          <p className="text-xs text-emerald-100 font-mono">
            Official E-Pass generated · ABES Autonomous
          </p>
        </div>

        {/* Ticket Body */}
        <div ref={ticketRef} className="p-6 space-y-5 bg-cream/40 dark:bg-[#16212C]/80 print:p-8">
          <div className="rounded-[4px] bg-white dark:bg-[#16212C] border-2 border-dashed border-line dark:border-[#2b3b4f] overflow-hidden shadow-sm relative">
            {/* Notch cutouts */}
            <div className="absolute top-1/2 -left-3 w-6 h-6 rounded-full bg-cream dark:bg-[#16212C] border-r border-line dark:border-[#2b3b4f] transform -translate-y-1/2" />
            <div className="absolute top-1/2 -right-3 w-6 h-6 rounded-full bg-cream dark:bg-[#16212C] border-l border-line dark:border-[#2b3b4f] transform -translate-y-1/2" />

            {/* Ticket Header with Official ABES Event Nexus Logo */}
            <div className="p-4 bg-navy text-white flex items-center justify-between border-b border-navy-800">
              <div className="flex items-center gap-2.5">
                <img
                  src="/assets/abes-logo.png"
                  alt="ABES Event Nexus"
                  className="h-10 w-auto object-contain"
                />
                <div className="flex flex-col">
                  <span className="font-display font-bold text-xs text-white leading-tight">
                    ABES <span className="text-saffron">Nexus</span>
                  </span>
                  <span className="font-mono text-[8.5px] text-[#a99f92] uppercase">
                    E-Pass Pass
                  </span>
                </div>
              </div>
              <div className="text-right">
                <span className="font-mono text-[9px] text-[#a99f92] block uppercase tracking-wider">Pass ID</span>
                <span className="font-mono font-bold text-xs text-saffron bg-black/40 px-2 py-0.5 rounded-[2px] border border-saffron/40">
                  {confirmation.ticketId}
                </span>
              </div>
            </div>

            {/* Ticket Details */}
            <div className="p-5 space-y-4">
              <div>
                <span className="font-mono text-[10px] font-bold text-saffron uppercase tracking-wider block mb-0.5">
                  Event / Hackathon
                </span>
                <h4 className="font-display font-bold text-base sm:text-lg text-ink dark:text-[#f1ede6] leading-tight">
                  {confirmation.eventName}
                </h4>
                <div className="flex items-center gap-2 mt-1">
                  <span className="font-mono px-2 py-0.5 rounded-[2px] text-[10px] font-bold bg-cream dark:bg-[#16212C] text-ink dark:text-[#f1ede6] border border-line dark:border-[#2b3b4f]">
                    {confirmation.eventClub}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2 border-t border-line dark:border-[#2b3b4f] text-xs">
                <div>
                  <span className="font-mono text-[10px] text-[#8c8377] dark:text-[#9ba6b5] block uppercase">Date & Schedule</span>
                  <span className="font-semibold text-ink dark:text-[#f1ede6]">{formattedDate}</span>
                </div>
                <div>
                  <span className="font-mono text-[10px] text-[#8c8377] dark:text-[#9ba6b5] block uppercase">Venue</span>
                  <span className="font-semibold text-ink dark:text-[#f1ede6] truncate block">{confirmation.eventVenue}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2 border-t border-line dark:border-[#2b3b4f] text-xs">
                <div>
                  <span className="font-mono text-[10px] text-[#8c8377] dark:text-[#9ba6b5] block uppercase">Attendee</span>
                  <span className="font-bold text-ink dark:text-[#f1ede6]">{confirmation.name}</span>
                  <span className="text-[11px] text-[#645b50] dark:text-[#9ba6b5] block truncate font-mono">{confirmation.email}</span>
                </div>
                <div>
                  <span className="font-mono text-[10px] text-[#8c8377] dark:text-[#9ba6b5] block uppercase">College & Year</span>
                  <span className="font-semibold text-ink dark:text-[#f1ede6] block truncate">{confirmation.collegeName}</span>
                  <span className="font-mono text-[11px] text-saffron font-bold block">{confirmation.year} Year</span>
                </div>
              </div>

              {/* Barcode & Security Hash */}
              <div className="pt-3 border-t border-line dark:border-[#2b3b4f] flex items-center justify-between">
                <div className="space-y-0.5">
                  <span className="font-mono text-[9px] text-[#8c8377] dark:text-[#9ba6b5] uppercase tracking-wider block">Security Hash</span>
                  <span className="font-mono text-[10px] text-ink dark:text-[#f1ede6] block">{confirmation.registrationId}</span>
                </div>

                <div className="font-mono text-[10px] font-bold bg-ink dark:bg-white text-white dark:text-ink px-3 py-1.5 rounded-[2px] tracking-widest">
                  ||| | || |||| | |||
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="p-4 bg-cream dark:bg-[#0f1620] border-t border-line dark:border-[#223040] flex items-center justify-between gap-3">
          <button
            onClick={handlePrint}
            className="flex-1 py-2.5 px-4 rounded-[3px] border border-line dark:border-[#2b3b4f] bg-paper dark:bg-[#16212C] hover:bg-cream dark:hover:bg-[#223040] text-ink dark:text-[#f1ede6] font-display text-xs font-bold transition-all flex items-center justify-center gap-2"
          >
            <Printer className="w-4 h-4 text-saffron" />
            <span>Print Pass</span>
          </button>

          <button
            onClick={onClose}
            className="flex-1 py-2.5 px-4 rounded-[3px] bg-ink dark:bg-saffron hover:bg-black dark:hover:bg-saffron-hover text-white font-display text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-sm"
          >
            <span>Done</span>
          </button>
        </div>
      </div>
    </div>
  );
};

