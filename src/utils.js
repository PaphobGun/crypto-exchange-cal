const formatAmount = (num) => {
  if (isNaN(num)) {
    return;
  }

  const stringNum = String(num);

  const isContainsDecimal = stringNum.includes('.');

  if (isContainsDecimal) {
    const integer = stringNum.split('.')[0];
    const decimal = stringNum.split('.')[1];
    return `${integer.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}.${decimal}`;
  } else {
    return `${num}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }
};

export { formatAmount };
