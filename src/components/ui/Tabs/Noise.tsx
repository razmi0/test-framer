import { useEffect, useRef, useState } from "react";

const Noise = ({ className, color }: { className?: string; color: string }) => {
  const [config, setConfig] = useState({ width: 0, height: 0, baseFrequency: 0.01 });
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setConfig({
      width: ref.current?.clientWidth || 0,
      height: ref.current?.clientHeight || 0,
      baseFrequency: Math.random() * (0.2 - 0.01) + 0.01,
    });
  }, []);

  return (
    <div ref={ref} className={`pointer-events-none z-[1] absolute inset-[1px] overflow-hidden ${className || ""}`}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        version="1.1"
        xmlnsXlink="http://www.w3.org/1999/xlink"
        viewBox={`0 0 ${config.width} ${config.height}`}
        width={config.width}
        height={config.height}
        opacity="0.1">
        <defs>
          <filter
            id="nnnoise-filter"
            x="-20%"
            y="-20%"
            width="140%"
            height="140%"
            filterUnits="objectBoundingBox"
            primitiveUnits="userSpaceOnUse"
            colorInterpolationFilters="linearRGB">
            <feTurbulence
              type="fractalNoise"
              baseFrequency={config.baseFrequency}
              numOctaves="4"
              seed="15"
              stitchTiles="stitch"
              x="0%"
              y="0%"
              width="100%"
              height="100%"
              result="turbulence"></feTurbulence>
            <feSpecularLighting
              surfaceScale="16"
              specularConstant="2.2"
              specularExponent="20"
              lightingColor={color}
              x="0%"
              y="0%"
              width="100%"
              height="100%"
              in="turbulence"
              result="specularLighting">
              <feDistantLight azimuth="3" elevation="100"></feDistantLight>
            </feSpecularLighting>
          </filter>
        </defs>
        <rect width={`${config.width}`} height={`${config.height}`} fill="transparent"></rect>
        <rect width={`${config.width}`} height={`${config.height}`} fill={color} filter="url(#nnnoise-filter)"></rect>
      </svg>
    </div>
  );
};

export default Noise;
