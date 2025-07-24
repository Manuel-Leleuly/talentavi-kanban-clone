import { closestCorners, DndContext } from "@dnd-kit/core";
import classNames from "classnames";
import { useEffect } from "react";
import { Column } from "./components/Column";
import { Search } from "./components/Search";
import { Ticket } from "./components/ticket/Ticket";
import { useTicketContext } from "./context/ticketContext";
import { useDragAndDrop } from "./hooks/useDragAndDrop";

function App() {
  const { fetchTickets, isLoading, error, tickets, ticketData } =
    useTicketContext();
  const { sensors, handleDragEnd, handleDragOver } = useDragAndDrop();

  useEffect(() => {
    fetchTickets();
  }, []);

  if (isLoading) {
    return <Fallback message="Loading..." />;
  }

  if (error) {
    return <Fallback message={error.message} />;
  }

  if (!tickets || !ticketData) {
    return <Fallback message="There are no tickets available" />;
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragEnd={handleDragEnd}
      onDragOver={handleDragOver}
    >
      <div className="py-2 px-3">
        <Search />
      </div>
      <div className="flex justify-start items-start overflow-auto">
        {Object.keys(ticketData).map((ticketStatus) => {
          const selectedTicketData = ticketData[ticketStatus];
          const total = selectedTicketData.length;
          const title = ticketStatus;
          const ticketIds = selectedTicketData.map(
            (ticketData) => ticketData.title
          );

          return (
            <Column
              title={title}
              color={generateColumnHeaderColor(ticketStatus)}
              ticketIds={ticketIds}
              key={`${title} ${total}`}
              total={total}
            >
              {selectedTicketData.map((ticket, index) => (
                <Ticket ticketData={ticket} key={`${ticket.title}-${index}`} />
              ))}
            </Column>
          );
        })}
      </div>
    </DndContext>
  );
}

export default App;

// extra components
const Fallback = ({ message }: { message: string }) => {
  return (
    <div
      className={classNames(
        "absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center"
      )}
    >
      {message}
    </div>
  );
};

// helper
const generateColumnHeaderColor = (status: string) => {
  switch (status.toLowerCase()) {
    case "in progress":
      return "#038cfc";
    case "ready to start":
      return "#fcad03";
    case "waiting for review":
      return "#7f03fc";
    case "done":
      return "#3c7004";
    case "stuck":
      return "#9e0606";
    case "pending deploy":
      return "#94069e";
    default:
      return "#000000";
  }
};
