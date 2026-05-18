"use client";

import { format } from "date-fns";

import type { Event } from "@/types/event";

import { getDayEvents } from "@/lib/getDayEvents";

type Props = {
  date: Date;
  events: Event[];
  onClose: () => void;
  onEventClick: (event: Event) => void;
};

export default function DayEventsModal({
  date,
  events,
  onClose,
  onEventClick,
}: Props) {
  const dayEvents = getDayEvents(date, events);

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-[500px] max-h-[80vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">{format(date, "M月d日 (E)")}</h2>

          <button onClick={onClose}>✕</button>
        </div>

        <div className="space-y-3">
          {dayEvents.map((event) => (
            <div
              key={event.id}
              onClick={() => onEventClick(event)}
              className={`p-3 rounded cursor-pointer text-white ${
                event.color || "bg-blue-400"
              }`}
            >
              <div className="font-semibold text-sm">
                {format(event.start, "MM/dd HH:mm")}
                {" - "}
                {format(event.end, "MM/dd HH:mm")}
              </div>

              <div className="font-bold">{event.title}</div>

              {event.description && (
                <div className="text-xs mt-1 opacity-90">
                  {event.description}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
