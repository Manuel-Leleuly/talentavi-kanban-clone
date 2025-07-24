import {
  KeyboardSensor,
  MouseSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragOverEvent,
} from "@dnd-kit/core";
import { arrayMove, sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { useTicketContext } from "../context/ticketContext";

export const useDragAndDrop = () => {
  const { ticketData, setTicketData } = useTicketContext();
  const sensors = useSensors(
    useSensor(MouseSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    if (!ticketData) return;
    const { active, over } = event;
    const activeId = active.id.toString();
    const overId = over ? over.id.toString() : null;
    const activeColumn = active.data.current?.sortable.containerId ?? null;
    const overColumn = over?.data.current?.sortable.containerId ?? null;
    if (!activeColumn || !overColumn || activeColumn !== overColumn) return;

    const activeIndex = ticketData[activeColumn].findIndex(
      (ticket) => ticket.title === activeId
    );
    const overIndex = ticketData[overColumn].findIndex(
      (ticket) => ticket.title === overId
    );
    if (activeIndex === overIndex) return;
    setTicketData((prevTicketData) => {
      const newTicketData = { ...prevTicketData };
      newTicketData[activeColumn] = arrayMove(
        newTicketData[overColumn],
        activeIndex,
        overIndex
      );
      return newTicketData;
    });
  };

  const handleDragOver = (event: DragOverEvent) => {
    if (!ticketData) return;
    const { active, over, delta } = event;
    const activeId = active.id.toString();
    const overId = over?.id.toString() ?? null;
    const activeColumn = active.data.current?.sortable.containerId ?? null;
    const overColumn = over?.data.current?.sortable.containerId ?? null;

    if (!activeColumn || !overColumn || activeColumn === overColumn) return;

    setTicketData((prevTicketData) => {
      const newTicketData = { ...prevTicketData };
      const activeTickets = newTicketData[activeColumn];
      const overTickets = newTicketData[overColumn];
      const activeIndex = activeTickets.findIndex(
        (ticket) => ticket.title === activeId
      );
      const overIndex = overTickets.findIndex(
        (ticket) => ticket.title === overId
      );

      const newIndex = () => {
        const putOnBelowLastItem =
          overIndex === overTickets.length - 1 && delta.y > 0;
        const modifier = putOnBelowLastItem ? 1 : 0;
        return overIndex >= 0 ? overIndex + modifier : overTickets.length + 1;
      };

      newTicketData[activeColumn] = newTicketData[activeColumn].filter(
        (ticket) => ticket.title !== activeId
      );
      newTicketData[overColumn] = overTickets
        .slice(0, newIndex())
        .concat(activeTickets[activeIndex])
        .concat(overTickets.slice(newIndex()));

      return newTicketData;
    });
  };

  return {
    sensors,
    handleDragEnd,
    handleDragOver,
  };
};
