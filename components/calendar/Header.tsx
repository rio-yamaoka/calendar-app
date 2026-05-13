"use client";

type Props = {
  selectedDate: Date;
  onAddEvent: () => void;

  view: "month" | "week" | "day";

  setView: (view: "month" | "week" | "day") => void;
};

export default function Header({
  selectedDate,
  onAddEvent,
  view,
  setView,
}: Props) {
  return (
    <div className="flex items-center justify-between mb-4 bg-white p-4">
      {/* 左側 */}
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
          onClick={() => setView("day")}
          className={`px-2 py-1 rounded ${
            view === "day" ? "bg-black text-white" : "border"
          }`}
        >
          日
        </button>
      </div>

      {/* 右側 */}
      <button
        onClick={onAddEvent}
        className="bg-blue-500 text-white px-3 py-1 rounded"
      >
        新しいイベント
      </button>
    </div>
  );
}
