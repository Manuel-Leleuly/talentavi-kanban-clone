import { useTicketContext } from "../context/ticketContext";

export const Search = () => {
  const { searchQuery, onQueryChange } = useTicketContext();

  return (
    <input
      type="text"
      name="searchTicket"
      placeholder="Search..."
      value={searchQuery}
      onChange={(e) => onQueryChange(e.target.value)}
      className="bg-white border border-gray-400 p-1 rounded-md"
    />
  );
};
