"use client";

import { useRef, useState, useEffect } from "react";

import { useDrop } from "react-dnd";

import type { Event } from "@/types/event";

type Props = {
  children: React.ReactNode;

  day: Date;

  onEventDrop: (event: Event, newDate: Date) => void;

  setCurrentDate: (date: Date) => void;
};

export default function DropColumn({
  children,
  day,
  onEventDrop,
  setCurrentDate,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);

  const [hoverSlot, setHoverSlot] = useState<number | null>(null);

  const [{ isOver }, drop] = useDrop<
    { event: Event },
    void,
    {
      isOver: boolean;
    }
  >(
    () => ({
      accept: "EVENT",

      hover: (_, monitor) => {
        const clientOffset = monitor.getClientOffset();

        if (!clientOffset || !ref.current) return;

        const rect = ref.current.getBoundingClientRect();

        const y = clientOffset.y - rect.top - 20;

        const rawSlot = Math.floor(y / 40);

        setHoverSlot(rawSlot);
      },

      drop: (item, monitor) => {
        const clientOffset = monitor.getClientOffset();

        if (!clientOffset || !ref.current) return;

        const rect = ref.current.getBoundingClientRect();

        const y = clientOffset.y - rect.top;

        const rawSlot = Math.floor(y / 40);

        const dayOffset = Math.floor(rawSlot / 48);

        const slot = ((rawSlot % 48) + 48) % 48;

        const hour = Math.floor(slot / 2);

        const minute = slot % 2 === 0 ? 0 : 30;

        const newDate = new Date(day);

        newDate.setDate(newDate.getDate() + dayOffset);

        newDate.setHours(hour);

        newDate.setMinutes(minute);

        newDate.setSeconds(0);

        newDate.setMilliseconds(0);

        onEventDrop(item.event, newDate);

        // 翌日なら表示日も移動
        setCurrentDate(new Date(newDate));

        setHoverSlot(null);
      },

      collect: (monitor) => ({
        isOver: monitor.isOver(),
      }),
    }),
    [day],
  );

  useEffect(() => {
    if (!isOver) {
      setHoverSlot(null);
    }
  }, [isOver]);

  drop(ref);

  return (
    <div
      ref={ref}
      className="
        relative
        flex-1
        min-w-0
        min-h-[1920px]
      "
    >
      {isOver && hoverSlot !== null && (
        <div
          style={{
            top: `${hoverSlot * 40}px`,
          }}
          className="
              absolute
              left-0
              w-full
              border-t-2
              border-green-500
              z-50
              pointer-events-none
            "
        />
      )}

      {children}
    </div>
  );
}
