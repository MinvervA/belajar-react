import { useGetPizzaOfTheDayQuery } from "./api/pizzaApi";

export const usePizzaOfTheDay = () => {
  const { data } = useGetPizzaOfTheDayQuery();
  return data ?? null;
};
