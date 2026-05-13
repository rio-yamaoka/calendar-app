import { isSameDay, differenceInCalendarDays } from "date-fns";

import type { Event } from "@/types/event";

export function getDayEvents(day: Date, events: Event[]) {
  return events
    .filter((event) => {
      // 通常イベント
      if (isSameDay(event.start, day)) {
        return true;
      }

      // 繰り返しなし
      if (!event.repeat || event.repeat === "none") {
        return false;
      }

      const diffDays = differenceInCalendarDays(day, event.start);

      // 毎日
      if (event.repeat === "daily") {
        return diffDays >= 0;
      }

      // 毎週
      if (event.repeat === "weekly") {
        return diffDays >= 0 && diffDays % 7 === 0;
      }

      // 毎月
      if (event.repeat === "monthly") {
        return diffDays >= 0 && day.getDate() === event.start.getDate();
      }

      // 毎年
      if (event.repeat === "yearly") {
        return (
          diffDays >= 0 &&
          day.getDate() === event.start.getDate() &&
          day.getMonth() === event.start.getMonth()
        );
      }

      return false;
    })
    .sort((a, b) => a.start.getTime() - b.start.getTime());
}
