export type OrderByType = <O, K extends keyof O>(
  o: O,
  column: K,
  order?: 'desc' | 'asc',
) => any;

export const OrderBy: OrderByType =
  (o, column, order = 'desc') =>
  (tableName: string) =>
    `${tableName}.${column as string} ${order ? order : ''}`;
