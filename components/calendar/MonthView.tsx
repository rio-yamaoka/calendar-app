"use client";

import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  format,
  isSameMonth,
  isToday,
  isSameDay,
} from "date-fns";

import type { Event } from "@/types/event";

import { getDayEvents } from "@/lib/getDayEvents";

import DraggableEvent from "./DraggableEvent";

import DropDay from "./DropDay";

type Props = {
  currentDate: Date;
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
  events: Event[];
  onEventClick: (event: Event) => void;
  onMoreClick: (date: Date) => void;
  onEventDrop: (event: Event, newDate: Date) => void;
};

export default function MonthView({
  currentDate,
  selectedDate,
  setSelectedDate,
  events,
  onEventClick,
  onMoreClick,
  onEventDrop,
}: Props) {
  const startMonth = startOfMonth(currentDate);

  const endMonth = endOfMonth(currentDate);

  const startDate = startOfWeek(startMonth);

  const endDate = endOfWeek(endMonth);

  const days = eachDayOfInterval({
    start: startDate,
    end: endDate,
  });

  const weekDays = ["日", "月", "火", "水", "木", "金", "土"];

  return (
    <>
      {/* 曜日 */}
      <div className="bg-white grid grid-cols-7 gap-2">
        {weekDays.map((day) => (
          <div key={day} className="text-center font-bold">
            {day}
          </div>
        ))}
      </div>

      {/* カレンダー */}
      <div className="bg-white grid grid-cols-7 border-l border-t border-gray-300">
        {days.map((day, i) => {
          const isCurrentMonth = isSameMonth(day, currentDate);

          const isTodayDate = isToday(day);

          const isSelected = isSameDay(day, selectedDate);

          return (
            <DropDay key={i} day={day} onEventDrop={onEventDrop}>
              {(isOver) => (
                <div
                  onClick={() => setSelectedDate(day)}
                  className={`border-r border-b border-gray-300 h-24 p-1 text-sm cursor-pointer ${
                    isOver
                      ? "bg-green-100"
                      : isTodayDate
                        ? "bg-blue-100"
                        : isCurrentMonth
                          ? "bg-white"
                          : "bg-gray-200"
                  } ${isSelected ? "ring-2 ring-black z-10 relative" : ""}`}
                >
                  <div>{format(day, "d")}</div>

                  <div className="mt-1 space-y-1 overflow-hidden">
                    {(() => {
                      const dayEvents = getDayEvents(day, events);

                      const visibleEvents = dayEvents.slice(0, 1);

                      const hiddenCount = dayEvents.length - 1;

                      return (
                        <>
                          {/* 表示するイベント */}
                          {visibleEvents.map((event) => (
                            <DraggableEvent
                              key={event.id}
                              event={event}
                              onEventClick={onEventClick}
                            />
                          ))}

                          {/* +件数 */}
                          {hiddenCount > 0 && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();

                                onMoreClick(day);
                              }}
                              className="
                                w-full
                                text-xs
                                bg-gray-100
                                rounded
                                px-1
                                py-1
                                hover:bg-gray-200
                              "
                            >
                              +{hiddenCount}
                            </button>
                          )}
                        </>
                      );
                    })()}
                  </div>
                </div>
              )}
            </DropDay>
          );
        })}
      </div>
    </>
  );
}
