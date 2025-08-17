import React from "react";

const MainContent = ({ children, className = "" }) => {
  return (
    <div
      className={`flex-1 transition-all duration-300 ease-in-out min-h-[calc(100vh-4rem)] ${className}`}
      style={{
        marginLeft: "var(--sidebar-width, 288px)",
      }}
    >
      {/* Content Container with consistent background and padding */}
      <div className="bg-dark-900 min-h-full">
        <div className="p-6 bg-dark-900">
          {children}
        </div>
      </div>
    </div>
  );
};

export default MainContent;