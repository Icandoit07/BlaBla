import React from "react";

export function Card({ children, hover = false }: { children: React.ReactNode; hover?: boolean }) {
  return (
    <div className={`
      rounded-2xl border border-gray-200 bg-white shadow-sm
      ${hover ? "transition-all duration-200 hover:shadow-md hover:border-green-200 hover:-translate-y-0.5" : ""}
    `}>
      <div className="p-4 sm:p-5">{children}</div>
    </div>
  );
}


