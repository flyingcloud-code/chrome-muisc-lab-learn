export function createStepSequence(length) {
  if (!Number.isInteger(length) || length <= 0) {
    throw new Error('Sequencer length must be a positive integer');
  }

  let index = 0;
  return {
    current() {
      return index;
    },
    next() {
      index = (index + 1) % length;
      return index;
    },
    reset() {
      index = 0;
      return index;
    },
  };
}

export function createLoop({ steps, bpm, onStep }) {
  let timer = null;
  const sequence = createStepSequence(steps);
  const interval = () => 60000 / bpm / 2;

  return {
    start() {
      if (timer) return;
      onStep(sequence.current());
      timer = setInterval(() => onStep(sequence.next()), interval());
    },
    stop() {
      clearInterval(timer);
      timer = null;
      sequence.reset();
    },
    isRunning() {
      return Boolean(timer);
    },
  };
}
