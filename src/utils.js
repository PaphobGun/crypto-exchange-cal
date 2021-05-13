const formatAmount = (num, fixed) => {
  if (isNaN(num)) {
    return;
  }

  const stringNum = String(num);

  const isContainsDecimal = stringNum.includes('.');

  if (isContainsDecimal) {
    let integer;
    let decimal;

    integer = stringNum.split('.')[0];
    decimal = stringNum.split('.')[1];

    if (fixed) {
      const stringNumber = num.toFixed(fixed);
      integer = stringNumber.split('.')[0];
      decimal = stringNumber.split('.')[1];
    }
    return `${integer.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}.${decimal}`;
  } else {
    return `${num}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }
};

const parserFormatAmount = (value) => value.replace(/\$\s?|(,*)/g, '');

export { formatAmount, parserFormatAmount };
