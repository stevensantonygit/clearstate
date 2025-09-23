import React from 'react';

interface StyledSignInButtonProps {
  onClick?: () => void;
  children?: React.ReactNode;
  href?: string;
}

const StyledSignInButton = ({ onClick, children = "Sign In", href }: StyledSignInButtonProps) => {
  const handleClick = () => {
    if (href) {
      window.location.href = href;
    } else if (onClick) {
      onClick();
    }
  };

  return (
    <div className="relative inline-block">
      <style jsx>{`
        .futuristic-button {
          position: relative;
          padding: 8px 20px;
          background: linear-gradient(135deg, #111215, #1a1d23);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          color: white;
          font-size: 14px;
          font-weight: 400;
          cursor: pointer;
          transition: all 0.3s ease;
          overflow: hidden;
          min-width: 80px;
          text-align: center;
          z-index: 1;
        }

        .futuristic-button::before {
          content: '';
          position: absolute;
          top: -2px;
          left: -2px;
          right: -2px;
          bottom: -2px;
          background: linear-gradient(
            45deg, 
            #ff6b6b, 
            #4ecdc4, 
            #45b7d1, 
            #f9ca24, 
            #ff6b6b
          );
          background-size: 300% 300%;
          border-radius: 12px;
          z-index: -1;
          animation: gradient-spin 3s ease-in-out infinite;
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .futuristic-button:hover::before {
          opacity: 0.8;
        }

        .futuristic-button:hover {
          transform: translateY(-1px);
          box-shadow: 0 8px 25px rgba(69, 183, 209, 0.3);
          border-color: rgba(255, 255, 255, 0.2);
        }

        .futuristic-button:active {
          transform: translateY(0);
        }

        @keyframes gradient-spin {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }
      `}</style>
      
      <button className="futuristic-button" onClick={handleClick}>
        {children}
      </button>
    </div>
  );
};

export default StyledSignInButton;