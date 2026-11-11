import React from 'react';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({ children, title, subtitle }) => {
  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-meta-bg relative overflow-hidden">
      {/* Minecraft dirt/stone background pattern */}
      <div
        className="absolute inset-0 opacity-[0.06] pointer-events-none"
        style={{
          backgroundImage: `
            repeating-linear-gradient(0deg, #555 0px, #555 2px, transparent 2px, transparent 32px),
            repeating-linear-gradient(90deg, #555 0px, #555 2px, transparent 2px, transparent 32px)
          `,
        }}
      />

      <div className="relative w-full max-w-md z-10">
        {/* Brand Header — Minecraft style */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 mc-slot mb-4">
            <div className="w-10 h-10 bg-[#3B7A23] border-t-2 border-l-2 border-[#559E37] border-r-2 border-b-2 border-r-[#1C420D] border-b-[#1C420D] flex items-center justify-center">
              <span className="font-extrabold text-xl text-white mc-text">M</span>
            </div>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white mc-text">
            MINECRAFT<span className="text-[#4DEDF3]">VERSE</span>
          </h1>
          <p className="text-[10px] text-[#55FF55] mt-1 uppercase tracking-widest font-bold mc-text">
            2D Gather Edition — Multiplayer World
          </p>
        </div>

        {/* Auth Card Container — Stone panel */}
        <div className="mc-panel p-6 sm:p-8">
          <div className="mb-6">
            <h2 className="text-lg font-bold text-white mc-text">{title}</h2>
            <p className="text-xs text-meta-muted mt-1">{subtitle}</p>
          </div>

          {children}
        </div>

        {/* Footer info */}
        <div className="mt-8 text-center text-[10px] text-meta-muted/60 mc-text">
          ⛏ Powered by WebSocket Arena & Node.js Backend
        </div>
      </div>
    </div>
  );
};
