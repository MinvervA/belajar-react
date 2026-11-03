import type { PastOrderDetail } from "../APIResponseType";

export default async function getPastOrder(order: number) {
  const res = await fetch(`/api/past-order/${order}`);
  const data = (await res.json()) as PastOrderDetail;

  return data;
}
