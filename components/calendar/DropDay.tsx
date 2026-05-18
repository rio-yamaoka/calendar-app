"use client";

import type { Event } from "@/types/event";

import { useDrop } from "react-dnd";

type Props = {
  children: (isOver: boolean) => React.ReactNode;

  day: Date;

  onEventDrop: (event: Event, newDate: Date) => void;
};

export default function DropDay({ children, day, onEventDrop }: Props) {
  const [{ isOver }, drop] = useDrop<
    { event: Event },
    void,
    { isOver: boolean }
  >(() => ({
    accept: "EVENT",

    drop: (item) => {
      onEventDrop(item.event, day);
    },

    collect: (monitor) => ({
      isOver: monitor.isOver({
        shallow: true,
      }),
    }),
  }));

  return (
    <div
      ref={(node) => {
        drop(node);
      }}
      className="h-full"
    >
      {children(isOver)}
    </div>
  );
}
