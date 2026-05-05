"use client";

import { format } from "date-fns";

type Props = {
  selectedDate: Date;
  onAddEvent: () => void;
};

export default function Header({ selectedDate, onAddEvent }: Props) {
  return (
    <div className="flex items-center justify-between mb-4 bg-white p-4">
      <h1 className="text-xl font-bold">
        {format(selectedDate, "yyyy年 M月")}
      </h1>

      <button
        onClick={onAddEvent}
        className="bg-blue-500 text-white px-3 py-1 rounded"
      >
        新しいイベント
      </button>
    </div>
  );
}
