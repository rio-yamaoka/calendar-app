"use client";

import { startOfWeek, addDays, format } from "date-fns";

import type { Event } from "@/types/event";

import { getDayEvents } from "@/lib/getDayEvents";

import DayColumn from "./DayColumn";

type Props = {
  currentDate: Date;

  selectedDate: Date;

  setSelectedDate: (date: Date) => void;

  events: Event[];

  onEventClick: (event: Event) => void;

  onEventDrop: (event: Event, newDate: Date) => void;

  setCurrentDate: (date: Date) => void;
};

export default function WeekView({
  currentDate,
  selectedDate,
  setSelectedDate,
  events,
  onEventClick,
  onEventDrop,
  setCurrentDate,
}: Props) {
  const startDate = startOfWeek(currentDate);

  const weekDays = [...Array(7)].map((_, i) => addDays(startDate, i));

  const timeSlots = Array.from({ length: 48 }, (_, i) => i);

  return (
    <div className="bg-white overflow-auto h-screen">
      {/* 上の日付 */}
      <div className="grid grid-cols-8 sticky top-0 bg-white z-50">
        <div className="border-r border-b h-14 bg-white" />

        {weekDays.map((day) => (
          <div
            key={format(day, "yyyy-MM-dd")}
            className="
              border-r
              border-b
              h-14
              flex
              flex-col
              items-center
              justify-center
              bg-white
            "
          >
            <div className="text-sm text-gray-500">{format(day, "(E)")}</div>

            <div className="font-bold text-lg">{format(day, "d")}</div>
          </div>
        ))}
      </div>

      {/* 本体 */}
      <div className="grid grid-cols-8">
        {/* 左時間 */}
        <div>
          {timeSlots.map((slot) => {
            const hour = Math.floor(slot / 2);

            const minute = slot % 2 === 0 ? "00" : "30";

            return (
              <div key={slot} className="relative h-10 border-r">
                {/* 横線 */}
                <div
                  className={`
                    absolute top-0 left-0 w-full
                    ${minute === "30" ? "border-t border-dashed" : "border-t"}
                  `}
                />

                {/* 時間 */}
                <div className="text-xs text-gray-500 px-1 pt-1">
                  {minute === "00" && `${String(hour).padStart(2, "0")}:00`}
                </div>
              </div>
            );
          })}
        </div>

        {/* 7日分 */}
        {weekDays.map((day) => {
          const dayEvents = getDayEvents(day, events);

          return (
            <DayColumn
              key={format(day, "yyyy-MM-dd")}
              day={day}
              events={dayEvents}
              selectedDate={selectedDate}
              setSelectedDate={setSelectedDate}
              onEventClick={onEventClick}
              onEventDrop={onEventDrop}
              setCurrentDate={setCurrentDate}
            />
          );
        })}
      </div>
    </div>
  );
}
