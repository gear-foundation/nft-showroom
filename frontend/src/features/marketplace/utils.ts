const isDecimal = (value: string) => {
  const decimalRegex = /^-?\d+\.\d+$/;

  return decimalRegex.test(value);
};

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

const getDurationOptions = () =>
  new Array(30).fill(undefined).map((_, index) => {
    const dayNumber = index + 1;

    const label = `${dayNumber} ${dayNumber === 1 ? 'day' : 'days'}`;
    const value = getMilliseconds(dayNumber, 'day').toString();

    return { label, value };
  });

export { isDecimal, getMilliseconds, getDurationOptions };
