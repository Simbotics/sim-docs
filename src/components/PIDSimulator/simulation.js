const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

export function calculateResponse(kp, ki, kd) {
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
