function getMilliseconds(value: number, unit: 'second' | 'minute' | 'hour' | 'day') {
  const MULTIPLIER = { MS: 1000, S: 60, M: 60, H: 24 };

  const UNIT_MULTIPLIER = {
    second: MULTIPLIER.MS,
    minute: MULTIPLIER.MS * MULTIPLIER.S,
    hour: MULTIPLIER.MS * MULTIPLIER.S * MULTIPLIER.M,
    day: MULTIPLIER.MS * MULTIPLIER.S * MULTIPLIER.M * MULTIPLIER.H,
  };

  return value * UNIT_MULTIPLIER[unit];
}

export { getMilliseconds };
