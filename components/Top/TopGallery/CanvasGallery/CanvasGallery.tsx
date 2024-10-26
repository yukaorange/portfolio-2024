'use client';

import '@/components/Top/TopGallery/CanvasGallery/canvas-gallery.scss';

import { useEffect, useRef,useState } from 'react';

export const CanvasGallery = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [currentProgress, setCurrentProgress] = useState(1);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      throw new Error('Canvas is not supported.');
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      throw new Error('Failed to get 2D context from canvas.');
    }

    const viewBox = [0, 0, 555.4, 119.21];
    canvas.width = 555.4;
    canvas.height = 119.21;

    const scaleX = canvas.width / viewBox[2];
    const scaleY = canvas.height / viewBox[3];

    // console.log(scaleX, scaleY);

    ctx.scale(scaleX, scaleY);

    ctx.fillStyle = '#f1f1f1';
    ctx.strokeStyle = '#f1f1f1';
    ctx.lineWidth = 1;

    const iconPositions = [
      { x: 12.5, y: 106.71 },
      { x: 187.3, y: 34.77 },
      { x: 318.9, y: 69.57 },
      { x: 389.3, y: 12.5 },
      { x: 542.9, y: 37.17 },
    ];

    const img = new Image();
    img.src = '/images/top/flight.svg';
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const position = iconPositions[currentProgress - 1];
      ctx.drawImage(img, position.x - 12, position.y - 12, 24, 24);
    };

    drawProgress(ctx);
  }, []);

  const drawCircle = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    radius: number,
    fill: boolean
  ) => {
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    if (fill) {
      ctx.fillStyle = '#f1f1f1';
      ctx.fill();
    } else {
      ctx.stroke();
    }
  };

  const drawProgress = (ctx: CanvasRenderingContext2D) => {
    ctx.strokeStyle = '#f1f1f1';
    ctx.lineWidth = 1;

    // progress1
    ctx.beginPath();
    ctx.moveTo(24.5, 102.97);
    ctx.lineTo(175.7, 38.17);
    ctx.stroke();
    drawCircle(ctx, 12.5, 106.71, 12, false);
    drawCircle(ctx, 12.5, 106.71, 5.81, true);

    // progress2
    drawCircle(ctx, 187.3, 34.77, 12, false);
    ctx.beginPath();
    ctx.moveTo(198.9, 37.17);
    ctx.lineTo(306.9, 65.97);
    ctx.stroke();
    drawCircle(ctx, 187.3, 34.77, 5.81, true);

    // progress3
    drawCircle(ctx, 318.9, 69.57, 12, false);
    ctx.beginPath();
    ctx.moveTo(329.9, 63.37);
    ctx.lineTo(380.3, 20.17);
    ctx.stroke();
    drawCircle(ctx, 318.9, 69.57, 5.81, true);

    // progress4
    drawCircle(ctx, 389.3, 12.5, 12, false);
    ctx.beginPath();
    ctx.moveTo(401.3, 13.7);
    ctx.lineTo(530.9, 35.3);
    ctx.stroke();
    drawCircle(ctx, 389.3, 12.5, 5.81, true);

    // final
    drawCircle(ctx, 542.9, 37.17, 12, false);
    drawCircle(ctx, 542.9, 36.94, 5.81, true);
  };

  return (
    <canvas
      ref={canvasRef}
      className="canvas-gallery"
      aria-label="Progress visualization"
      role="img"
    />
  );
};
