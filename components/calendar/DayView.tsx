"use client";

import { format, isSameDay } from "date-fns";

import type { Event } from "@/types/event";
import { getDayEvents } from "@/lib/getDayEvents";

type Props = {
  currentDate: Date;
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
  events: Event[];
  onEventClick: (event: Event) => void;
};

export default function DayView({
  currentDate,
  selectedDate,
  setSelectedDate,
  events,
  onEventClick,
}: Props) {
  // 30分ごと
  const timeSlots = Array.from({ length: 48 }, (_, i) => i);

  // その日のイベントだけ
  const dayEvents = getDayEvents(currentDate, events);

  return (
    <div className="flex border-t border-l bg-white">
      {/* 時間列 */}
      <div className="w-16 shrink-0">
        {timeSlots.map((slot) => {
          const hour = Math.floor(slot / 2);

          const minute = slot % 2 === 0 ? "00" : "30";

          return (
            <div key={slot} className="relative h-10 border-r">
              {/* 横線 */}
              <div
                className={`
                  absolute top-0 left-0 w-full
                  ${
                    minute === "30"
                      ? "border-t border-dashed border-gray-200"
                      : "border-t border-black/20"
                  }
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

      {/* 1日分 */}
      <div className="flex-1">
        {timeSlots.map((slot) => {
          const hour = Math.floor(slot / 2);

          const minute = slot % 2 === 0 ? "00" : "30";

          const isSelected =
            isSameDay(currentDate, selectedDate) &&
            selectedDate.getHours() === hour &&
            selectedDate.getMinutes() === (minute === "30" ? 30 : 0);

          return (
            <div
              key={slot}
              onClick={() => {
                const clickedDate = new Date(currentDate);

                clickedDate.setHours(hour);

                clickedDate.setMinutes(minute === "30" ? 30 : 0);

                setSelectedDate(clickedDate);
              }}
              className={`
                relative
                h-10
                border-r
                cursor-pointer
                hover:bg-blue-50
                ${isSelected ? "ring-2 ring-black z-10" : ""}
              `}
            >
              {/* 横線 */}
              <div
                className={`
                  absolute top-0 left-0 w-full
                  ${
                    minute === "30"
                      ? "border-t border-dashed border-gray-200"
                      : "border-t border-black/20"
                  }
                `}
              />

              {/* イベント表示 */}
              {dayEvents.map((event) => {
                const startHour = event.start.getHours();

                const startMinute = event.start.getMinutes();

                const eventSlot = startHour * 2 + (startMinute >= 30 ? 1 : 0);

                const endHour = event.end.getHours();

                const endMinute = event.end.getMinutes();

                const endSlot = endHour * 2 + (endMinute >= 30 ? 1 : 0);

                const duration = endSlot - eventSlot;

                // 分のズレ
                const top = ((startMinute % 30) / 30) * 40;

                // 重なり検知
                const overlappingEvents = dayEvents.filter((e) => {
                  const eStartHour = e.start.getHours();

                  const eStartMinute = e.start.getMinutes();

                  const eEndHour = e.end.getHours();

                  const eEndMinute = e.end.getMinutes();

                  const eStartSlot =
                    eStartHour * 2 + (eStartMinute >= 30 ? 1 : 0);

                  const eEndSlot = eEndHour * 2 + (eEndMinute >= 30 ? 1 : 0);

                  return eventSlot < eEndSlot && endSlot > eStartSlot;
                });

                // 何番目？
                const overlapIndex = overlappingEvents.findIndex(
                  (e) => e.id === event.id,
                );

                // 何個重なってる？
                const overlapCount = overlappingEvents.length;

                return (
                  slot === eventSlot && (
                    <div
                      key={event.id}
                      style={{
                        top: `${top}px`,
                        left: `${(100 / overlapCount) * overlapIndex}%`,
                        width: `${100 / overlapCount}%`,
                        height: `${duration * 40}px`,
                        zIndex: 10,
                      }}
                      onClick={(e) => {
                        e.stopPropagation();

                        onEventClick(event);
                      }}
                      className={`
                        absolute
                        px-1
                        py-1
                        rounded-lg
                        text-white
                        overflow-hidden
                        break-words
                        leading-tight
                        text-[11px]
                        shadow-sm
                        border
                        border-white
                        ${event.color || "bg-blue-400"}
                      `}
                    >
                      <div className="font-semibold">
                        {format(event.start, "HH:mm")}
                      </div>

                      <div className="line-clamp-2">{event.title}</div>
                    </div>
                  )
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}
