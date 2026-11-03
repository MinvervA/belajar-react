import type { PastOrder } from "../APIResponseType";

export default async function getPastOrders(
  page: number,
): Promise<PastOrder[]> {
  const res = await fetch(`api/past-orders?page=${page}`);
  const data = (await res.json()) as PastOrder[];

  return data;
}
