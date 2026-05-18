"use client";

import CalendarNavigation from "./CalendarNavigation";

type Props = {
  currentDate: Date;

  selectedDate: Date;

  onAddEvent: () => void;

  view: "month" | "week" | "day";

  setView: (view: "month" | "week" | "day") => void;

  setCurrentDate: (date: Date) => void;

  setSelectedDate: (date: Date) => void;
};

export default function Header({
  currentDate,
  selectedDate,
  onAddEvent,
  view,
  setView,
  setCurrentDate,
  setSelectedDate,
}: Props) {
  return (
    <div
      className="
      flex
      items-center
      justify-between
      mb-4
      bg-white
      p-4
    "
    >
      {/* 左側 */}
      <div className="flex items-center">
        <CalendarNavigation
          currentDate={currentDate}
          setCurrentDate={setCurrentDate}
          setSelectedDate={setSelectedDate}
          selectedDate={selectedDate}
          view={view}
        />
      </div>

      {/* 右側 */}
      <div className="flex items-center gap-4">
        {/* 月週日 */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setView("month")}
            className={`px-2 py-1 rounded ${
              view === "month" ? "bg-black text-white" : "border"
            }`}
          >
            月
          </button>

          <button
            onClick={() => setView("week")}
            className={`px-2 py-1 rounded ${
              view === "week" ? "bg-black text-white" : "border"
            }`}
          >
            週
          </button>

          <button
            onClick={() => {
              const newDate = new Date(selectedDate);

              newDate.setSeconds(0);
              newDate.setMilliseconds(0);

              setCurrentDate(newDate);

              setSelectedDate(new Date(newDate));

              setView("day");
            }}
            className={`px-2 py-1 rounded ${
              view === "day" ? "bg-black text-white" : "border"
            }`}
          >
            日
          </button>
        </div>

        {/* 新しいイベント */}
        <button
          onClick={onAddEvent}
          className="
          bg-blue-500
          text-white
          px-3
          py-1
          rounded
        "
        >
          新しいイベント
        </button>
      </div>
    </div>
  );
}
