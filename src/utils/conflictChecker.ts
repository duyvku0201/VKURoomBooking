import { Booking, TimeSlot } from '../types/room';

export const STANDARD_SLOTS: Omit<TimeSlot, 'isBooked' | 'bookedBy'>[] = [
  { id: 'slot-1', label: '07:30 - 09:30', period: 'Sáng', startTime: '07:30', endTime: '09:30' },
  { id: 'slot-2', label: '09:45 - 11:45', period: 'Sáng', startTime: '09:45', endTime: '11:45' },
  { id: 'slot-3', label: '13:00 - 15:00', period: 'Chiều', startTime: '13:00', endTime: '15:00' },
  { id: 'slot-4', label: '15:15 - 17:15', period: 'Chiều', startTime: '15:15', endTime: '17:15' },
  { id: 'slot-5', label: '17:30 - 19:30', period: 'Tối', startTime: '17:30', endTime: '19:30' },
  { id: 'slot-6', label: '19:45 - 21:15', period: 'Tối', startTime: '19:45', endTime: '21:15' },
];

export function getAvailableDates(): { key: string; label: string; subLabel: string }[] {
  const dates = [];
  const now = new Date();

  for (let i = 0; i < 3; i++) {
    const d = new Date(now);
    d.setDate(now.getDate() + i);
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    const key = `${yyyy}-${mm}-${dd}`;

    let label = 'Hôm nay';
    if (i === 1) label = 'Ngày mai';
    else if (i === 2) {
      const dayNames = ['Chủ nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'];
      label = dayNames[d.getDay()];
    }

    const subLabel = `${dd}/${mm}`;
    dates.push({ key, label, subLabel });
  }

  return dates;
}

export interface ConflictCheckResult {
  hasConflict: boolean;
  reason?: string;
  conflictingBooking?: Booking;
}

export function checkBookingConflict(
  roomId: string,
  targetDate: string,
  slotId: string,
  userBookings: Booking[],
  roomSlotsForDate?: TimeSlot[]
): ConflictCheckResult {
  // Kiểm tra 1: Phòng đã có nhóm khác đặt
  if (roomSlotsForDate) {
    const slot = roomSlotsForDate.find((s) => s.id === slotId);
    if (slot && slot.isBooked) {
      return {
        hasConflict: true,
        reason: `Khung giờ này đã được đặt bởi: ${slot.bookedBy || 'nhóm sinh viên khác'}. Vui lòng chọn khung giờ khác.`,
      };
    }
  }

  // Kiểm tra 2: Trùng lịch với phòng khác của chính sinh viên
  const userConflict = userBookings.find(
    (b) => b.status === 'confirmed' && b.date === targetDate && b.timeSlotId === slotId
  );

  if (userConflict) {
    return {
      hasConflict: true,
      reason: `Trùng lịch học: Bạn đã có lịch đặt phòng "${userConflict.roomName}" (${userConflict.timeSlotLabel}) vào ngày này.`,
      conflictingBooking: userConflict,
    };
  }

  return { hasConflict: false };
}
