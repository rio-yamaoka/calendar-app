"use client";

import { format } from "date-fns";

import { useDrag } from "react-dnd";

import type { Event } from "@/types/event";

type Props = {
  event: Event;
  dragStart?: Date;
  onEventClick: (event: Event) => void;
};

export default function DraggableEvent({
  event,
  dragStart,
  onEventClick,
}: Props) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "EVENT",

    item: { event, dragStart },

    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  return (
    <div
      ref={(node) => {
        drag(node);
      }}
      onClick={(e) => {
        e.stopPropagation();

        onEventClick(event);
      }}
      className={`
        w-full
        h-full
        text-xs
        select-none
        pointer-events-auto
        ${event.color || "bg-blue-400"}
        text-white
        rounded
        px-1
        overflow-hidden
        cursor-grab
        active:cursor-grabbing
        ${isDragging ? "opacity-40 pointer-events-none" : "pointer-events-auto"}
      `}
    >
      <div className="font-semibold">
        {format(event.start, "HH:mm")} - {format(event.end, "HH:mm")}
      </div>

      <div>{event.title}</div>
    </div>
  );
}
