import { useEffect, useRef } from "react";

export function LiveLogo() {
    const containerRef = useRef<HTMLDivElement>(null);
    const requestRef = useRef<number>();
    const mouseRef = useRef({ x: -1000, y: -1000 });

    useEffect(() => {
        // Mouse tracking
        const handleMouseMove = (e: MouseEvent) => {
            mouseRef.current = { x: e.clientX, y: e.clientY };
        };
        window.addEventListener("mousemove", handleMouseMove);

        // Animation loop
        const animate = () => {
            if (!containerRef.current) return;

            const rect = containerRef.current.getBoundingClientRect();
            const lx = rect.left + rect.width / 2;
            const ly = rect.top + rect.height / 2;

            const dist = Math.sqrt(
                (mouseRef.current.x - lx) ** 2 +
                (mouseRef.current.y - ly) ** 2
            );

            const time = performance.now() * 0.0015; // Slowed down shimmer

            // Formula: 
            // 1. Idle: Base glow (8) + Slow Pulse (+/- 4)
            // 2. Hover: Strong boost when mouse is close (+40)
            const pulse = Math.sin(time) * 4;
            const proximity = dist < 250 ? (250 - dist) / 250 * 50 : 0;

            const totalGlow = (8 + pulse) + proximity;

            containerRef.current.style.filter = `url(#remove-white) drop-shadow(0 0 ${totalGlow}px #400000)`;

            requestRef.current = requestAnimationFrame(animate);
        };

        requestRef.current = requestAnimationFrame(animate);

        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
            if (requestRef.current) cancelAnimationFrame(requestRef.current);
        };
    }, []);

    return (
        <>
            {/* SVG Filter for transparency/color correction */}
            <svg width="0" height="0" style={{ position: "absolute", pointerEvents: "none" }}>
                <filter id="remove-white">
                    <feColorMatrix
                        type="matrix"
                        values="
            1 0 0 0 0
            0 1 0 0 0
            0 0 1 0 0
            0 -1.2 -1.2 1 0"
                    />
                </filter>
            </svg>

            {/* Logo Container */}
            <div
                ref={containerRef}
                className="relative z-10 w-auto h-20 flex items-center justify-center will-change-filter pointer-events-none"
                style={{
                    // We let the parent control width/height, but here we ensure it fits
                    // The CSS from user had absolute positioning, but in Flexbox Header we want relative/static
                }}
            >
                <img
                    src="/assets/logo-live.jpg"
                    alt="MS-PRO Live Logo"
                    className="h-full w-auto object-contain block"
                />
            </div>
        </>
    );
}
