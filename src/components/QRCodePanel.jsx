import { QRCodeSVG } from 'qrcode.react';

export default function QRCodePanel({ url }) {
  return (
    <div className="p-4 border-b border-navy-border text-center">
      <div className="text-2xl mb-1">📱</div>
      <h3 className="text-[11px] font-bold uppercase tracking-widest text-slate-300 mb-3">
        Scan to Vote
      </h3>
      <div className="inline-block bg-white p-2 rounded-lg shadow-lg">
        <QRCodeSVG
          value={url}
          size={148}
          bgColor="#ffffff"
          fgColor="#080f1c"
          level="M"
        />
      </div>
      <p className="text-[9px] text-slate-600 mt-2 break-all leading-tight">{url}</p>
    </div>
  );
}
