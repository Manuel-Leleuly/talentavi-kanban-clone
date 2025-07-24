import { useDroppable } from "@dnd-kit/core";
import { SortableContext, rectSortingStrategy } from "@dnd-kit/sortable";
import type { ReactNode } from "react";

export const Column = ({
  title,
  color,
  ticketIds,
  children,
  total,
}: {
  title: string;
  color: string;
  ticketIds: string[];
  children: ReactNode;
  total: number;
}) => {
  const { setNodeRef } = useDroppable({ id: title });

  return (
    <SortableContext
      id={title}
      items={ticketIds}
      strategy={rectSortingStrategy}
    >
      <div ref={setNodeRef}>
        <div className="min-w-[300px] rounded-t-md m-3">
          <div
            className="p-3 rounded-t-md text-white"
            style={{ backgroundColor: color }}
          >
            {title} {total}
          </div>
          <div className="p-3 bg-gray-200 h-fit flex flex-col items-center">
            {children}
          </div>
        </div>
      </div>
    </SortableContext>
  );
};
