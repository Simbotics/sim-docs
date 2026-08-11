import React, { useMemo, useState } from 'react';
import styles from './styles.module.css';

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

function calculateResponse(kp, ki, kd) {
  const dt = 0.02;
  const setPoint = 50;
  let value = 0;
  let velocity = 0;
  let integral = 0;
  let previousError = setPoint;
  const points = [];

  for (let step = 0; step <= 750; step += 1) {
    const time = step * dt;
    const error = setPoint - value;
    integral = clamp(integral + error * dt, -150, 150);
    const derivative = (error - previousError) / dt;
    const output = clamp(kp * error * 20 + ki * integral + kd * derivative, -100, 100);

    const acceleration = output * 0.75 - velocity * 0.8 - value * 0.02;
    velocity += acceleration * dt;
    value = clamp(value + velocity * dt, 0, 75) - 0.4 + ki;
    previousError = error;
    points.push({ time, value });
  }

  return points;
}

function Slider({ label, value, max, step, onChange }) {
  return (
    <label className={styles.control}>
      <span>{label}</span>
      <input
        type="range"
        min="0"
        max={max}
        step={step}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
      />
      <output>{value.toFixed(2)}</output>
    </label>
  );
}

function Chart({ points }) {
  const width = 760;
  const height = 330;
  const left = 48;
  const right = 18;
  const top = 18;
  const bottom = 38;
  const plotWidth = width - left - right;
  const plotHeight = height - top - bottom;
  const x = (time) => left + (time / 15) * plotWidth;
  const y = (value) => top + (1 - value / 75) * plotHeight;
  const responsePath = points
    .map((point, index) => `${index === 0 ? 'M' : 'L'} ${x(point.time).toFixed(1)} ${y(point.value).toFixed(1)}`)
    .join(' ');

  return (
    <svg className={styles.chart} viewBox={`0 0 ${width} ${height}`} role="img" aria-label="PID response graph">
      {[0, 25, 50, 75].map((tick) => (
        <g key={tick}>
          <line className={styles.grid} x1={left} x2={width - right} y1={y(tick)} y2={y(tick)} />
          <text className={styles.label} x={left - 9} y={y(tick) + 4} textAnchor="end">{tick}</text>
        </g>
      ))}
      {[0, 3, 6, 9, 12, 15].map((tick) => (
        <g key={tick}>
          <line className={styles.grid} x1={x(tick)} x2={x(tick)} y1={top} y2={height - bottom} />
          <text className={styles.label} x={x(tick)} y={height - 12} textAnchor="middle">{tick}s</text>
        </g>
      ))}
      <line className={styles.setPoint} x1={left} x2={width - right} y1={y(50)} y2={y(50)} />
      <path className={styles.response} d={responsePath} />
      <text className={styles.axisTitle} transform={`translate(14 ${height / 2}) rotate(-90)`} textAnchor="middle">Set point</text>
      <g className={styles.legend}>
        <line x1="570" x2="592" y1="30" y2="30" className={styles.response} />
        <text x="598" y="34">Response</text>
        <line x1="660" x2="682" y1="30" y2="30" className={styles.setPoint} />
        <text x="688" y="34">Set point</text>
      </g>
    </svg>
  );
}

export default function PIDSimulator({ p, i, d }) {
  const [kp, setKp] = useState(p);
  const [ki, setKi] = useState(i);
  const [kd, setKd] = useState(d);
  const points = useMemo(() => calculateResponse(kp, ki, kd), [kp, ki, kd]);

  return (
    <div className={styles.simulator}>
      <div className={styles.controls}>
        <Slider label={<>K<sub>p</sub></>} value={kp} max={2} step={0.05} onChange={setKp} />
        <Slider label={<>K<sub>i</sub></>} value={ki} max={4} step={0.01} onChange={setKi} />
        <Slider label={<>K<sub>d</sub></>} value={kd} max={4} step={0.01} onChange={setKd} />
      </div>
      <Chart points={points} />
    </div>
  );
}
