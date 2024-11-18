'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

import styles from '@/components/Top/TopGallery/CanvasGallery/canvas.module.scss';

interface Point {
  x: number;
  y: number;
}

interface GradientLineProps {
  ctx: CanvasRenderingContext2D;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
}

interface CanvasGalleryProps {
  currentProgressRef: React.MutableRefObject<number>;
  targetProgressRef: React.MutableRefObject<number>;
}

export const CanvasGallery = ({ currentProgressRef, targetProgressRef }: CanvasGalleryProps) => {
  const [isComponentMounted, setIsComponentMounted] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const imageRef = useRef<HTMLImageElement | null>(null);

  const drawGradientLine = useCallback(({ ctx, startX, startY, endX, endY }: GradientLineProps) => {
    const gradient = ctx.createLinearGradient(startX, startY, endX, endY);

    const animationOffset = (Date.now() % 1000) / 1000;

    gradient.addColorStop(0, 'rgba(216, 216, 216,0.5)');
    gradient.addColorStop(0.5 + Math.sin(animationOffset * Math.PI * 2) * 0.5, '#e23030'); //-1 -> 1 -> -1 ...
    gradient.addColorStop(1, 'rgba(216, 216, 216,0.5)');

    ctx.strokeStyle = gradient;
    ctx.lineWidth = 1;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.lineTo(startX + (endX - startX), startY + (endY - startY));
    ctx.stroke();
  }, []);

  const drawCircle = useCallback(
    (
      ctx: CanvasRenderingContext2D,
      x: number,
      y: number,
      radius: number,
      fill: boolean,
      color: string = '#f1f1f175'
    ) => {
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      if (fill) {
        ctx.fillStyle = color;
        ctx.fill();
      } else {
        ctx.strokeStyle = color;
        ctx.stroke();
      }
    },
    []
  );

  const drawProgress = useCallback(
    (ctx: CanvasRenderingContext2D, progress: number) => {
      // console.log('progress', progress, '\n', 'roundedProgress', Math.round(progress), '\n');
      const dashPattern = [5, 5];
      const passedPointColor = '#e23030';
      const baseColor = '#f1f1f175';

      ctx.lineWidth = 1;
      ctx.strokeStyle = baseColor;

      // progress1
      ctx.setLineDash(dashPattern);
      ctx.beginPath();
      ctx.moveTo(24.5, 102.97);
      ctx.lineTo(175.7, 38.17);
      ctx.stroke();
      ctx.setLineDash([]);
      if (Math.round(progress) === 0) {
        drawCircle(ctx, 12.5, 106.71, 12, false, passedPointColor);
        drawCircle(ctx, 12.5, 106.71, 5.81, true, passedPointColor);
      } else {
        drawCircle(ctx, 12.5, 106.71, 12, false);
        drawCircle(ctx, 12.5, 106.71, 5.81, true);
      }
      if (progress > 0 && progress <= 1) {
        drawGradientLine({
          ctx,
          startX: 24.5,
          startY: 102.97,
          endX: 175.7,
          endY: 38.17,
        });
      }
      ctx.strokeStyle = baseColor;

      // progress2
      ctx.setLineDash(dashPattern);
      ctx.beginPath();
      ctx.moveTo(198.9, 37.17);
      ctx.lineTo(306.9, 65.97);
      ctx.stroke();
      ctx.setLineDash([]);
      if (Math.round(progress) === 1) {
        drawCircle(ctx, 187.3, 34.77, 5.81, true, passedPointColor);
        drawCircle(ctx, 187.3, 34.77, 12, false, passedPointColor);
      } else {
        drawCircle(ctx, 187.3, 34.77, 5.81, true);
        drawCircle(ctx, 187.3, 34.77, 12, false);
      }
      if (progress > 1 && progress <= 2) {
        drawGradientLine({
          ctx,
          startX: 198.9,
          startY: 37.17,
          endX: 306.9,
          endY: 65.97,
        });
      }
      ctx.strokeStyle = baseColor;

      // progress3
      ctx.setLineDash(dashPattern);
      ctx.beginPath();
      ctx.moveTo(329.9, 63.37);
      ctx.lineTo(380.3, 20.17);
      ctx.stroke();
      ctx.setLineDash([]);
      if (Math.round(progress) === 2) {
        drawCircle(ctx, 318.9, 69.57, 12, false, passedPointColor);
        drawCircle(ctx, 318.9, 69.57, 5.81, true, passedPointColor);
      } else {
        drawCircle(ctx, 318.9, 69.57, 12, false);
        drawCircle(ctx, 318.9, 69.57, 5.81, true);
      }
      if (progress > 2 && progress <= 3) {
        drawGradientLine({
          ctx,
          startX: 329.9,
          startY: 63.37,
          endX: 380.3,
          endY: 20.17,
        });
      }

      ctx.strokeStyle = baseColor;

      // progress4
      ctx.setLineDash(dashPattern);
      ctx.beginPath();
      ctx.moveTo(401.3, 13.7);
      ctx.lineTo(530.9, 35.3);
      ctx.stroke();
      ctx.setLineDash([]);
      if (Math.round(progress) === 3) {
        drawCircle(ctx, 389.3, 12.5, 12, false, passedPointColor);
        drawCircle(ctx, 389.3, 12.5, 5.81, true, passedPointColor);
      } else {
        drawCircle(ctx, 389.3, 12.5, 12, false);
        drawCircle(ctx, 389.3, 12.5, 5.81, true);
      }

      ctx.strokeStyle = baseColor;

      // final
      if (Math.round(progress) === 4) {
        drawCircle(ctx, 542.9, 37.17, 12, false, passedPointColor);
        drawCircle(ctx, 542.9, 36.94, 5.81, true, passedPointColor);
      } else {
        drawCircle(ctx, 542.9, 37.17, 12, false);
        drawCircle(ctx, 542.9, 36.94, 5.81, true);
      }
      if (progress > 3 && progress <= 4) {
        drawGradientLine({
          ctx,
          startX: 401.3,
          startY: 13.7,
          endX: 530.9,
          endY: 35.3,
        });
      }
    },
    [drawCircle, drawGradientLine]
  );

  const animate = useCallback(
    (currentTime: number) => {
      if (!isComponentMounted) {
        console.log("is component doesn't exist. ", currentTime);
        return;
      }

      const canvas = canvasRef.current;

      const iconPositions: Point[] = [
        { x: 12.5, y: 106.71 },
        { x: 187.3, y: 34.77 },
        { x: 318.9, y: 69.57 },
        { x: 389.3, y: 12.5 },
        { x: 542.9, y: 37.17 },
      ];

      if (!canvas && isComponentMounted) {
        // console.log('is component exist ', isComponentMounted, ' but canvas is not supported.');
      }

      if (!canvas) return;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        throw new Error('Failed to get 2D context from canvas.');
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const viewBox = [0, 0, 555.4, 119.21];
      canvas.width = 555.4 * 2;
      canvas.height = 119.2 * 2;

      const scaleX = canvas.width / viewBox[2];
      const scaleY = canvas.height / viewBox[3];

      ctx.scale(scaleX, scaleY);

      ctx.fillStyle = '#f1f1f1';
      ctx.strokeStyle = '#f1f1f1';
      ctx.lineWidth = 1;

      if (imageRef.current) {
        const segmentIndex = Math.floor(currentProgressRef.current); //0,1,2,3,4

        // const roundedIndex = Math.round(currentProgressRef.current);

        const segmentProgress = currentProgressRef.current - segmentIndex; //0 -> 1

        const currentPos = iconPositions[segmentIndex];
        const nextPos = iconPositions[Math.min(segmentIndex + 1, iconPositions.length)];

        const x = currentPos.x + (nextPos.x - currentPos.x) * segmentProgress;
        const y = currentPos.y + (nextPos.y - currentPos.y) * segmentProgress;

        const angle = Math.atan2(nextPos.y - currentPos.y, nextPos.x - currentPos.x);
        const direction = targetProgressRef.current > currentProgressRef.current ? 1 : -1;

        // console.log(
        //   'targetProgress',
        //   targetProgressRef.current,
        //   '\n',
        //   'currentProgress',
        //   currentProgressRef.current,
        //   '\n',
        //   'segmentIndex',
        //   segmentIndex,
        //   '\n',
        //   'segmentProgress',
        //   segmentProgress,
        //   '\n',
        //   'x',
        //   x,
        //   '\n',
        //   'y',
        //   y,
        //   '\n',
        //   'angle',
        //   angle
        // );

        drawProgress(ctx, currentProgressRef.current);

        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(angle + (direction > 0 ? Math.PI / 2 : -Math.PI / 2));
        ctx.drawImage(imageRef.current, -12, -12, 24, 24);
        ctx.restore();
      }

      if (isComponentMounted) {
        animationRef.current = requestAnimationFrame(animate);
      }
    },
    [drawProgress, currentProgressRef, targetProgressRef, isComponentMounted]
  );

  useEffect(() => {
    setIsComponentMounted(true);

    const img = new Image();
    img.src = '/images/top/flight.svg';
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      imageRef.current = img;
      if (isComponentMounted) {
        animationRef.current = requestAnimationFrame(animate);
      }
    };
    img.onerror = (e) => {
      console.error('Error loading image:', e);
    };

    return () => {
      // console.log('unmount CanvasGallery');

      setIsComponentMounted(false);
      if (animationRef.current) {
        // console.log('stop animation in CanvasGallery');

        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [animate, isComponentMounted]);

  return (
    <canvas
      ref={canvasRef}
      className={styles.canvas}
      aria-label="Progress visualization"
      role="img"
    />
  );
};
