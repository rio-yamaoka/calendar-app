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

  selectedDate: Date;

  view: "month" | "week" | "day";
};

export default function CalendarNavigation({
  currentDate,
  setCurrentDate,
  setSelectedDate,
  selectedDate,
  view,
}: Props) {
  return (
    <div className="bg-white flex items-center gap-3 px-2 py-3">
      {/* 今日 */}
      <button
        onClick={() => {
          const today = new Date();

          const newToday = new Date(today);

          // 00:00にそろえる
          newToday.setHours(0);
          newToday.setMinutes(0);
          newToday.setSeconds(0);
          newToday.setMilliseconds(0);

          setCurrentDate(new Date(newToday));

          setSelectedDate(new Date(newToday));
        }}
        className="
          px-3
          py-1
          border
          rounded
          hover:bg-gray-100
          text-sm
        "
      >
        今日
      </button>

      {/* ← */}
      <button
        onClick={() => {
          let newDate = new Date(currentDate);

          if (view === "month") {
            newDate = subMonths(currentDate, 1);
          } else if (view === "week") {
            newDate = subWeeks(currentDate, 1);
          } else {
            newDate = subDays(currentDate, 1);
          }

          // 選択時間を維持
          const syncedDate = new Date(newDate);

          syncedDate.setHours(selectedDate.getHours());

          syncedDate.setMinutes(selectedDate.getMinutes());

          syncedDate.setSeconds(0);

          syncedDate.setMilliseconds(0);

          setCurrentDate(new Date(newDate));

          setSelectedDate(new Date(syncedDate));
        }}
        className="
          px-2
          py-1
          border
          rounded
          hover:bg-gray-100
        "
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
          let newDate = new Date(currentDate);

          if (view === "month") {
            newDate = addMonths(currentDate, 1);
          } else if (view === "week") {
            newDate = addWeeks(currentDate, 1);
          } else {
            newDate = addDays(currentDate, 1);
          }

          // 選択時間を維持
          const syncedDate = new Date(newDate);

          syncedDate.setHours(selectedDate.getHours());

          syncedDate.setMinutes(selectedDate.getMinutes());

          syncedDate.setSeconds(0);

          syncedDate.setMilliseconds(0);

          setCurrentDate(new Date(newDate));

          setSelectedDate(new Date(syncedDate));
        }}
        className="
          px-2
          py-1
          border
          rounded
          hover:bg-gray-100
        "
      >
        →
      </button>
    </div>
  );
}
