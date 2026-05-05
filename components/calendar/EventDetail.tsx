"use client";

import type { Event } from "@/types/event";

type Props = {
  event: Event;
  onClose: () => void;
  onDelete: () => void;
  onEdit: (event: Event) => void;
};

export default function EventDetail({
  event,
  onClose,
  onDelete,
  onEdit,
}: Props) {
  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center">
      <div className="bg-white p-4 rounded w-80">
        <h2
          className={`text-lg font-bold mb-2 ${event.color} text-white p-2 rounded`}
        >
          {event.title}
        </h2>

        <p className="mb-2">
          {event.start.toLocaleString()} - {event.end.toLocaleString()}
        </p>

        {event.location && <p className="mb-2">📍 {event.location}</p>}
        {event.description && <p className="mb-2">📝 {event.description}</p>}

        <div className="flex justify-between mt-4">
          <button onClick={onDelete} className="text-red-500">
            削除
          </button>

          <button
            onClick={() => {
              onClose();
              onEdit(event);
            }}
          >
            編集
          </button>

          <button onClick={onClose}>閉じる</button>
        </div>
      </div>
    </div>
  );
}
