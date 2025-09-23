import React from 'react';
import Link from 'next/link';

interface AnimatedSignInButtonProps {
  href?: string;
  onClick?: () => void;
}

const AnimatedSignInButton = ({ href = "/login", onClick }: AnimatedSignInButtonProps) => {
  const buttonContent = (
    <button 
      className="relative group px-6 py-2 bg-white/10 border border-white/20 rounded-lg text-white font-light text-sm transition-all duration-300 hover:bg-white/20 hover:scale-105 overflow-hidden"
      onClick={onClick}
    >
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 via-blue-500/20 to-purple-500/20 bg-size-200 bg-pos-0 group-hover:bg-pos-100 transition-all duration-700 opacity-0 group-hover:opacity-100"></div>
      
      {/* Glowing border effect */}
      <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-purple-400 via-blue-400 to-purple-400 bg-size-200 bg-pos-0 group-hover:bg-pos-100 transition-all duration-700 opacity-0 group-hover:opacity-30 blur-sm"></div>
      
      {/* Button text */}
      <span className="relative z-10">Sign In</span>
      
      <style jsx>{`
        .bg-size-200 {
          background-size: 200% 200%;
        }
        .bg-pos-0 {
          background-position: 0% 50%;
        }
        .bg-pos-100 {
          background-position: 100% 50%;
        }
      `}</style>
    </button>
  );

  if (href && !onClick) {
    return <Link href={href}>{buttonContent}</Link>;
  }

  return buttonContent;
};

export default AnimatedSignInButton;