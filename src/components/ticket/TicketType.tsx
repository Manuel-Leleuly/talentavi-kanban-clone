export const TicketType = ({ type }: { type: string }) => {
  return (
    <div className="rounded-md flex justify-start items-center w-fit bg-red-500">
      <div className="rounded-l-md w-[5px]" />
      <div className="px-1 w-fit bg-gray-100 text-sm font-bold rounded-r-md">
        {type}
      </div>
    </div>
  );
};
