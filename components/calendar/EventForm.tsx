"use client";

import { useState, useEffect } from "react";
import type { Event } from "@/types/event";

type Props = {
  selectedDate: Date;
  initialEvent?: Event;
  onSave: (
    title: string,
    start: Date,
    end: Date,
    location?: string,
    description?: string,
    color?: string,
  ) => void;
  onClose: () => void;
  onDelete?: () => void;
};

export default function EventForm({
  selectedDate,
  initialEvent,
  onSave,
  onClose,
  onDelete,
}: Props) {
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [color, setColor] = useState("bg-blue-400");
  const [error, setError] = useState("");

  const toLocalInputValue = (date: Date) => {
    const offset = date.getTimezoneOffset();
    const local = new Date(date.getTime() - offset * 60000);
    return local.toISOString().slice(0, 16);
  };

  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");

  // 🔥 初期値セット（編集 or 新規）
  useEffect(() => {
    if (initialEvent) {
      setTitle(initialEvent.title);
      setLocation(initialEvent.location || "");
      setDescription(initialEvent.description || "");
      setColor(initialEvent.color || "bg-blue-400");
      setStart(toLocalInputValue(new Date(initialEvent.start)));
      setEnd(toLocalInputValue(new Date(initialEvent.end)));
    } else {
      const defaultStart = new Date(selectedDate);
      defaultStart.setHours(9, 0, 0, 0);

      const defaultEnd = new Date(selectedDate);
      defaultEnd.setHours(10, 0, 0, 0);

      setStart(toLocalInputValue(defaultStart));
      setEnd(toLocalInputValue(defaultEnd));
    }
  }, [initialEvent, selectedDate]);

  const handleSave = () => {
    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      setError("タイトルを入力してください");
      return;
    }

    const startDate = new Date(start);
    const endDate = new Date(end);

    if (startDate >= endDate) {
      setError("終了時間は開始時間より後にしてください");
      return;
    }

    onSave(
      trimmedTitle,
      startDate,
      endDate,
      location || undefined,
      description || undefined,
      color,
    );

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center">
      <div className="bg-white p-4 rounded w-80">
        <h2 className="font-bold mb-2">
          {initialEvent ? "イベント編集" : "イベント作成"}
        </h2>

        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border w-full p-1 mb-2"
          placeholder="タイトル"
        />

        <input
          type="datetime-local"
          value={start}
          onChange={(e) => setStart(e.target.value)}
          className="border w-full p-1 mb-2"
        />

        <input
          type="datetime-local"
          value={end}
          onChange={(e) => setEnd(e.target.value)}
          className="border w-full p-1 mb-2"
        />

        <input
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="border w-full p-1 mb-2"
          placeholder="場所"
        />

        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="border w-full p-1 mb-2"
          placeholder="詳細"
        />

        {/* 色 */}
        <div className="flex gap-2 mb-3">
          {[
            "bg-blue-400",
            "bg-red-400",
            "bg-green-400",
            "bg-yellow-400",
            "bg-purple-400",
          ].map((c) => (
            <div
              key={c}
              onClick={() => setColor(c)}
              className={`w-6 h-6 rounded-full cursor-pointer ${c} ${
                color === c ? "ring-2 ring-black" : ""
              }`}
            />
          ))}
        </div>

        {error && <div className="text-red-500 text-sm">{error}</div>}

        <div className="flex justify-between mt-2">
          <button onClick={onClose}>キャンセル</button>
          <button
            onClick={handleSave}
            className="bg-blue-500 text-white px-2 py-1"
          >
            保存
          </button>
        </div>
      </div>
    </div>
  );
}
