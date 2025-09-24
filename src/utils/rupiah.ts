export const formatRp = (amount: string | number): string => {
  const numberString = amount.toString().replace(/[^,\d]/g, '');
  const split = numberString.split(',');
  const remainder = split[0].length % 3;
  let rupiah = split[0].substr(0, remainder);
  const thousands = split[0].substr(remainder).match(/\d{3}/gi);

  if (thousands) {
    const separator = remainder ? '.' : '';
    rupiah += separator + thousands.join('.');
  }

  rupiah = split[1] !== undefined ? rupiah + ',' + split[1] : rupiah;

  return `Rp. ${rupiah}`;
};
