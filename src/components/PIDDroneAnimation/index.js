import React, { useEffect, useMemo, useState } from 'react';
import { calculateResponse } from '../PIDSimulator/simulation';
import styles from './styles.module.css';

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
const playbackDuration = 6000;
const animationEndTime = 8;

function DroneIcon({ isFlying }) {
  return (
    <svg
      className={`${styles.drone} ${isFlying ? styles.droneFlying : ''}`}
      viewBox="0 0 96 48"
      aria-hidden="true"
    >
      <g className={styles.leftRotor}>
        <rect x="3" y="6" width="34" height="3" rx="1.5" />
      </g>
      <g className={styles.rightRotor}>
        <rect x="59" y="6" width="34" height="3" rx="1.5" />
      </g>
      <path className={styles.droneArm} d="M18 11 39 24M78 11 57 24" />
      <path className={styles.droneBody} d="M32 21h32l-5 15H37z" />
      <path className={styles.droneCanopy} d="M40 21c1-7 15-7 16 0z" />
      <path className={styles.droneLeg} d="m39 34-5 8m23-8 5 8" />
    </svg>
  );
}

export default function PIDDroneAnimation({ p, i, d }) {
  const points = useMemo(() => calculateResponse(p, i, d), [p, i, d]);
  const [progress, setProgress] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const safeProgress = Number.isFinite(progress) ? clamp(progress, 0, 1) : 0;
  const endIndex = points.findIndex((candidate) => candidate.time >= animationEndTime);
  const lastPointIndex = endIndex === -1 ? Math.max(points.length - 1, 0) : endIndex;
  const pointIndex = clamp(
    Math.round(safeProgress * lastPointIndex),
    0,
    lastPointIndex,
  );
  const point = points[pointIndex] ?? { time: 0, value: 0 };
  const height = clamp(point.value, 0, 75);
  const error = 50 - height;
  const absoluteError = Math.abs(error);
  const errorText = absoluteError < 0.05
    ? 'On target'
    : `${absoluteError.toFixed(1)} m ${error > 0 ? 'below' : 'above'}`;
  const heightPercent = (height / 75) * 100;
  const flightHeightPercent = 15 + heightPercent * 0.7;

  useEffect(() => {
    if (!isPlaying) {
      return undefined;
    }

    let animationFrame;
    let cancelled = false;
    const startedAt = performance.now();

    const animate = (now) => {
      if (cancelled) {
        return;
      }

      const nextProgress = clamp((now - startedAt) / playbackDuration, 0, 1);
      setProgress(nextProgress);

      if (nextProgress < 1) {
        animationFrame = requestAnimationFrame(animate);
      } else {
        setIsPlaying(false);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => {
      cancelled = true;
      cancelAnimationFrame(animationFrame);
    };
  }, [isPlaying]);

  useEffect(() => {
    setProgress(0);
    setIsPlaying(false);
  }, [p, i, d]);

  function handleRun() {
    if (isPlaying) {
      return;
    }

    setProgress(0);
    setIsPlaying(true);
  }

  return (
    <div className={styles.animation}>
      <div className={styles.flightScene}>
        <div className={styles.targetLine}>
          <span>Target: 50 m</span>
        </div>
        <div
          className={styles.dronePosition}
          style={{ '--drone-height': `${flightHeightPercent}%` }}
        >
          <DroneIcon isFlying={isPlaying} />
        </div>
        <div className={styles.ground} />
      </div>

      <div className={styles.footer}>
        <div className={styles.readout} aria-live="polite">
          <span className={styles.height}>
            Height: <strong>{height.toFixed(1)} m</strong>
          </span>
          <span className={styles.error}>
            Error: <strong>{errorText}</strong>
          </span>
        </div>
        <button
          className={styles.playButton}
          type="button"
          onClick={handleRun}
          disabled={isPlaying}
        >
          {isPlaying ? 'Running…' : safeProgress >= 1 ? 'Run again' : 'Run demo'}
        </button>
      </div>
    </div>
  );
}
