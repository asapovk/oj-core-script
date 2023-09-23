export const makeFieldType = (tableName: string, fieldName: string): string => {
  const tableAndCol = `${tableName}_${fieldName}`;
  const upperC = tableAndCol
    .split('_')
    .map((n) => (n.length ? n[0].toUpperCase() + n.substring(1, n.length) : n))
    .join('');
  return upperC.length
    ? upperC[0].toLowerCase() + upperC.substring(1, upperC.length)
    : '';
};
