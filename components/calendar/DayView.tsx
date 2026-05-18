"use client";

import { format, isSameDay } from "date-fns";

import type { Event } from "@/types/event";

import { getDayEvents } from "@/lib/getDayEvents";

import DraggableEvent from "./DraggableEvent";

import DropColumn from "./DropColumn";

type Props = {
  currentDate: Date;

  selectedDate: Date;

  setSelectedDate: (date: Date) => void;

  events: Event[];

  onEventClick: (event: Event) => void;

  onEventDrop: (event: Event, newDate: Date) => void;

  setCurrentDate: (date: Date) => void;
};

export default function DayView({
  currentDate,
  selectedDate,
  setSelectedDate,
  events,
  onEventClick,
  onEventDrop,
  setCurrentDate,
}: Props) {
  const timeSlots = Array.from({ length: 48 }, (_, i) => i);

  // const dayEvents = getDayEvents(selectedDate, events);
  const dayEvents = getDayEvents(currentDate, events);
  return (
    <div className="flex border-t border-l bg-white">
      {/* 時間列 */}
      <div className="w-16 shrink-0">
        {timeSlots.map((slot) => {
          const hour = Math.floor(slot / 2);

          const minute = slot % 2 === 0 ? "00" : "30";

          return (
            <div
              key={slot}
              className="
                relative
                h-10
                border-r
              "
            >
              {/* 線 */}
              <div
                className={`
                  absolute
                  top-0
                  left-0
                  w-full
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

      {/* 1日カラム */}
      <DropColumn
        day={currentDate}
        onEventDrop={onEventDrop}
        setCurrentDate={setCurrentDate}
      >
        <div
          className="
            relative
            border-r
            min-h-[1920px]
            w-full
          "
        >
          {/* 背景グリッド */}
          <div className="min-h-[1920px]">
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
                    cursor-pointer
                    hover:bg-blue-50
                    ${isSelected ? "ring-2 ring-black z-10" : ""}
                  `}
                >
                  {/* 線 */}
                  <div
                    className={`
                      absolute
                      top-0
                      left-0
                      w-full
                      ${
                        minute === "30"
                          ? "border-t border-dashed border-gray-200"
                          : "border-t border-black/20"
                      }
                    `}
                  />
                </div>
              );
            })}
          </div>

          {/* イベント */}
          <div
            className="
              absolute
              inset-0
              pointer-events-none
              min-h-[1920px]
            "
          >
            {dayEvents.map((event) => {
              const dayStart = new Date(currentDate);

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

              const overlappingEvents = dayEvents.filter((e) => {
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
                    onEventClick={onEventClick}
                    dragStart={displayStart}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </DropColumn>
    </div>
  );
}
