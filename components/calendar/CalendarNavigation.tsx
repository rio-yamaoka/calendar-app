"use client";

import {
  format,
  addMonths,
  subMonths,
  addWeeks,
  subWeeks,
  addDays,
  subDays,
} from "date-fns";

type Props = {
  currentDate: Date;
  setCurrentDate: (date: Date) => void;
  setSelectedDate: (date: Date) => void;
  view: "month" | "week" | "day";
};

export default function CalendarNavigation({
  currentDate,
  setCurrentDate,
  setSelectedDate,
  view,
}: Props) {
  return (
    <div className="bg-white flex items-center gap-3 px-2 py-3">
      {/* 今日 */}
      <button
        onClick={() => {
          const today = new Date();

          setCurrentDate(today);
          setSelectedDate(today);
        }}
        className="px-3 py-1 border rounded hover:bg-gray-100 text-sm"
      >
        今日
      </button>

      {/* ← */}
      <button
        onClick={() => {
          if (view === "month") {
            setCurrentDate(subMonths(currentDate, 1));
          } else if (view === "week") {
            setCurrentDate(subWeeks(currentDate, 1));
          } else {
            setCurrentDate(subDays(currentDate, 1));
          }
        }}
        className="px-2 py-1 border rounded hover:bg-gray-100"
      >
        ←
      </button>

      {/* タイトル */}
      <h2 className="text-lg font-semibold">
        {view === "month"
          ? format(currentDate, "yyyy年 M月")
          : format(currentDate, "yyyy年 M月 d日 (EEE)")}
      </h2>

      {/* → */}
      <button
        onClick={() => {
          if (view === "month") {
            setCurrentDate(addMonths(currentDate, 1));
          } else if (view === "week") {
            setCurrentDate(addWeeks(currentDate, 1));
          } else {
            setCurrentDate(addDays(currentDate, 1));
          }
        }}
        className="px-2 py-1 border rounded hover:bg-gray-100"
      >
        →
      </button>
    </div>
  );
}
