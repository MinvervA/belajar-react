import { useQuery } from "@tanstack/react-query";
import { createLazyFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import getPastOrders from "../api/getPastOrders";
import Modal from "../Modal";
import getPastOrder from "../api/getPastOrder";
import ErrorBoundary from "../ErrorBoundary";

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
  const [focusedOrder, setFocusedOrder] = useState();

  //   throw new Error("");

  const [page, setPage] = useState(1);

  const { isLoading: isLoadingFocusedOrder, data: focusedOrderData } = useQuery(
    {
      queryKey: ["past-order", focusedOrder],
      queryFn: () => getPastOrder(focusedOrder),
      enabled: !!focusedOrder,
      staleTime: 24 * 60 * 60 * 1000,
    },
  );

  const { isLoading, data } = useQuery({
    queryKey: ["past-orders", page],
    queryFn: () => getPastOrders(page),
    staleTime: 30000,
  });

  if (isLoading) {
    return (
      <div className="past-orders">
        <h2>sedang memuat...</h2>
      </div>
    );
  }

  return (
    <div className="past-orders">
      <table>
        <thead>
          <tr>
            <td>ID</td>
            <td>Data</td>
            <td>Time</td>
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
        <div className="">{page}</div>
        <button disabled={data.length < 10} onClick={() => setPage(page + 1)}>
          Next
        </button>
      </div>
      {focusedOrder ? (
        <Modal>
          <h2>Order # {focusedOrder}</h2>
          {!isLoadingFocusedOrder ? (
            <table>
              <thead>
                <tr>
                  <td>Image</td>
                  <td>Name</td>
                  <td>Size</td>
                  <td>Quantity</td>
                  <td>Price</td>
                  <td>Total</td>
                </tr>
              </thead>
              <tbody>
                {focusedOrderData?.orderItems.map((pizza) => (
                  <tr key={`${pizza.pizzaTypeId}_${pizza.name}`}>
                    <td>
                      <img src={pizza.image} alt={pizza} />
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
          ) : (
            <p>Sedang memuat ...</p>
          )}
        </Modal>
      ) : null}
    </div>
  );
}
