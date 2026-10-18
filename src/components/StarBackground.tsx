import React from 'react';

export const StarBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* Deep ambient radial glow */}
      <div 
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[500px] rounded-full blur-[120px] opacity-25"
        style={{ background: 'radial-gradient(circle, #9B7A88 0%, #30232D 60%, transparent 100%)' }}
      />
      <div 
        className="absolute bottom-0 right-0 w-[450px] h-[450px] rounded-full blur-[140px] opacity-20"
        style={{ background: 'radial-gradient(circle, #C6A27C 0%, #211A20 70%, transparent 100%)' }}
      />

      {/* Scattered twinkling stars */}
      {[
        { top: '8%', left: '15%', size: '3px', delay: '0s', dur: '3.5s' },
        { top: '14%', left: '85%', size: '2px', delay: '1s', dur: '4s' },
        { top: '22%', left: '45%', size: '3px', delay: '1.5s', dur: '3s' },
        { top: '35%', left: '10%', size: '2px', delay: '0.5s', dur: '4.5s' },
        { top: '48%', left: '78%', size: '2.5px', delay: '2s', dur: '3.2s' },
        { top: '65%', left: '20%', size: '3px', delay: '1.2s', dur: '5s' },
        { top: '75%', left: '90%', size: '2px', delay: '0.8s', dur: '4.2s' },
        { top: '88%', left: '40%', size: '2.5px', delay: '1.8s', dur: '3.8s' },
      ].map((star, idx) => (
        <div
          key={idx}
          className="absolute rounded-full bg-[#F6E9D7] shadow-[0_0_8px_#D5AE83]"
          style={{
            top: star.top,
            left: star.left,
            width: star.size,
            height: star.size,
            animation: `starTwinkle ${star.dur} ease-in-out infinite`,
            animationDelay: star.delay,
          }}
        />
      ))}
    </div>
  );
};
