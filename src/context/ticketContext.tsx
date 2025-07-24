import {
  createContext,
  useContext,
  useEffect,
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from "react";
import { useDebounce } from "use-debounce";
import { TicketResponseSchema, type Ticket } from "../models/ticket";

type TicketContextType = {
  tickets: Ticket[];
  isLoading: boolean;
  error: Error | null;
  fetchTickets: () => Promise<void>;
  updateTicket: (ticket: Ticket, newStatus: string) => void;
  ticketStatuses: string[];
  ticketData: Record<string, Ticket[]> | null;
  setTicketData: Dispatch<SetStateAction<Record<string, Ticket[]> | null>>;
  searchQuery: string;
  onQueryChange: (query: string) => void;
};

const TicketContext = createContext<TicketContextType>({} as TicketContextType);

export const useTicketContext = () => useContext(TicketContext);

export const TicketContextProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const [ticketStatuses, setTicketStatuses] = useState<string[]>([]);
  const [ticketData, setTicketData] = useState<Record<string, Ticket[]> | null>(
    null
  );

  const [searchQuery, setSearchQuery] = useState("");

  const [debounceQuery] = useDebounce(searchQuery, 1000);

  useEffect(() => {
    setTicketData(groupTicketByStatus(ticketStatuses));
  }, [debounceQuery, ticketStatuses, tickets]);

  const groupTicketByStatus = (
    statuses: string[]
  ): Record<string, Ticket[]> => {
    const result: Record<string, Ticket[]> = {};

    for (const status of statuses) {
      result[status] = [];
    }

    for (const ticket of tickets) {
      const query = debounceQuery.trim().toLowerCase();
      if (query !== "" && !ticket.title.toLowerCase().includes(query)) continue;
      result[ticket.status].push(ticket);
    }

    return result;
  };

  const fetchTickets = async () => {
    try {
      setIsLoading(true);
      setError(null);
      setTickets([]);

      const MOCK_URL = import.meta.env.VITE_MOCK_URL;
      if (!MOCK_URL) throw new Error("Mock URL not found");

      const response = await fetch(MOCK_URL);
      if (!response.ok) throw new Error("Failed to fetch tickets");

      const result = await response.json();
      const convertedResult = TicketResponseSchema.parse(result);

      const statuses = new Set<string>();
      for (const ticket of convertedResult.data) {
        statuses.add(ticket.status);
      }
      setTicketStatuses(Array.from(statuses));

      setTickets(convertedResult.data);
      setIsLoading(false);
    } catch (error) {
      setError(error as Error);
      setIsLoading(false);
    }
  };

  const updateTicket = (ticket: Ticket, newStatus: string) => {
    setTickets((prevTickets) => {
      const newTickets = Array.from(prevTickets);

      const selectedTicketIndex = newTickets.findIndex(
        (ticketData) => ticketData.title === ticket.title
      );
      if (selectedTicketIndex < 0) return prevTickets;

      newTickets[selectedTicketIndex].status = newStatus;
      return newTickets;
    });
  };

  const onQueryChange = (query: string) => setSearchQuery(query);

  return (
    <TicketContext.Provider
      value={{
        tickets,
        isLoading,
        error,
        fetchTickets,
        updateTicket,
        ticketStatuses,
        ticketData,
        setTicketData,
        searchQuery,
        onQueryChange,
      }}
    >
      {children}
    </TicketContext.Provider>
  );
};
