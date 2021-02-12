const formatAmount = (num) => {
  if (isNaN(num)) {
    return;
  }

  return `${num}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

export { formatAmount };
