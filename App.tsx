import React, { useCallback, useMemo, useState } from 'react';
import {
  StyleSheet,
  View,
  SafeAreaView,
  Platform,
  StatusBar as RNStatusBar,
  Text,
  Animated,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { MOCK_ROOMS } from './src/data/mockRooms';
import { Booking, Room, TabType } from './src/types/room';
import { Header } from './src/components/Header';
import { BottomTabs } from './src/components/BottomTabs';
import { BrowseRoomsScreen } from './src/screens/BrowseRoomsScreen';
import { MyBookingsScreen } from './src/screens/MyBookingsScreen';
import { ProfileScreen } from './src/screens/ProfileScreen';
import { TimeSlotModal } from './src/components/TimeSlotModal';

export default function App() {
  const [rooms, setRooms] = useState<Room[]>(MOCK_ROOMS);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [activeTab, setActiveTab] = useState<TabType>('browse');
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Show transient toast notification
  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3200);
  }, []);

  // Compute live available rooms count
  const availableCount = useMemo(() => {
    return rooms.filter((r) => r.status === 'available').length;
  }, [rooms]);

  // Open booking modal for selected room
  const handleSelectRoom = useCallback((room: Room) => {
    setSelectedRoom(room);
  }, []);

  // Confirm booking & update both user bookings list and room slot status
  const handleConfirmBooking = useCallback(
    (newBooking: Booking) => {
      setBookings((prev) => [newBooking, ...prev]);

      // Update room schedule state to mark slot as booked
      setRooms((prevRooms) =>
        prevRooms.map((room) => {
          if (room.id !== newBooking.roomId) return room;

          const updatedSchedule = { ...room.timeSlots };
          const daySlots = updatedSchedule[newBooking.date];

          if (daySlots) {
            updatedSchedule[newBooking.date] = daySlots.map((slot) => {
              if (slot.id === newBooking.timeSlotId) {
                return {
                  ...slot,
                  isBooked: true,
                  bookedBy: 'You (Student 22IT001)',
                };
              }
              return slot;
            });
          }

          return {
            ...room,
            timeSlots: updatedSchedule,
          };
        })
      );

      showToast(`🎉 Success: Reserved ${newBooking.roomCode} for ${newBooking.timeSlotLabel}!`);
    },
    [showToast]
  );

  // Cancel booking & restore the slot to available
  const handleCancelBooking = useCallback(
    (bookingId: string) => {
      const target = bookings.find((b) => b.id === bookingId);
      if (!target) return;

      // Mark booking as cancelled
      setBookings((prev) =>
        prev.map((b) => (b.id === bookingId ? { ...b, status: 'cancelled' } : b))
      );

      // Free up slot in room
      setRooms((prevRooms) =>
        prevRooms.map((room) => {
          if (room.id !== target.roomId) return room;

          const updatedSchedule = { ...room.timeSlots };
          const daySlots = updatedSchedule[target.date];

          if (daySlots) {
            updatedSchedule[target.date] = daySlots.map((slot) => {
              if (slot.id === target.timeSlotId) {
                return {
                  ...slot,
                  isBooked: false,
                  bookedBy: undefined,
                };
              }
              return slot;
            });
          }

          return {
            ...room,
            timeSlots: updatedSchedule,
          };
        })
      );

      showToast(`Reservation for ${target.roomCode} has been cancelled.`);
    },
    [bookings, showToast]
  );

  const confirmedBookingsCount = useMemo(() => {
    return bookings.filter((b) => b.status === 'confirmed').length;
  }, [bookings]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="light" />

      {/* Campus Hub Header */}
      <Header availableCount={availableCount} totalRooms={rooms.length} />

      {/* Main Tab Screens */}
      <View style={styles.screenContainer}>
        {activeTab === 'browse' && (
          <BrowseRoomsScreen rooms={rooms} onSelectRoom={handleSelectRoom} />
        )}

        {activeTab === 'bookings' && (
          <MyBookingsScreen
            bookings={bookings}
            onCancelBooking={handleCancelBooking}
            onNavigateToBrowse={() => setActiveTab('browse')}
          />
        )}

        {activeTab === 'profile' && <ProfileScreen />}
      </View>

      {/* Toast Notification Banner */}
      {toastMessage && (
        <View style={styles.toast}>
          <Text style={styles.toastText}>{toastMessage}</Text>
        </View>
      )}

      {/* Interactive Time-Slot Selector Modal with Conflict Prevention */}
      <TimeSlotModal
        visible={selectedRoom !== null}
        room={selectedRoom}
        userBookings={bookings}
        onClose={() => setSelectedRoom(null)}
        onConfirmBooking={handleConfirmBooking}
      />

      {/* Bottom Tabs matching Wireframe */}
      <BottomTabs
        activeTab={activeTab}
        onTabChange={setActiveTab}
        bookingsCount={confirmedBookingsCount}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#1E3A8A',
    paddingTop: Platform.OS === 'android' ? RNStatusBar.currentHeight : 0,
  },
  screenContainer: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  toast: {
    position: 'absolute',
    bottom: 74,
    left: 16,
    right: 16,
    backgroundColor: '#0F172A',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
    zIndex: 999,
  },
  toastText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'center',
  },
});
