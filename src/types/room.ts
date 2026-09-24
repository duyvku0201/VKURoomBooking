export type RoomType = 'lab' | 'study' | 'meeting' | 'studio' | 'seminar';

export type RoomStatus = 'available' | 'occupied' | 'maintenance';

export interface TimeSlot {
  id: string;
  label: string; // e.g. "07:30 - 09:30"
  period: 'Sáng' | 'Chiều' | 'Tối';
  startTime: string;
  endTime: string;
  isBooked: boolean;
  bookedBy?: string;
}

export interface Room {
  id: string;
  name: string;
  code: string; // e.g. "Lab A3-101", "Lib B-204"
  building: string; // e.g. "Tòa nhà A", "Tòa nhà B", "Thư viện trung tâm"
  floor: string; // e.g. "Tầng 1"
  capacity: number; // e.g. 35
  type: RoomType;
  status: RoomStatus;
  imageUrl: string;
  amenities: string[];
  rating: number;
  description: string;
  timeSlots: { [dateString: string]: TimeSlot[] };
}

export interface Booking {
  id: string;
  roomId: string;
  roomName: string;
  roomCode: string;
  building: string;
  date: string; // YYYY-MM-DD
  timeSlotId: string;
  timeSlotLabel: string;
  period: string;
  bookedAt: string;
  status: 'confirmed' | 'cancelled';
  purpose?: string;
}

export type TabType = 'browse' | 'bookings' | 'profile';

export interface FilterCriteria {
  searchQuery: string;
  selectedBuilding: string;
  selectedType: string;
  onlyAvailable: boolean;
  minCapacity: number;
}
