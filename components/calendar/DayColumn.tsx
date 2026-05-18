"use client";

import { isSameDay } from "date-fns";

import type { Event } from "@/types/event";

import DraggableEvent from "./DraggableEvent";
import DropColumn from "./DropColumn";

type Props = {
  day: Date;

  events: Event[];

  selectedDate: Date;

  setSelectedDate: (date: Date) => void;

  setCurrentDate: (date: Date) => void;

  onEventClick: (event: Event) => void;

  onEventDrop: (event: Event, newDate: Date) => void;
};

export default function DayColumn({
  day,
  events,
  selectedDate,
  setSelectedDate,
  onEventClick,
  onEventDrop,
  setCurrentDate,
}: Props) {
  const timeSlots = Array.from({ length: 48 }, (_, i) => i);

  return (
    <DropColumn
      day={day}
      onEventDrop={onEventDrop}
      setCurrentDate={setCurrentDate}
    >
      <div className="relative border-r">
        {/* 背景グリッド */}
        <div>
          {timeSlots.map((slot) => {
            const hour = Math.floor(slot / 2);

            const minute = slot % 2 === 0 ? "00" : "30";

            const isSelected =
              isSameDay(day, selectedDate) &&
              selectedDate.getHours() === hour &&
              selectedDate.getMinutes() === (minute === "30" ? 30 : 0);

            return (
              <div
                key={slot}
                onClick={() => {
                  const clickedDate = new Date(day);

                  clickedDate.setHours(hour);

                  clickedDate.setMinutes(minute === "30" ? 30 : 0);

                  setSelectedDate(clickedDate);
                }}
                className={`
                    relative
                    h-10
                    cursor-pointer
                    hover:bg-blue-50
                    ${isSelected ? "ring-2 ring-black z-10" : ""}
                  `}
              >
                <div
                  className={`
                      absolute
                      top-0
                      left-0
                      w-full
                      ${minute === "30" ? "border-t border-dashed" : "border-t"}
                    `}
                />
              </div>
            );
          })}
        </div>

        {/* イベント */}
        <div className="absolute inset-0 pointer-events-none">
          {events.map((event) => {
            const dayStart = new Date(day);

            dayStart.setHours(0, 0, 0, 0);

            const nextDay = new Date(dayStart);

            nextDay.setDate(nextDay.getDate() + 1);

            // 表示開始
            const displayStart =
              event.start < dayStart ? dayStart : event.start;

            // 表示終了
            const displayEnd = event.end > nextDay ? nextDay : event.end;

            const startHour = displayStart.getHours();

            const startMinute = displayStart.getMinutes();

            const endHour = displayEnd.getHours();

            const endMinute = displayEnd.getMinutes();

            const eventSlot = startHour * 2 + (startMinute >= 30 ? 1 : 0);
            const endSlot =
              displayEnd.getTime() === nextDay.getTime()
                ? 48
                : endHour * 2 + (endMinute >= 30 ? 1 : 0);
            const duration = Math.max(1, endSlot - eventSlot);

            const top = eventSlot * 40 + ((startMinute % 30) / 30) * 40;

            const overlappingEvents = events.filter((e) => {
              const eDisplayStart = e.start < dayStart ? dayStart : e.start;

              const eDisplayEnd = e.end > nextDay ? nextDay : e.end;
              return eDisplayStart < displayEnd && eDisplayEnd > displayStart;
            });

            const overlapIndex = overlappingEvents.findIndex(
              (e) => e.id === event.id,
            );

            const overlapCount = overlappingEvents.length;

            return (
              <div
                key={event.id}
                style={{
                  top: `${top}px`,
                  left: `${(100 / overlapCount) * overlapIndex}%`,
                  width: `calc(${88 / overlapCount}% - 4px)`,
                  height: `${duration * 40}px`,
                  zIndex: 1,
                }}
                className="
                    absolute
                    min-w-0
                    pointer-events-none
                  "
              >
                <DraggableEvent
                  event={event}
                  dragStart={displayStart}
                  onEventClick={onEventClick}
                />
              </div>
            );
          })}
        </div>
      </div>
    </DropColumn>
  );
}
