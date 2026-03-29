"use client"

import React, { useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import styles from './not-found.module.scss';

const MATRIX_CHARS = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789ABCDEF404';

const NotFound = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = canvas.offsetWidth * devicePixelRatio;
      canvas.height = canvas.offsetHeight * devicePixelRatio;
      ctx.scale(devicePixelRatio, devicePixelRatio);
    };

    resize();

    const fontSize = 14;
    const columns = Math.floor(canvas.offsetWidth / fontSize);
    const drops: number[] = new Array(columns).fill(0).map(() => Math.random() * -100);

    const tick = () => {
      ctx.fillStyle = 'rgba(14, 14, 14, 0.06)';
      ctx.fillRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);

      for (let i = 0; i < drops.length; i++) {
        const char = MATRIX_CHARS[Math.floor(Math.random() * MATRIX_CHARS.length)];
        const x = i * fontSize;
        const y = drops[i] * fontSize;

        // Lead character — bright cyan
        ctx.fillStyle = 'rgba(0, 240, 255, 0.9)';
        ctx.font = `${fontSize}px "SF Mono", "Fira Code", monospace`;
        ctx.fillText(char, x, y);

        // Previous character — neon green (matrix trail)
        if (drops[i] > 1) {
          const prevChar = MATRIX_CHARS[Math.floor(Math.random() * MATRIX_CHARS.length)];
          ctx.fillStyle = 'rgba(48, 248, 2, 0.6)';
          ctx.fillText(prevChar, x, y - fontSize);
        }

        // Fade out older characters
        if (drops[i] > 3) {
          const oldChar = MATRIX_CHARS[Math.floor(Math.random() * MATRIX_CHARS.length)];
          ctx.fillStyle = 'rgba(48, 248, 2, 0.15)';
          ctx.fillText(oldChar, x, y - fontSize * 3);
        }

        if (y > canvas.offsetHeight && Math.random() > 0.975) {
          drops[i] = 0;
        }

        drops[i]++;
      }
    };

    const interval = setInterval(tick, 50);

    const handleResize = () => {
      resize();
      drops.length = 0;
      const newCols = Math.floor(canvas.offsetWidth / fontSize);
      for (let i = 0; i < newCols; i++) {
        drops.push(Math.random() * -50);
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      clearInterval(interval);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    return draw();
  }, [draw]);

  return (
    <div className={styles.container}>
      <canvas ref={canvasRef} className={styles.canvas} aria-hidden="true" />

      <div className={styles.content}>
        <div className={styles.glitchWrapper}>
          <h1 className={styles.errorCode} data-text="404" aria-label="404 error">
            404
          </h1>
        </div>

        <div className={styles.terminal}>
          <p className={styles.prompt}>
            <span className={styles.caret} aria-hidden="true">&gt;</span>
            SYSTEM.ERR: ROUTE_NOT_FOUND
          </p>
          <p className={styles.prompt}>
            <span className={styles.caret} aria-hidden="true">&gt;</span>
            STATUS: CONNECTION_LOST
          </p>
          <p className={styles.promptBlink}>
            <span className={styles.caret} aria-hidden="true">&gt;</span>
            REDIRECTING TO SAFE_NODE...
            <span className={styles.cursor} aria-hidden="true">_</span>
          </p>
        </div>

        <Link href="/" className={styles.btn}>
          Return to Mainframe
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
