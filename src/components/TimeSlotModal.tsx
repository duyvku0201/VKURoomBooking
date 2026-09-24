import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  Pressable,
  ScrollView,
  TextInput,
  Image,
} from 'react-native';
import { Booking, Room, TimeSlot } from '../types/room';
import { checkBookingConflict, getAvailableDates } from '../utils/conflictChecker';

interface TimeSlotModalProps {
  visible: boolean;
  room: Room | null;
  userBookings: Booking[];
  onClose: () => void;
  onConfirmBooking: (newBooking: Booking) => void;
}

export function TimeSlotModal({
  visible,
  room,
  userBookings,
  onClose,
  onConfirmBooking,
}: TimeSlotModalProps) {
  const dates = getAvailableDates();
  const [selectedDateKey, setSelectedDateKey] = useState<string>(dates[0]?.key || '');
  const [selectedSlotId, setSelectedSlotId] = useState<string | null>(null);
  const [purpose, setPurpose] = useState('');
  const [bookingError, setBookingError] = useState<string | null>(null);

  if (!room) return null;

  const currentDaySlots: TimeSlot[] = room.timeSlots[selectedDateKey] || [];
  const selectedSlot = currentDaySlots.find((s) => s.id === selectedSlotId);

  const handleSelectSlot = (slot: TimeSlot) => {
    setBookingError(null);
    const conflict = checkBookingConflict(
      room.id,
      selectedDateKey,
      slot.id,
      userBookings,
      currentDaySlots
    );

    if (conflict.hasConflict) {
      setBookingError(conflict.reason || 'Đã phát hiện xung đột lịch.');
      return;
    }

    setSelectedSlotId(slot.id);
  };

  const handleConfirm = () => {
    if (!selectedSlot) {
      setBookingError('Vui lòng chọn một khung giờ trước khi xác nhận.');
      return;
    }

    const conflict = checkBookingConflict(
      room.id,
      selectedDateKey,
      selectedSlot.id,
      userBookings,
      currentDaySlots
    );

    if (conflict.hasConflict) {
      setBookingError(conflict.reason || 'Không thể đặt: trùng lịch.');
      return;
    }

    const newBooking: Booking = {
      id: `booking-${Date.now()}`,
      roomId: room.id,
      roomName: room.name,
      roomCode: room.code,
      building: room.building,
      date: selectedDateKey,
      timeSlotId: selectedSlot.id,
      timeSlotLabel: selectedSlot.label,
      period: selectedSlot.period,
      bookedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'confirmed',
      purpose: purpose.trim() || 'Học tập & Thực hành đồ án',
    };

    onConfirmBooking(newBooking);
    setSelectedSlotId(null);
    setPurpose('');
    setBookingError(null);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          {/* Thanh tiêu đề trên cùng */}
          <View style={styles.topBar}>
            <View>
              <Text style={styles.headerSubtitle}>{room.code}</Text>
              <Text style={styles.headerTitle} numberOfLines={1}>
                {room.name}
              </Text>
            </View>
            <Pressable hitSlop={10} onPress={onClose} style={styles.closeBtn}>
              <Text style={styles.closeBtnText}>✕</Text>
            </Pressable>
          </View>

          <ScrollView style={styles.modalScroll} showsVerticalScrollIndicator={false}>
            {/* Banner tóm tắt phòng */}
            <View style={styles.roomBanner}>
              <Image source={{ uri: room.imageUrl }} style={styles.bannerImg} />
              <View style={styles.bannerInfo}>
                <Text style={styles.bannerLocation}>📍 {room.building} • {room.floor}</Text>
                <Text style={styles.bannerCap}>👥 Sức chứa: {room.capacity} chỗ ngồi</Text>
                <Text style={styles.bannerRating}>★ {room.rating.toFixed(1)} Điểm đánh giá VKU</Text>
              </View>
            </View>

            {/* Bước 1: Chọn ngày */}
            <Text style={styles.sectionHeading}>1. Chọn ngày đặt phòng</Text>
            <View style={styles.dateSelectorRow}>
              {dates.map((d) => {
                const isSelected = selectedDateKey === d.key;
                return (
                  <Pressable
                    key={d.key}
                    style={[styles.dateTab, isSelected && styles.dateTabActive]}
                    onPress={() => {
                      setSelectedDateKey(d.key);
                      setSelectedSlotId(null);
                      setBookingError(null);
                    }}
                  >
                    <Text style={[styles.dateTabLabel, isSelected && styles.dateTabLabelActive]}>
                      {d.label}
                    </Text>
                    <Text style={[styles.dateTabSub, isSelected && styles.dateTabSubActive]}>
                      {d.subLabel}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            {/* Bước 2: Chọn khung giờ */}
            <View style={styles.sectionHeadingRow}>
              <Text style={styles.sectionHeading}>2. Chọn khung giờ học</Text>
              <Text style={styles.headingNote}>✓ Chống trùng lịch tự động</Text>
            </View>

            <View style={styles.slotsGrid}>
              {currentDaySlots.map((slot) => {
                const isSelected = selectedSlotId === slot.id;
                const isOccupied = slot.isBooked;

                const userConflict = userBookings.find(
                  (b) => b.status === 'confirmed' && b.date === selectedDateKey && b.timeSlotId === slot.id
                );

                const hasConflict = isOccupied || !!userConflict;

                return (
                  <Pressable
                    key={slot.id}
                    style={({ pressed }) => [
                      styles.slotCard,
                      hasConflict && styles.slotCardDisabled,
                      isSelected && styles.slotCardSelected,
                      pressed && !hasConflict && { opacity: 0.8 },
                    ]}
                    onPress={() => handleSelectSlot(slot)}
                  >
                    <View style={styles.slotHeader}>
                      <Text
                        style={[
                          styles.slotPeriod,
                          isSelected && styles.slotPeriodSelected,
                          hasConflict && styles.slotPeriodDisabled,
                        ]}
                      >
                        {slot.period}
                      </Text>
                      {hasConflict ? (
                        <View style={styles.conflictBadge}>
                          <Text style={styles.conflictBadgeText}>
                            {userConflict ? 'Trùng lịch bạn' : 'Đã có người'}
                          </Text>
                        </View>
                      ) : (
                        <View style={styles.availableBadge}>
                          <Text style={styles.availableBadgeText}>Còn trống</Text>
                        </View>
                      )}
                    </View>

                    <Text
                      style={[
                        styles.slotTime,
                        isSelected && styles.slotTimeSelected,
                        hasConflict && styles.slotTimeDisabled,
                      ]}
                    >
                      {slot.label}
                    </Text>

                    {hasConflict && (
                      <Text style={styles.occupiedByText} numberOfLines={1}>
                        {userConflict ? `Trùng phòng: ${userConflict.roomCode}` : slot.bookedBy || 'Đã đăng ký'}
                      </Text>
                    )}
                  </Pressable>
                );
              })}
            </View>

            {/* Khung cảnh báo xung đột lịch */}
            {bookingError && (
              <View style={styles.errorBox}>
                <Text style={styles.errorTitle}>⚠️ Cảnh Báo Chống Trùng Lịch</Text>
                <Text style={styles.errorDesc}>{bookingError}</Text>
              </View>
            )}

            {/* Bước 3: Mục đích sử dụng */}
            <Text style={[styles.sectionHeading, { marginTop: 16 }]}>3. Mục đích sử dụng (Tùy chọn)</Text>
            <TextInput
              style={styles.purposeInput}
              value={purpose}
              onChangeText={setPurpose}
              placeholder="Ví dụ: Họp nhóm Mobile Dev, Thực hành vi điều khiển..."
              placeholderTextColor="#94A3B8"
              maxLength={80}
            />

            <View style={{ height: 24 }} />
          </ScrollView>

          {/* Thanh xác nhận dưới đáy */}
          <View style={styles.bottomBar}>
            <View style={styles.selectionSummary}>
              <Text style={styles.summaryLabel}>Khung giờ đã chọn:</Text>
              <Text style={styles.summaryValue}>
                {selectedSlot ? `${selectedSlot.label} (Buổi ${selectedSlot.period})` : 'Chưa chọn'}
              </Text>
            </View>

            <Pressable
              style={({ pressed }) => [
                styles.confirmBtn,
                !selectedSlot && styles.confirmBtnDisabled,
                pressed && selectedSlot && { opacity: 0.9 },
              ]}
              disabled={!selectedSlot}
              onPress={handleConfirm}
            >
              <Text style={styles.confirmBtnText}>Xác Nhận Đặt</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '90%',
    paddingBottom: 20,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  headerSubtitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#2563EB',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
  },
  closeBtn: {
    backgroundColor: '#F1F5F9',
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#64748B',
  },
  modalScroll: {
    paddingHorizontal: 20,
    paddingTop: 12,
  },
  roomBanner: {
    flexDirection: 'row',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 10,
    gap: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  bannerImg: {
    width: 80,
    height: 64,
    borderRadius: 8,
  },
  bannerInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  bannerLocation: {
    fontSize: 12,
    fontWeight: '600',
    color: '#334155',
  },
  bannerCap: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  bannerRating: {
    fontSize: 11,
    fontWeight: '700',
    color: '#D97706',
    marginTop: 2,
  },
  sectionHeading: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 8,
  },
  sectionHeadingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 14,
    marginBottom: 8,
  },
  headingNote: {
    fontSize: 11,
    color: '#10B981',
    fontWeight: '600',
  },
  dateSelectorRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 10,
  },
  dateTab: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    borderRadius: 10,
    paddingVertical: 8,
    alignItems: 'center',
  },
  dateTabActive: {
    backgroundColor: '#EFF6FF',
    borderColor: '#2563EB',
  },
  dateTabLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#475569',
  },
  dateTabLabelActive: {
    color: '#2563EB',
  },
  dateTabSub: {
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 2,
  },
  dateTabSubActive: {
    color: '#3B82F6',
    fontWeight: '600',
  },
  slotsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  slotCard: {
    width: '48.5%',
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    borderRadius: 12,
    padding: 10,
  },
  slotCardDisabled: {
    backgroundColor: '#F8FAFC',
    borderColor: '#E2E8F0',
    opacity: 0.65,
  },
  slotCardSelected: {
    borderColor: '#2563EB',
    backgroundColor: '#EFF6FF',
  },
  slotHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  slotPeriod: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748B',
  },
  slotPeriodSelected: {
    color: '#2563EB',
  },
  slotPeriodDisabled: {
    color: '#94A3B8',
  },
  availableBadge: {
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 4,
  },
  availableBadgeText: {
    fontSize: 9,
    color: '#059669',
    fontWeight: '700',
  },
  conflictBadge: {
    backgroundColor: '#FFF1F2',
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 4,
  },
  conflictBadgeText: {
    fontSize: 9,
    color: '#E11D48',
    fontWeight: '700',
  },
  slotTime: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
  },
  slotTimeSelected: {
    color: '#1D4ED8',
  },
  slotTimeDisabled: {
    color: '#94A3B8',
    textDecorationLine: 'line-through',
  },
  occupiedByText: {
    fontSize: 10,
    color: '#DC2626',
    marginTop: 4,
    fontWeight: '500',
  },
  errorBox: {
    marginTop: 12,
    backgroundColor: '#FEF2F2',
    borderLeftWidth: 4,
    borderLeftColor: '#EF4444',
    padding: 10,
    borderRadius: 8,
  },
  errorTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#991B1B',
  },
  errorDesc: {
    fontSize: 12,
    color: '#B91C1C',
    marginTop: 2,
  },
  purposeInput: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 13,
    color: '#0F172A',
  },
  bottomBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  selectionSummary: {
    flex: 1,
  },
  summaryLabel: {
    fontSize: 11,
    color: '#64748B',
  },
  summaryValue: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
  },
  confirmBtn: {
    backgroundColor: '#1E3A8A',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
  },
  confirmBtnDisabled: {
    backgroundColor: '#94A3B8',
  },
  confirmBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
});
