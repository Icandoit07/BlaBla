export function Logo({ size = "default" }: { size?: "small" | "default" | "large" }) {
  const dimensions = {
    small: { width: 32, height: 32, fontSize: "text-lg", logoSize: "text-xl" },
    default: { width: 40, height: 40, fontSize: "text-xl", logoSize: "text-2xl" },
    large: { width: 56, height: 56, fontSize: "text-2xl", logoSize: "text-4xl" },
  };

  const { width, height, fontSize, logoSize } = dimensions[size];

  return (
    <div className="flex items-center gap-3 group cursor-pointer">
      {/* Premium Geometric Logo - Overlapping Speech Bubbles */}
      <div 
        className="relative transition-all duration-500 ease-out group-hover:scale-110"
        style={{ width, height }}
      >
        {/* Main Circle - Gradient Background */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-emerald-400 via-green-500 to-teal-600 shadow-lg group-hover:shadow-2xl transition-shadow duration-500"></div>
        
        {/* Animated Ring */}
        <div className="absolute inset-0 rounded-full border-2 border-white/30 group-hover:border-white/50 transition-all duration-500"></div>
        <div className="absolute -inset-1 rounded-full border border-green-400/20 group-hover:border-green-300/40 group-hover:scale-110 transition-all duration-700"></div>
        
        {/* Center Icon - Stylized "B" with Speech Wave */}
        <svg 
          viewBox="0 0 40 40" 
          fill="none" 
          className="absolute inset-0 p-2"
        >
          {/* Modern B letterform */}
          <path 
            d="M14 10 L14 30 M14 10 L22 10 C24.5 10 26 11.5 26 14 C26 16 24.5 17.5 22 17.5 L14 17.5 M14 17.5 L23 17.5 C25.5 17.5 27 19 27 21.5 C27 24 25.5 25.5 23 25.5 L14 25.5" 
            stroke="white" 
            strokeWidth="2.5" 
            strokeLinecap="round" 
            strokeLinejoin="round"
            className="drop-shadow-md"
          />
          
          {/* Speech wave accent */}
          <path 
            d="M30 16 Q32 18 30 20" 
            stroke="white" 
            strokeWidth="1.5" 
            strokeLinecap="round"
            opacity="0.7"
          >
            <animate attributeName="opacity" values="0.5;1;0.5" dur="2s" repeatCount="indefinite" />
          </path>
          <path 
            d="M32 14 Q35 18 32 22" 
            stroke="white" 
            strokeWidth="1.2" 
            strokeLinecap="round"
            opacity="0.5"
          >
            <animate attributeName="opacity" values="0.3;0.8;0.3" dur="2s" begin="0.3s" repeatCount="indefinite" />
          </path>
        </svg>
        
        {/* Glow Effect */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      </div>
      
      {/* Wordmark - Modern Typography */}
      <div className="flex flex-col justify-center -space-y-0.5">
        <span className={`${logoSize} font-black tracking-tight leading-none bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent`}>
          BlaBla
        </span>
      </div>
    </div>
  );
}

export function LogoIcon({ size = 40 }: { size?: number }) {
  return (
    <div 
      className="relative transition-all duration-500 ease-out hover:scale-110 cursor-pointer group"
      style={{ width: size, height: size }}
    >
      {/* Main Circle */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-emerald-400 via-green-500 to-teal-600 shadow-lg group-hover:shadow-2xl transition-shadow duration-500"></div>
      
      {/* Animated Ring */}
      <div className="absolute inset-0 rounded-full border-2 border-white/30 group-hover:border-white/50 transition-all duration-500"></div>
      <div className="absolute -inset-1 rounded-full border border-green-400/20 group-hover:border-green-300/40 group-hover:scale-110 transition-all duration-700"></div>
      
      {/* Center Icon */}
      <svg 
        viewBox="0 0 40 40" 
        fill="none" 
        className="absolute inset-0 p-2"
      >
        <path 
          d="M14 10 L14 30 M14 10 L22 10 C24.5 10 26 11.5 26 14 C26 16 24.5 17.5 22 17.5 L14 17.5 M14 17.5 L23 17.5 C25.5 17.5 27 19 27 21.5 C27 24 25.5 25.5 23 25.5 L14 25.5" 
          stroke="white" 
          strokeWidth="2.5" 
          strokeLinecap="round" 
          strokeLinejoin="round"
          className="drop-shadow-md"
        />
        <path 
          d="M30 16 Q32 18 30 20" 
          stroke="white" 
          strokeWidth="1.5" 
          strokeLinecap="round"
          opacity="0.7"
        >
          <animate attributeName="opacity" values="0.5;1;0.5" dur="2s" repeatCount="indefinite" />
        </path>
        <path 
          d="M32 14 Q35 18 32 22" 
          stroke="white" 
          strokeWidth="1.2" 
          strokeLinecap="round"
          opacity="0.5"
        >
          <animate attributeName="opacity" values="0.3;0.8;0.3" dur="2s" begin="0.3s" repeatCount="indefinite" />
        </path>
      </svg>
      
      {/* Glow */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
    </div>
  );
}