import confetti from 'canvas-confetti';

export function fireBotanicalConfetti() {
  const count = 40;
  const defaults = {
    origin: { y: 0.75 },
    zIndex: 9999,
  };

  function fire(particleRatio, opts) {
    confetti({
      ...defaults,
      ...opts,
      particleCount: Math.floor(count * particleRatio),
      colors: ['#4a6b53', '#88a892', '#c48b64', '#f1cf7c', '#e28d99', '#fbf9f5'],
    });
  }

  fire(0.35, {
    spread: 60,
    velocity: 28,
  });
  fire(0.25, {
    spread: 80,
    velocity: 35,
  });
  fire(0.2, {
    spread: 100,
    decay: 0.91,
    scalar: 0.8,
  });
  fire(0.1, {
    spread: 120,
    startVelocity: 25,
    decay: 0.92,
    scalar: 1.2,
  });
  fire(0.1, {
    spread: 120,
    startVelocity: 45,
  });
}
