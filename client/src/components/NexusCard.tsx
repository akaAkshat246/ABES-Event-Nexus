import React, { useRef, useState } from 'react';
import html2canvas from 'html2canvas';
import {
  Download,
  CheckCircle2,
  Mail,
  Building,
  BookOpen,
  Phone,
  Sparkles,
  Loader2,
} from 'lucide-react';
import { IStudent } from '../types';

interface NexusCardProps {
  student: IStudent;
  role?: string;
  onClose?: () => void;
}

export const NexusCard: React.FC<NexusCardProps> = ({ student, role = 'student', onClose }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const nexusId = `NX-${student.rollNumber || 'ABES'}-${Math.abs(
    student.email.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
  )
    .toString()
    .padStart(4, '0')}`;

  const handleDownload = async () => {
    if (!cardRef.current) return;
    setIsDownloading(true);

    try {
      const canvas = await html2canvas(cardRef.current, {
        scale: 3, // High-resolution crisp export
        useCORS: true,
        allowTaint: true,
        backgroundColor: null,
      });

      const image = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      const filename = `ABES_Nexus_Card_${(student.name || 'Student').replace(/\s+/g, '_')}.png`;
      link.href = image;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 3500);
    } catch (error) {
      console.error('Failed to download Nexus Card:', error);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      {/* Top Action Ribbon */}
      <div className="w-full flex items-center justify-between text-white border-b border-white/10 pb-3">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-saffron" />
          <span className="font-display font-bold text-sm text-white">
            Official ABES Autonomous Nexus Pass
          </span>
        </div>

        <button
          onClick={handleDownload}
          disabled={isDownloading}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-[4px] bg-saffron hover:bg-saffron-hover text-white font-display text-xs font-bold shadow-md transition-all disabled:opacity-50 active:scale-95"
        >
          {isDownloading ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin text-white" />
              <span>Generating HQ Pass...</span>
            </>
          ) : downloadSuccess ? (
            <>
              <CheckCircle2 className="w-3.5 h-3.5 text-white" />
              <span>Downloaded!</span>
            </>
          ) : (
            <>
              <Download className="w-3.5 h-3.5 text-white" />
              <span>Download Card</span>
            </>
          )}
        </button>
      </div>

      {/* THE OFFICIAL NEXUS CARD CANVAS (Exportable) */}
      <div className="p-1.5 sm:p-2 bg-black/40 rounded-[10px] border border-white/15 shadow-[0_20px_50px_rgba(0,0,0,0.8)] overflow-hidden">
        <div
          ref={cardRef}
          className="relative w-[330px] sm:w-[380px] h-[480px] sm:h-[530px] rounded-[8px] overflow-hidden select-none bg-cover bg-center text-[#1e293b] shadow-2xl flex flex-col justify-between"
          style={{
            backgroundImage: 'url(/assets/nexus-card-bg.png)',
            backgroundSize: '100% 100%',
          }}
        >
          {/* Ambient overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-amber-950/10 pointer-events-none" />

          {/* CARD HEADER SECTION */}
          <div className="relative z-10 pt-14 sm:pt-16 px-6 text-center">
            {/* Calligraphic Heading of Nexus Card */}
            <h1
              className="text-4xl sm:text-5xl text-[#600b14] leading-tight font-normal drop-shadow-sm"
              style={{
                fontFamily: "'Alex Brush', 'Great Vibes', 'Instrument Serif', cursive, serif",
                letterSpacing: '0.04em',
              }}
            >
              Nexus Card
            </h1>

            {/* Sub-header divider */}
            <div className="flex items-center justify-center gap-2 mt-0.5 mb-1.5">
              <span className="h-[1px] w-8 bg-gradient-to-r from-transparent to-[#b8860b]" />
              <span className="font-mono text-[8.5px] uppercase tracking-[0.2em] text-[#78101c] font-bold">
                Autonomous Student Identity Pass
              </span>
              <span className="h-[1px] w-8 bg-gradient-to-l from-transparent to-[#b8860b]" />
            </div>
          </div>

          {/* CARD CREDENTIALS BODY */}
          <div className="relative z-10 px-6 sm:px-7 space-y-2.5 sm:space-y-3 flex-1 flex flex-col justify-center pb-6 sm:pb-8">
            {/* Student Name & Avatar Row */}
            <div className="bg-[#fff9ef]/90 backdrop-blur-xs p-3 rounded-[6px] border border-[#d8be8a] shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-gradient-to-tr from-[#600b14] to-[#a01825] text-[#fef7ea] font-display font-extrabold text-lg flex items-center justify-center border-2 border-[#b8860b] shadow-sm shrink-0">
                  {student.name.charAt(0)}
                </div>

                <div className="min-w-0 flex-1">
                  <span className="font-mono text-[8.5px] uppercase tracking-wider text-[#8c6b1b] font-bold block">
                    Card Holder / Member
                  </span>
                  <h2 className="font-display font-bold text-base sm:text-[17px] text-[#4a080f] truncate leading-tight">
                    {student.name}
                  </h2>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="font-mono text-[10px] sm:text-[10.5px] text-[#600b14] font-bold">
                      Roll: {student.rollNumber}
                    </span>
                    <span className="text-[10px] text-[#a07c24] font-bold">•</span>
                    <span className="font-mono text-[9.5px] sm:text-[10px] text-[#2c3e50] font-semibold">
                      {student.year} Year
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Academic Credentials Grid */}
            <div className="bg-[#fffbf4]/85 p-2.5 sm:p-3 rounded-[6px] border border-[#e5d4af] shadow-xs space-y-1.5 sm:space-y-2 text-[11px] font-mono">
              <div className="flex items-center justify-between pb-1 sm:pb-1.5 border-b border-[#ebdcb9]">
                <span className="text-[#7c6b50] text-[9px] sm:text-[9.5px] uppercase font-bold flex items-center gap-1">
                  <Building className="w-3 h-3 text-[#b8860b]" />
                  <span>College</span>
                </span>
                <span className="text-[#3b1217] font-bold text-[10px] sm:text-[10.5px] text-right truncate max-w-[200px]">
                  ABES Engineering College
                </span>
              </div>

              <div className="flex items-center justify-between pb-1 sm:pb-1.5 border-b border-[#ebdcb9]">
                <span className="text-[#7c6b50] text-[9px] sm:text-[9.5px] uppercase font-bold flex items-center gap-1">
                  <BookOpen className="w-3 h-3 text-[#b8860b]" />
                  <span>Department</span>
                </span>
                <span className="text-[#3b1217] font-bold text-[10px] sm:text-[10.5px] text-right truncate max-w-[190px]">
                  {student.branch}
                </span>
              </div>

              <div className="flex items-center justify-between pb-1 sm:pb-1.5 border-b border-[#ebdcb9]">
                <span className="text-[#7c6b50] text-[9px] sm:text-[9.5px] uppercase font-bold flex items-center gap-1">
                  <Mail className="w-3 h-3 text-[#b8860b]" />
                  <span>Official Email</span>
                </span>
                <span className="text-[#3b1217] font-bold text-[10px] sm:text-[10.5px] text-right truncate max-w-[190px]">
                  {student.email}
                </span>
              </div>

              {student.phone && (
                <div className="flex items-center justify-between">
                  <span className="text-[#7c6b50] text-[9px] sm:text-[9.5px] uppercase font-bold flex items-center gap-1">
                    <Phone className="w-3 h-3 text-[#b8860b]" />
                    <span>WhatsApp No.</span>
                  </span>
                  <span className="text-[#3b1217] font-bold text-[10px] sm:text-[10.5px]">
                    +91 {student.phone}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom info & close */}
      <div className="w-full flex items-center justify-between text-xs text-[#a99f92] pt-1">
        <span>Click Download to save your official Pass PNG.</span>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-[3px] bg-white/10 hover:bg-white/20 text-white font-display font-semibold transition-all border border-white/15"
          >
            Close
          </button>
        )}
      </div>
    </div>
  );
};
