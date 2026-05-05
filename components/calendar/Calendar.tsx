"use client";

// 日付計算ライブラリ
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

import { useState, useEffect } from "react";
import EventForm from "./EventForm";
import Header from "./Header";
import EventDetail from "./EventDetail";
import type { Event } from "@/types/event";

export default function Calendar() {
  const today = new Date();

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [events, setEvents] = useState<Event[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);

  // 削除
  const handleDelete = () => {
    if (!selectedEvent) return;

    setEvents(events.filter((e) => e.id !== selectedEvent.id));
    setSelectedEvent(null);
    setIsOpen(false);
  };

  // 読み込み
  useEffect(() => {
    const stored = localStorage.getItem("events");

    if (stored) {
      const parsed: Event[] = JSON.parse(stored);

      const formatted = parsed.map((event) => ({
        ...event,
        start: new Date(event.start),
        end: new Date(event.end),
      }));

      setEvents(formatted);
    }
  }, []);

  // 保存
  useEffect(() => {
    localStorage.setItem("events", JSON.stringify(events));
  }, [events]);

  // 保存（新規 or 編集）
  const handleSave = (
    title: string,
    start: Date,
    end: Date,
    location?: string,
    description?: string,
    color?: string,
  ) => {
    if (editingEvent) {
      // 編集
      const updated = events.map((e) =>
        e.id === editingEvent.id
          ? { ...e, title, start, end, location, description, color }
          : e,
      );
      setEvents(updated);
    } else {
      // 新規
      const newEvent: Event = {
        id: crypto.randomUUID(),
        title,
        start,
        end,
        location,
        description,
        color: color || "bg-blue-400",
      };
      setEvents([...events, newEvent]);
    }

    setIsOpen(false);
    setEditingEvent(null);
  };

  const startMonth = startOfMonth(today);
  const endMonth = endOfMonth(today);

  const startDate = startOfWeek(startMonth);
  const endDate = endOfWeek(endMonth);

  const days = eachDayOfInterval({
    start: startDate,
    end: endDate,
  });

  const weekDays = ["日", "月", "火", "水", "木", "金", "土"];

  return (
    <div>
      <Header
        selectedDate={selectedDate}
        onAddEvent={() => {
          // 新規作成時リセット（重要）
          setEditingEvent(null);
          setSelectedEvent(null);
          setIsOpen(true);
        }}
      />

      {/* 曜日 */}
      <div className="grid grid-cols-7 gap-2 mb-2">
        {weekDays.map((day) => (
          <div key={day} className="text-center font-bold">
            {day}
          </div>
        ))}
      </div>

      {/* カレンダー */}
      <div className="bg-white p-4 grid grid-cols-7 gap-2">
        {days.map((day, i) => {
          const isCurrentMonth = isSameMonth(day, today);
          const isTodayDate = isToday(day);
          const isSelected = day.getTime() === selectedDate.getTime();

          return (
            <div
              key={i}
              onClick={() => setSelectedDate(day)}
              className={`border h-24 p-1 text-sm cursor-pointer ${
                isTodayDate
                  ? "bg-blue-100"
                  : isCurrentMonth
                    ? "bg-white"
                    : "bg-gray-200"
              } ${isSelected ? "outline outline-1" : ""}`}
            >
              <div>{format(day, "d")}</div>

              <div className="mt-1 space-y-1 overflow-hidden">
                {events
                  .filter((event) => isSameDay(event.start, day))
                  .sort((a, b) => a.start.getTime() - b.start.getTime())
                  .slice(0, 3)
                  .map((event) => (
                    <div
                      key={event.id}
                      onClick={(e) => {
                        e.stopPropagation(); // 🔥 親クリック防止
                        setSelectedEvent(event);
                        setSelectedDate(event.start);
                        setIsOpen(true);
                      }}
                      className={`text-xs ${
                        event.color || "bg-blue-400"
                      } text-white rounded px-1 truncate cursor-pointer`}
                    >
                      <div className="font-semibold">
                        {format(event.start, "HH:mm")} -{" "}
                        {format(event.end, "HH:mm")}
                      </div>
                      <div>{event.title}</div>
                    </div>
                  ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* フォーム（新規 or 編集） */}
      {isOpen && selectedEvent === null && (
        <EventForm
          selectedDate={selectedDate}
          initialEvent={editingEvent || undefined}
          onSave={handleSave}
          onClose={() => {
            setIsOpen(false);
            setEditingEvent(null);
          }}
        />
      )}

      {/* 詳細 */}
      {isOpen && selectedEvent && (
        <EventDetail
          event={selectedEvent}
          onClose={() => {
            setIsOpen(false);
            setSelectedEvent(null);
          }}
          onDelete={handleDelete}
          onEdit={(event) => {
            setEditingEvent(event);
            setSelectedEvent(null);
            setIsOpen(true);
          }}
        />
      )}
    </div>
  );
}
