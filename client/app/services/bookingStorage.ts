const STORAGE_KEY = "youwork_bookings";

export type SavedBooking = {
  id: string;
  roomId: string;
  roomName: string;
  roomLocation: string;
  title: string;
  startTime: string;
  endTime: string;
  date: string;
  duration: number;
  bookedBy: { name: string; email: string };
  createdAt: string;
};

const getAll = (): SavedBooking[] => {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const save = (booking: SavedBooking): void => {
  const bookings = getAll();
  bookings.push(booking);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(bookings));
};

const getByRoom = (roomId: string): SavedBooking[] => {
  return getAll()
    .filter((b) => b.roomId === roomId)
    .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());
};

export const bookingStorage = { getAll, save, getByRoom };
