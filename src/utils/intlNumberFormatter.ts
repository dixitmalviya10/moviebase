const intlNumberFormatter = (number: number) => {
  return new Intl.NumberFormat().format(number);
};

export default intlNumberFormatter;
