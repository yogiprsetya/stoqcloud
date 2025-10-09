export const formatNumberWithSuffix = (num: number) => {
  if (num >= 1000000000) {
    return `Rp. ${(num / 1000000000).toFixed(1).replace(/\.0$/, '')}B`;
  }
  if (num >= 1000000) {
    return `Rp. ${(num / 1000000).toFixed(1).replace(/\.0$/, '')}M`;
  }
  if (num >= 1000) {
    return `Rp. ${(num / 1000).toFixed(1).replace(/\.0$/, '')}K`;
  }
  return `Rp. ${num.toString()}`;
};

export const formatNumberWithCommas = (num: number) => {
  return num.toLocaleString('en-US');
};
