import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type {
  CartItem,
  PastOrder,
  PastOrderDetail,
  Pizza,
} from "../APIResponseType";

export interface ContactMessage {
  name: string;
  email: string;
  message: string;
}

export const pizzaApi = createApi({
  reducerPath: "pizzaApi",
  baseQuery: fetchBaseQuery({
    baseUrl: new URL("/api/", window.location.origin).href,
  }),
  tagTypes: ["PastOrders"],
  endpoints: (builder) => ({
    getPizzas: builder.query<Pizza[], void>({
      query: () => "pizzas",
    }),
    getPizzaOfTheDay: builder.query<Pizza, void>({
      query: () => "pizza-of-the-day",
    }),
    getPastOrders: builder.query<PastOrder[], number>({
      query: (page) => `past-orders?page=${page}`,
      providesTags: ["PastOrders"],
    }),
    getPastOrder: builder.query<PastOrderDetail, number>({
      query: (id) => `past-order/${id}`,
      keepUnusedDataFor: 24 * 60 * 60,
    }),
    placeOrder: builder.mutation<unknown, { cart: CartItem[] }>({
      query: (body) => ({ url: "order", method: "POST", body }),
      // Failed checkout must not clear or invalidate the user's current data.
      invalidatesTags: (_result, error) => (error ? [] : ["PastOrders"]),
    }),
    postContact: builder.mutation<unknown, ContactMessage>({
      query: (body) => ({ url: "contact", method: "POST", body }),
    }),
  }),
});

export const {
  useGetPizzasQuery,
  useGetPizzaOfTheDayQuery,
  useGetPastOrdersQuery,
  useGetPastOrderQuery,
  usePlaceOrderMutation,
  usePostContactMutation,
} = pizzaApi;
