import React, { memo } from 'react';
import { View, Text, StyleSheet, Image, Pressable, ViewStyle, StyleProp } from 'react-native';
import { Room } from '../types/room';

interface RoomCardProps {
  room: Room;
  onPress: (room: Room) => void;
  style?: StyleProp<ViewStyle>;
}

export const RoomCard = memo(function RoomCard({ room, onPress, style }: RoomCardProps) {
  const isAvailable = room.status === 'available';
  const isOccupied = room.status === 'occupied';

  const statusColor = isAvailable ? '#10B981' : isOccupied ? '#F43F5E' : '#F59E0B';
  const statusBg = isAvailable ? '#ECFDF5' : isOccupied ? '#FFF1F2' : '#FFFBEB';
  const statusLabel = isAvailable ? '● Đang trống' : isOccupied ? '● Đã có người' : '● Bảo trì';

  return (
    <Pressable
      style={({ pressed }) => [
        styles.card,
        style,
        pressed && styles.cardPressed,
      ]}
      onPress={() => onPress(room)}
      accessibilityRole="button"
      accessibilityLabel={`${room.name}, ${room.code}, ${room.capacity} chỗ ngồi, trạng thái: ${statusLabel}`}
      hitSlop={4}
    >
      {/* Ảnh phòng học theo wireframe */}
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: room.imageUrl }}
          style={styles.image}
          resizeMode="cover"
        />
        {/* Nhãn trạng thái nổi góc trên */}
        <View style={[styles.statusBadge, { backgroundColor: statusBg, borderColor: statusColor }]}>
          <Text style={[styles.statusText, { color: statusColor }]}>{statusLabel}</Text>
        </View>

        {/* Mã phòng nổi góc dưới */}
        <View style={styles.codeTag}>
          <Text style={styles.codeText}>{room.code}</Text>
        </View>
      </View>

      {/* Nội dung chi tiết thẻ */}
      <View style={styles.content}>
        {/* Tiêu đề & huy hiệu số chỗ */}
        <View style={styles.header}>
          <Text style={styles.roomName} numberOfLines={1}>
            {room.name}
          </Text>
          <Text style={styles.badge}>{room.capacity} chỗ</Text>
        </View>

        {/* Vị trí theo tài liệu thực hành */}
        <View style={styles.locationRow}>
          <Text style={styles.locationIcon}>📍</Text>
          <Text style={styles.location} numberOfLines={1}>
            {room.building} • {room.floor}
          </Text>
        </View>

        {/* Danh sách tiện ích nổi bật */}
        <View style={styles.amenitiesRow}>
          {room.amenities.slice(0, 3).map((amenity, index) => (
            <View key={index} style={styles.amenityTag}>
              <Text style={styles.amenityText} numberOfLines={1}>
                {amenity}
              </Text>
            </View>
          ))}
          {room.amenities.length > 3 && (
            <View style={styles.amenityMoreTag}>
              <Text style={styles.amenityMoreText}>+{room.amenities.length - 3}</Text>
            </View>
          )}
        </View>

        {/* Chân thẻ: Đánh giá sao & Nút hành động */}
        <View style={styles.footer}>
          <View style={styles.ratingBox}>
            <Text style={styles.ratingStar}>★</Text>
            <Text style={styles.ratingVal}>{room.rating.toFixed(1)}</Text>
          </View>

          <View style={[styles.actionBtn, !isAvailable && styles.actionBtnSecondary]}>
            <Text style={[styles.actionBtnText, !isAvailable && styles.actionBtnTextSecondary]}>
              {isAvailable ? 'Đặt phòng ➔' : 'Xem lịch'}
            </Text>
          </View>
        </View>
      </View>
    </Pressable>
  );
});

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    overflow: 'hidden',
  },
  cardPressed: {
    opacity: 0.92,
    transform: [{ scale: 0.992 }],
  },
  imageContainer: {
    width: '100%',
    height: 155,
    backgroundColor: '#E2E8F0',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  statusBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 20,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  codeTag: {
    position: 'absolute',
    bottom: 8,
    left: 10,
    backgroundColor: 'rgba(15, 23, 42, 0.82)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  codeText: {
    color: '#F8FAFC',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.4,
  },
  content: {
    padding: 14,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 8,
  },
  roomName: {
    flex: 1,
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
    letterSpacing: -0.2,
  },
  badge: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
    backgroundColor: '#2563EB',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    overflow: 'hidden',
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  locationIcon: {
    fontSize: 12,
    marginRight: 4,
  },
  location: {
    fontSize: 13,
    color: '#64748B',
    fontWeight: '500',
    flex: 1,
  },
  amenitiesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 10,
  },
  amenityTag: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 6,
  },
  amenityText: {
    fontSize: 11,
    color: '#475569',
    fontWeight: '500',
  },
  amenityMoreTag: {
    backgroundColor: '#E2E8F0',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 6,
  },
  amenityMoreText: {
    fontSize: 11,
    color: '#334155',
    fontWeight: '600',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#F8FAFC',
  },
  ratingBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  ratingStar: {
    color: '#F59E0B',
    fontSize: 14,
  },
  ratingVal: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1E293B',
  },
  actionBtn: {
    backgroundColor: '#1E3A8A',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  actionBtnSecondary: {
    backgroundColor: '#E2E8F0',
  },
  actionBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  actionBtnTextSecondary: {
    color: '#334155',
  },
});
