const isDecimal = (value: string) => {
  const decimalRegex = /^-?\d+\.\d+$/;

  return decimalRegex.test(value);
};

export { isDecimal };
