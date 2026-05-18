"use client";

import { useEffect } from "react";

import { format } from "date-fns";

import { useForm } from "react-hook-form";

import { z } from "zod";

import { zodResolver } from "@hookform/resolvers/zod";

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
    repeat?: "none" | "daily" | "weekly" | "monthly" | "yearly",
  ) => void;
  onClose: () => void;
};

const schema = z.object({
  title: z
    .string()
    .min(1, "タイトルを入力してください")
    .max(50, "タイトルは50文字以内です"),

  start: z.string(),

  endDate: z.string(),

  end: z.string(),

  location: z.string().max(30, "場所は30文字以内です").optional(),

  description: z.string().max(200, "詳細は200文字以内です").optional(),

  color: z.string(),

  repeat: z.enum(["none", "daily", "weekly", "monthly", "yearly"]).optional(),
});

type FormData = z.infer<typeof schema>;

export default function EventForm({
  selectedDate,
  initialEvent,
  onSave,
  onClose,
}: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm<FormData>({
    resolver: zodResolver(schema),

    defaultValues: {
      title: "",
      start: "09:00",
      endDate: format(selectedDate, "yyyy-MM-dd"),
      end: "10:00",
      location: "",
      description: "",
      color: "bg-blue-400",
      repeat: "none",
    },
  });

  const selectedColor = watch("color");

  useEffect(() => {
    if (initialEvent) {
      reset({
        title: initialEvent.title,

        start: format(initialEvent.start, "HH:mm"),

        endDate: format(initialEvent.end, "yyyy-MM-dd"),

        end: format(initialEvent.end, "HH:mm"),

        location: initialEvent.location || "",

        description: initialEvent.description || "",

        color: initialEvent.color || "bg-blue-400",

        repeat: initialEvent.repeat || "none",
      });
    } else {
      const defaultStart = new Date(selectedDate);

      defaultStart.setHours(9, 0, 0, 0);

      const defaultEnd = new Date(selectedDate);

      defaultEnd.setHours(10, 0, 0, 0);

      reset({
        title: "",

        start: format(defaultStart, "HH:mm"),

        endDate: format(defaultEnd, "yyyy-MM-dd"),

        end: format(defaultEnd, "HH:mm"),

        location: "",

        description: "",

        color: "bg-blue-400",

        repeat: "none",
      });
    }
  }, [initialEvent, selectedDate, reset]);

  const handleSave = (data: FormData) => {
    const startDate = new Date(selectedDate);

    const endDate = new Date(data.endDate);

    const [startHour, startMinute] = data.start.split(":");

    const [endHour, endMinute] = data.end.split(":");

    startDate.setHours(Number(startHour), Number(startMinute), 0, 0);

    endDate.setHours(Number(endHour), Number(endMinute), 0, 0);

    if (endDate.getTime() <= startDate.getTime()) {
      alert("終了日時は開始日時より後にしてください");

      return;
    }

    onSave(
      data.title.trim(),

      startDate,

      endDate,

      data.location?.trim() || undefined,

      data.description?.trim() || undefined,

      data.color,

      data.repeat,
    );

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div className="bg-white p-4 rounded w-80">
        <h2 className="font-bold mb-2">
          {initialEvent ? "イベント編集" : "イベント作成"}
        </h2>

        <input
          {...register("title")}
          className="border w-full p-1 mb-1"
          placeholder="タイトル"
        />

        {errors.title && (
          <div className="text-red-500 text-sm mb-2">
            {errors.title.message}
          </div>
        )}

        <div className="mb-2">
          <p className="text-sm mb-1">開始</p>

          <input
            type="time"
            {...register("start")}
            className="border w-full p-1"
          />
        </div>

        <div className="mb-2">
          <p className="text-sm mb-1">終了</p>

          <div className="flex gap-2">
            <input
              type="date"
              {...register("endDate")}
              className="border p-1 flex-1"
            />

            <input
              type="time"
              {...register("end")}
              className="border p-1 flex-1"
            />
          </div>
        </div>

        <input
          {...register("location")}
          className="border w-full p-1 mb-1"
          placeholder="場所"
        />

        <textarea
          {...register("description")}
          className="border w-full p-1 mb-1"
          placeholder="詳細"
        />

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
              onClick={() => setValue("color", c)}
              className={`w-6 h-6 rounded-full cursor-pointer ${c}
              ${selectedColor === c ? "ring-2 ring-black" : ""}`}
            />
          ))}
        </div>

        <select {...register("repeat")} className="border w-full p-1">
          <option value="none">なし</option>

          <option value="daily">毎日</option>

          <option value="weekly">毎週</option>

          <option value="monthly">毎月</option>

          <option value="yearly">毎年</option>
        </select>

        <div className="flex justify-between mt-4">
          <button onClick={onClose}>キャンセル</button>

          <button
            onClick={handleSubmit(handleSave)}
            className="bg-blue-500 text-white px-2 py-1 rounded"
          >
            保存
          </button>
        </div>
      </div>
    </div>
  );
}
