import { usePizzaOfTheDay } from "./usePizzaOfTheDay";

const intl = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

export default function PizzaOfTheDay() {
  const pizzaOfTheDay = usePizzaOfTheDay();

  if (!pizzaOfTheDay) {
    return <div className="">Sedang memuat...</div>;
  }

  return (
    <div className="border-t border-border mt-[50px] w-full ">
      <h2>Pizza of the day</h2>
      <div className="flex justify-center items-center">
        <div className="mr-[30px] leading-[2] text-center">
          <h3>{pizzaOfTheDay.name}</h3>
          <p>{pizzaOfTheDay.description}</p>
          <p className="pizza-of-the-day-price">
            From : <span>{intl.format(pizzaOfTheDay.sizes.S)}</span>
          </p>
        </div>
        <img
          src={pizzaOfTheDay.image}
          alt={pizzaOfTheDay.name}
          className="max-w-[200px] rounded-[5px] border border-border"
        />
      </div>
    </div>
  );
}
