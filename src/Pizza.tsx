interface Props {
  name: string;
  description: string;
  image?: string;
}

export const Pizza = (props: Props) => {
  return (
    <div className="flex flex-col justify-center items-center leading-normal">
      <h1 className="text-[25px] font-normal text-secondary">{props.name}</h1>
      <p className="mb-[5px]">{props.description}</p>
      <img
        className="max-w-[200px] rounded-[5px] border-border"
        src={props.image ? props.image : "https://picsum.photos/200"}
        alt={props.name}
      />
    </div>
  );
};

//  flex justify-center items-center
