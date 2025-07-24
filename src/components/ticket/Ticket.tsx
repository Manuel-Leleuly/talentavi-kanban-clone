import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { Ticket as TicketData } from "../../models/ticket";
import { Avatar } from "./Avatar";
import { TicketType } from "./TicketType";

export const Ticket = ({ ticketData }: { ticketData: TicketData }) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({
      id: ticketData.title,
    });

  const devs = ticketData.developer.split(", ").filter(Boolean);

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className="w-[250px] h-fit bg-white rounded-md shadow-md shadow-gray-500 p-4 my-2 text-sm flex flex-col gap-2 hover:cursor-pointer"
    >
      <div>{ticketData.title}</div>
      <div>{ticketData.status}</div>
      <TicketType type={ticketData.type} />
      <div className="relative flex items-center justify-start">
        {devs.map((dev, index) => (
          <Avatar
            name={dev}
            key={dev}
            className={`${index > 0 ? `absolute left-[${20 * index}px]` : ""}`}
          />
        ))}
      </div>
    </div>
  );
};
