import { skipToken } from "@reduxjs/toolkit/query";
import { createLazyFileRoute } from "@tanstack/react-router";
import { useState } from "react";

import { useGetPastOrdersQuery, useGetPastOrderQuery } from "../api/pizzaApi";
import Modal from "../Modal";
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
  const [focusedOrder, setFocusedOrder] = useState<number>();
  const [page, setPage] = useState<number>(1);

  const { currentData: focusedOrderData, isError: isFocusedOrderError } =
    useGetPastOrderQuery(focusedOrder ?? skipToken, {
      refetchOnMountOrArgChange: 24 * 60 * 60,
    });
  // currentData prevents old page rows appearing under the new page number.
  const {
    currentData: data,
    isFetching,
    isError,
  } = useGetPastOrdersQuery(page, {
    refetchOnMountOrArgChange: 30,
  });

  if (!data && isFetching) {
    return (
      <div className="mx-auto min-h-[650px] w-[90%] max-w-[900px]">
        <h2>Sedang memuat...</h2>
      </div>
    );
  }
  // let databaru = false;
  // Loading selesai tidak menjamin data tersedia
  if (isError || !data) {
    throw new Error("Past orders could not be loaded");
  }

  return (
    <div className="mx-auto min-h-[650px] w-[90%] max-w-[900px]">
      <div
        className="overflow-x-auto"
        tabIndex={0}
        role="region"
        aria-label="Orders table"
      >
        <table className="my-[25px] w-full min-w-[400px] border-collapse border border-[#ddd] font-sans text-[0.9em]">
          <thead className="bg-secondary text-white">
            <tr>
              <th scope="col" className="px-3 py-3 text-center sm:px-[15px]">
                ID
              </th>
              <th scope="col" className="px-3 py-3 text-center sm:px-[15px]">
                Date
              </th>
              <th scope="col" className="px-3 py-3 text-center sm:px-[15px]">
                Time
              </th>
            </tr>
          </thead>

          <tbody>
            {data.map((order) => (
              <tr
                key={order.order_id}
                className="border-b border-[#ddd] even:bg-[#f6fef0] last:border-b-2 last:border-secondary hover:bg-secondary/10"
              >
                <td className="px-3 py-3 text-center sm:px-[15px]">
                  <button
                    className="btn"
                    onClick={() => setFocusedOrder(order.order_id)}
                  >
                    {order.order_id}
                  </button>
                </td>

                <td className="px-3 py-3 text-center sm:px-[15px]">
                  {order.date}
                </td>
                <td className="px-3 py-3 text-center sm:px-[15px]">
                  {order.time}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-evenly gap-2">
        <button
          className="btn"
          disabled={page <= 1}
          onClick={() => setPage(page - 1)}
        >
          Previous
        </button>

        <div
          className="font-pacifico text-[20px] text-primary"
          aria-live="polite"
        >
          {page}
        </div>

        <button
          className="btn"
          disabled={data.length < 10}
          onClick={() => setPage(page + 1)}
        >
          Next
        </button>
      </div>

      {focusedOrder !== undefined ? (
        <Modal>
          <h2>Order # {focusedOrder}</h2>

          {focusedOrderData ? (
            <div
              className="overflow-x-auto"
              tabIndex={0}
              role="region"
              aria-label="Orders table"
            >
              <table className="my-[25px] w-full min-w-[400px] border-collapse border border-[#ddd] font-sans text-[0.9em]">
                <thead className="bg-secondary text-white">
                  <tr>
                    <th
                      scope="col"
                      className="px-3 py-3 text-center sm:px-[15px]"
                    >
                      Image
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3 text-center sm:px-[15px]"
                    >
                      Name
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3 text-center sm:px-[15px]"
                    >
                      Size
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3 text-center sm:px-[15px]"
                    >
                      Quantity
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3 text-center sm:px-[15px]"
                    >
                      Price
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3 text-center sm:px-[15px]"
                    >
                      Total
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {focusedOrderData.orderItems.map((pizza, index) => (
                    <tr
                      key={`${pizza.pizzaTypeId}_${pizza.size}_${index}`}
                      className="border-b border-[#ddd] even:bg-[#f6fef0] last:border-b-2 last:border-secondary hover:bg-secondary/10"
                    >
                      <td className="px-3 py-3 text-center sm:px-[15px]">
                        <img
                          className="w-[50px] max-w-none"
                          src={pizza.image}
                          alt={pizza.name}
                        />
                      </td>
                      <td className="px-3 py-3 text-center sm:px-[15px]">
                        {pizza.name}
                      </td>
                      <td className="px-3 py-3 text-center sm:px-[15px]">
                        {pizza.size}
                      </td>
                      <td className="px-3 py-3 text-center sm:px-[15px]">
                        {pizza.quantity}
                      </td>
                      <td className="px-3 py-3 text-center sm:px-[15px]">
                        {intl.format(pizza.price)}
                      </td>
                      <td className="px-3 py-3 text-center sm:px-[15px]">
                        {intl.format(pizza.total)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : isFocusedOrderError ? (
            <p>Gagal memuat detail pesanan.</p>
          ) : (
            <p>Sedang memuat...</p>
          )}

          <button className="btn" onClick={() => setFocusedOrder(undefined)}>
            Close
          </button>
        </Modal>
      ) : null}
    </div>
  );
}
