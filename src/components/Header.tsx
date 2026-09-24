import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface HeaderProps {
  availableCount: number;
  totalRooms: number;
}

export function Header({ availableCount, totalRooms }: HeaderProps) {
  return (
    <View style={styles.header}>
      <View style={styles.topLine}>
        <View style={styles.brandBadge}>
          <Text style={styles.brandBadgeText}>VKU</Text>
        </View>
        <Text style={styles.brandTitle}>Đặt Phòng Học & Lab</Text>
        <View style={styles.liveIndicator}>
          <View style={styles.liveDot} />
          <Text style={styles.liveText}>Trực tiếp</Text>
        </View>
      </View>

      <Text style={styles.subtitle}>
        Khoa Khoa Học Máy Tính • Trường ĐH CNTT & TT Việt - Hàn
      </Text>

      <View style={styles.pillRow}>
        <View style={styles.pillItem}>
          <Text style={styles.pillValue}>{availableCount}</Text>
          <Text style={styles.pillLabel}>Đang còn trống</Text>
        </View>
        <View style={styles.pillDivider} />
        <View style={styles.pillItem}>
          <Text style={styles.pillValue}>{totalRooms}</Text>
          <Text style={styles.pillLabel}>Tổng số phòng</Text>
        </View>
        <View style={styles.pillDivider} />
        <View style={styles.pillItem}>
          <Text style={styles.pillValue}>60fps</Text>
          <Text style={styles.pillLabel}>Kiến trúc Fabric</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#1E3A8A',
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 14,
  },
  topLine: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  brandBadge: {
    backgroundColor: '#F59E0B',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  brandBadgeText: {
    color: '#0F172A',
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  brandTitle: {
    fontSize: 19,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.3,
    flex: 1,
  },
  liveIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 12,
    gap: 4,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#34D399',
  },
  liveText: {
    color: '#34D399',
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  subtitle: {
    fontSize: 12,
    color: '#93C5FD',
    marginTop: 3,
    fontWeight: '500',
  },
  pillRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    borderRadius: 10,
    marginTop: 12,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  pillItem: {
    flex: 1,
    alignItems: 'center',
  },
  pillValue: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  pillLabel: {
    fontSize: 10,
    color: '#BFDBFE',
    marginTop: 1,
  },
  pillDivider: {
    width: 1,
    height: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
});

