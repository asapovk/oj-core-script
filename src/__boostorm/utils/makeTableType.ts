export const makeTableType = (tableName: string): string => {
  return tableName
    .split('_')
    .map((n) => (n.length ? n[0].toUpperCase() + n.substring(1, n.length) : n))
    .join('');
};
