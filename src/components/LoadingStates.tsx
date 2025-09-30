// Professional Loading States and Animations

export function LoadingSpinner({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const sizes = {
    sm: "w-4 h-4",
    md: "w-8 h-8",
    lg: "w-12 h-12",
  };

  return (
    <div className={`${sizes[size]} relative`}>
      <div className="absolute inset-0 rounded-full border-2 border-gray-200"></div>
      <div className="absolute inset-0 rounded-full border-2 border-green-500 border-t-transparent animate-spin"></div>
    </div>
  );
}

export function SkeletonPost() {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 animate-pulse">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-full bg-gray-200"></div>
        <div className="flex-1">
          <div className="h-4 bg-gray-200 rounded w-32 mb-2"></div>
          <div className="h-3 bg-gray-200 rounded w-20"></div>
        </div>
      </div>
      <div className="space-y-2 mb-4">
        <div className="h-4 bg-gray-200 rounded w-full"></div>
        <div className="h-4 bg-gray-200 rounded w-5/6"></div>
        <div className="h-4 bg-gray-200 rounded w-4/6"></div>
      </div>
      <div className="flex gap-6 pt-3">
        <div className="h-8 bg-gray-200 rounded w-16"></div>
        <div className="h-8 bg-gray-200 rounded w-16"></div>
        <div className="h-8 bg-gray-200 rounded w-16"></div>
      </div>
    </div>
  );
}

export function PageTransition({ children }: { children: React.ReactNode }) {
  return (
    <div className="animate-fadeIn">
      {children}
    </div>
  );
}

export function PulseLoader() {
  return (
    <div className="flex gap-2">
      <div className="w-3 h-3 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
      <div className="w-3 h-3 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
      <div className="w-3 h-3 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
    </div>
  );
}

export function ProgressBar({ progress }: { progress: number }) {
  return (
    <div className="w-full h-1 bg-gray-200 rounded-full overflow-hidden">
      <div 
        className="h-full bg-gradient-to-r from-green-500 to-emerald-500 transition-all duration-300 ease-out"
        style={{ width: `${progress}%` }}
      ></div>
    </div>
  );
}
