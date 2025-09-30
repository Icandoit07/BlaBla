import { UserIcon } from "./icons";

interface AvatarProps {
  src?: string | null;
  alt: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl";
  className?: string;
}

const sizeClasses = {
  xs: "w-6 h-6 text-xs",
  sm: "w-8 h-8 text-sm",
  md: "w-10 h-10 text-base",
  lg: "w-12 h-12 text-lg",
  xl: "w-16 h-16 text-xl",
  "2xl": "w-24 h-24 text-3xl",
};

export function Avatar({ src, alt, size = "md", className = "" }: AvatarProps) {
  const sizeClass = sizeClasses[size];

  return (
    <div 
      className={`
        ${sizeClass} rounded-full overflow-hidden flex items-center justify-center
        bg-gradient-to-br from-emerald-400 via-green-500 to-teal-600
        flex-shrink-0 ${className}
      `}
    >
      {src ? (
        <img 
          src={src} 
          alt={alt} 
          className="w-full h-full object-cover"
        />
      ) : (
        <span className="text-white font-semibold">
          {alt.charAt(0).toUpperCase()}
        </span>
      )}
    </div>
  );
}
