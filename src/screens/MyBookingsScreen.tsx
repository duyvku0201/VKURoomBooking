import React from 'react';
import { View, Text, StyleSheet, FlatList, Pressable, Alert } from 'react-native';
import { Booking } from '../types/room';

interface MyBookingsScreenProps {
  bookings: Booking[];
  onCancelBooking: (bookingId: string) => void;
  onNavigateToBrowse: () => void;
}

export function MyBookingsScreen({
  bookings,
  onCancelBooking,
  onNavigateToBrowse,
}: MyBookingsScreenProps) {
  const activeBookings = bookings.filter((b) => b.status === 'confirmed');
  const pastBookings = bookings.filter((b) => b.status === 'cancelled');

  const handleConfirmCancel = (booking: Booking) => {
    Alert.alert(
      'Cancel Reservation?',
      `Are you sure you want to cancel your reservation for ${booking.roomName} on ${booking.date} (${booking.timeSlotLabel})?`,
      [
        { text: 'Keep Booking', style: 'cancel' },
        {
          text: 'Yes, Cancel',
          style: 'destructive',
          onPress: () => onCancelBooking(booking.id),
        },
      ]
    );
  };

  const renderBookingItem = ({ item }: { item: Booking }) => {
    const isConfirmed = item.status === 'confirmed';

    return (
      <View style={[styles.bookingCard, !isConfirmed && styles.bookingCardCancelled]}>
        <View style={styles.cardHeader}>
          <View style={styles.codeBadge}>
            <Text style={styles.codeText}>{item.roomCode}</Text>
          </View>
          <View
            style={[
              styles.statusPill,
              isConfirmed ? styles.statusConfirmed : styles.statusCancelled,
            ]}
          >
            <Text
              style={[
                styles.statusText,
                isConfirmed ? styles.statusConfirmedText : styles.statusCancelledText,
              ]}
            >
              {isConfirmed ? '✓ Confirmed' : '✕ Cancelled'}
            </Text>
          </View>
        </View>

        <Text style={styles.roomName}>{item.roomName}</Text>
        <Text style={styles.buildingText}>📍 {item.building}</Text>

        <View style={styles.slotDetailRow}>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Date</Text>
            <Text style={styles.detailVal}>📅 {item.date}</Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Time Slot ({item.period})</Text>
            <Text style={styles.detailVal}>⏰ {item.timeSlotLabel}</Text>
          </View>
        </View>

        {item.purpose && (
          <View style={styles.purposeBox}>
            <Text style={styles.purposeLabel}>Purpose:</Text>
            <Text style={styles.purposeVal}>{item.purpose}</Text>
          </View>
        )}

        <View style={styles.cardFooter}>
          <Text style={styles.refCode}>Ref: #{item.id.slice(-6)}</Text>
          {isConfirmed && (
            <Pressable
              style={styles.cancelBtn}
              onPress={() => handleConfirmCancel(item)}
              hitSlop={8}
            >
              <Text style={styles.cancelBtnText}>Cancel Booking</Text>
            </Pressable>
          )}
        </View>
      </View>
    );
  };

  return (
    <View style={styles.screen}>
      <View style={styles.headerBar}>
        <Text style={styles.title}>My Campus Bookings</Text>
        <Text style={styles.subtitle}>
          Manage your study room reservations & conflict-free slots
        </Text>
      </View>

      {bookings.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>📅</Text>
          <Text style={styles.emptyTitle}>No Active Bookings</Text>
          <Text style={styles.emptyText}>
            You haven't booked any rooms yet. Browse VKU campus study rooms and secure a slot!
          </Text>
          <Pressable style={styles.browseBtn} onPress={onNavigateToBrowse}>
            <Text style={styles.browseBtnText}>Browse Available Rooms ➔</Text>
          </Pressable>
        </View>
      ) : (
        <FlatList
          data={[...activeBookings, ...pastBookings]}
          keyExtractor={(item) => item.id}
          renderItem={renderBookingItem}
          contentContainerStyle={styles.listContent}
          ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  headerBar: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0F172A',
  },
  subtitle: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  listContent: {
    padding: 16,
  },
  bookingCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  bookingCardCancelled: {
    opacity: 0.6,
    backgroundColor: '#F8FAFC',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  codeBadge: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  codeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1D4ED8',
  },
  statusPill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
  },
  statusConfirmed: {
    backgroundColor: '#ECFDF5',
  },
  statusCancelled: {
    backgroundColor: '#FEF2F2',
  },
  statusText: {
    fontSize: 11,
    fontWeight: '700',
  },
  statusConfirmedText: {
    color: '#059669',
  },
  statusCancelledText: {
    color: '#DC2626',
  },
  roomName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E293B',
  },
  buildingText: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 2,
  },
  slotDetailRow: {
    flexDirection: 'row',
    backgroundColor: '#F1F5F9',
    borderRadius: 8,
    padding: 10,
    marginTop: 12,
    gap: 12,
  },
  detailItem: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 10,
    color: '#64748B',
    textTransform: 'uppercase',
    fontWeight: '700',
  },
  detailVal: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1E293B',
    marginTop: 2,
  },
  purposeBox: {
    marginTop: 10,
    paddingHorizontal: 4,
  },
  purposeLabel: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '600',
  },
  purposeVal: {
    fontSize: 12,
    color: '#334155',
    fontStyle: 'italic',
    marginTop: 1,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 14,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  refCode: {
    fontSize: 11,
    color: '#94A3B8',
    fontWeight: '600',
  },
  cancelBtn: {
    backgroundColor: '#FEE2E2',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  cancelBtnText: {
    color: '#B91C1C',
    fontSize: 11,
    fontWeight: '700',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  emptyIcon: {
    fontSize: 54,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E293B',
  },
  emptyText: {
    fontSize: 13,
    color: '#64748B',
    textAlign: 'center',
    marginTop: 6,
    lineHeight: 18,
  },
  browseBtn: {
    backgroundColor: '#1E3A8A',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 10,
    marginTop: 20,
  },
  browseBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 13,
  },
});
