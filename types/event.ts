export type Event = {
  id: string;
  title: string;
  start: Date;
  end: Date;
  location?: string;
  description?: string;
  color?: string;
  repeat?: "none" | "daily" | "weekly" | "monthly" | "yearly";
};
