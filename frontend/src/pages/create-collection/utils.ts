const getTimer = (ms: number) => {
  // TODO: global constants
  const MULTIPLIER = { MS: 1000, S: 60, M: 60, H: 24 };

  const seconds = Math.floor((ms / MULTIPLIER.MS) % MULTIPLIER.S);
  const minutes = Math.floor((ms / (MULTIPLIER.MS * MULTIPLIER.S)) % MULTIPLIER.M);
  const hours = Math.floor((ms / (MULTIPLIER.MS * MULTIPLIER.S * MULTIPLIER.M)) % MULTIPLIER.H);

  const getDoubleDigits = (value: number) => (value < 10 ? `0${value}` : value.toString());

  return `${getDoubleDigits(hours)}:${getDoubleDigits(minutes)}:${getDoubleDigits(seconds)}`;
};

export { getTimer };
