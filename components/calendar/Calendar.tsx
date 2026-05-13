"use client";

import { useState, useEffect } from "react";

import EventForm from "./EventForm";
import Header from "./Header";
import EventDetail from "./EventDetail";
import DayEventsModal from "./DayEventsModal";
import MonthView from "./MonthView";
import WeekView from "./WeekView";
import DayView from "./DayView";
import CalendarNavigation from "./CalendarNavigation";

import type { Event } from "@/types/event";

export default function Calendar() {
  const [moreDate, setMoreDate] = useState<Date | null>(null);

  const [view, setView] = useState<"month" | "week" | "day">("month");

  const [currentDate, setCurrentDate] = useState(new Date());

  const [selectedDate, setSelectedDate] = useState(new Date());

  const [events, setEvents] = useState<Event[]>([]);

  const [isLoaded, setIsLoaded] = useState(false);

  const [isOpen, setIsOpen] = useState(false);

  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  const [editingEvent, setEditingEvent] = useState<Event | null>(null);

  useEffect(() => {
    setCurrentDate(selectedDate);
  }, [view]);

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

    setIsLoaded(true);
  }, []);

  // 保存
  useEffect(() => {
    if (!isLoaded) return;

    localStorage.setItem("events", JSON.stringify(events));
  }, [events, isLoaded]);

  // 削除
  const handleDelete = () => {
    if (!selectedEvent) return;

    setEvents(events.filter((e) => e.id !== selectedEvent.id));

    setSelectedEvent(null);

    setIsOpen(false);
  };

  // 保存（新規 or 編集）
  const handleSave = (
    title: string,
    start: Date,
    end: Date,
    location?: string,
    description?: string,
    color?: string,
    repeat?: "none" | "daily" | "weekly" | "monthly" | "yearly",
  ) => {
    if (editingEvent) {
      const updated = events.map((e) =>
        e.id === editingEvent.id
          ? {
              ...e,
              title,
              start,
              end,
              location,
              description,
              color,
              repeat,
            }
          : e,
      );

      setEvents(updated);
    } else {
      const newEvent: Event = {
        id: crypto.randomUUID(),
        title,
        start,
        end,
        location,
        description,
        color: color || "bg-blue-400",
        repeat,
      };

      setEvents([...events, newEvent]);
    }

    setIsOpen(false);

    setEditingEvent(null);
  };

  return (
    <div>
      <Header
        selectedDate={selectedDate}
        view={view}
        setView={setView}
        onAddEvent={() => {
          setEditingEvent(null);

          setSelectedEvent(null);

          setIsOpen(true);
        }}
      />

      <CalendarNavigation
        currentDate={currentDate}
        setCurrentDate={setCurrentDate}
        setSelectedDate={setSelectedDate}
        view={view}
      />

      {/* 月表示 */}
      {view === "month" && (
        <MonthView
          currentDate={currentDate}
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          events={events}
          onEventClick={(event) => {
            setSelectedEvent(event);

            setSelectedDate(event.start);

            setIsOpen(true);
          }}
          onMoreClick={(date) => {
            setMoreDate(date);
          }}
        />
      )}

      {/* 週表示 */}
      {view === "week" && (
        <WeekView
          currentDate={currentDate}
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          events={events}
          onEventClick={(event) => {
            setSelectedEvent(event);

            setSelectedDate(event.start);

            setIsOpen(true);
          }}
        />
      )}

      {/* 日表示 */}
      {view === "day" && (
        <DayView
          currentDate={currentDate}
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          events={events}
          onEventClick={(event) => {
            setSelectedEvent(event);

            setSelectedDate(event.start);

            setIsOpen(true);
          }}
        />
      )}

      {/* フォーム */}
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

      {/* +件数 */}
      {moreDate && (
        <DayEventsModal
          date={moreDate}
          events={events}
          onClose={() => setMoreDate(null)}
          onEventClick={(event) => {
            setSelectedEvent(event);

            setMoreDate(null);

            setIsOpen(true);
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
