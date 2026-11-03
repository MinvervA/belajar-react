import { useQuery } from "@tanstack/react-query";
import { createLazyFileRoute } from "@tanstack/react-router";
import { useState } from "react";

import getPastOrders from "../api/getPastOrders";
import getPastOrder from "../api/getPastOrder";
import Modal from "../Modal";
import ErrorBoundary from "../ErrorBoundary";
import type { PastOrder, PastOrderDetail } from "../APIResponseType";

export const Route = createLazyFileRoute("/past")({
  component: ErrorBoundaryWrappedPastOrdersRoute,
});

function ErrorBoundaryWrappedPastOrdersRoute() {
  return (
    <ErrorBoundary>
      <PastOrdersRoute />
    </ErrorBoundary>
  );
}

const intl = Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

function PastOrdersRoute() {
  const [focusedOrder, setFocusedOrder] = useState<number>();
  const [page, setPage] = useState<number>(1);

  // Query untuk mengambil detail pesanan yang dipilih
  const { data: focusedOrderData, isError: isFocusedOrderError } =
    useQuery<PastOrderDetail>({
      queryKey: ["past-order", focusedOrder],
      queryFn: () => getPastOrder(focusedOrder),
      enabled: focusedOrder !== undefined,
      staleTime: 24 * 60 * 60 * 1000,
    });

  // Query untuk mengambil daftar riwayat pesanan
  const { isLoading, data } = useQuery<PastOrder[]>({
    queryKey: ["past-orders", page],
    queryFn: () => getPastOrders(page),
    staleTime: 30000,
  });

  if (isLoading) {
    return (
      <div className="past-orders">
        <h2>Sedang memuat...</h2>
      </div>
    );
  }

  // Loading selesai tidak menjamin data tersedia
  if (!data) {
    throw new Error("Past orders could not be loaded");
  }

  return (
    <div className="past-orders">
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Date</th>
            <th>Time</th>
          </tr>
        </thead>

        <tbody>
          {data.map((order) => (
            <tr key={order.order_id}>
              <td>
                <button onClick={() => setFocusedOrder(order.order_id)}>
                  {order.order_id}
                </button>
              </td>

              <td>{order.date}</td>
              <td>{order.time}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="pages">
        <button disabled={page <= 1} onClick={() => setPage(page - 1)}>
          Previous
        </button>

        <div>{page}</div>

        <button disabled={data.length < 10} onClick={() => setPage(page + 1)}>
          Next
        </button>
      </div>

      {focusedOrder !== undefined ? (
        <Modal>
          <h2>Order # {focusedOrder}</h2>

          {focusedOrderData ? (
            <table>
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Name</th>
                  <th>Size</th>
                  <th>Quantity</th>
                  <th>Price</th>
                  <th>Total</th>
                </tr>
              </thead>

              <tbody>
                {focusedOrderData.orderItems.map((pizza, index) => (
                  <tr key={`${pizza.pizzaTypeId}_${pizza.size}_${index}`}>
                    <td>
                      <img src={pizza.image} alt={pizza.name} />
                    </td>
                    <td>{pizza.name}</td>
                    <td>{pizza.size}</td>
                    <td>{pizza.quantity}</td>
                    <td>{intl.format(pizza.price)}</td>
                    <td>{intl.format(pizza.total)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : isFocusedOrderError ? (
            <p>Gagal memuat detail pesanan.</p>
          ) : (
            <p>Sedang memuat...</p>
          )}

          <button onClick={() => setFocusedOrder(undefined)}>Close</button>
        </Modal>
      ) : null}
    </div>
  );
}
