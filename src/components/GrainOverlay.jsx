import { useEffect, useRef } from 'react';

export default function GrainOverlay({ opacity = 0.08 }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const W = 300;
    const H = 300;
    canvas.width = W;
    canvas.height = H;

    const ctx = canvas.getContext('2d');
    const img = ctx.createImageData(W, H);
    const data = img.data;

    for (let i = 0; i < data.length; i += 4) {
      const val = Math.floor(Math.random() * 255);
      data[i] = val;
      data[i + 1] = val;
      data[i + 2] = val;
      data[i + 3] = Math.floor(Math.random() * 55);
    }

    ctx.putImageData(img, 0, 0);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        borderRadius: '16px',
        opacity,
        pointerEvents: 'none',
        zIndex: 0,
        mixBlendMode: 'screen',
      }}
    />
  );
}