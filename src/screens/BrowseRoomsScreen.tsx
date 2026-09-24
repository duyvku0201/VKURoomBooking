import React, { useCallback, useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
  Platform,
  Pressable,
} from 'react-native';
import { FilterCriteria, Room } from '../types/room';
import { RoomCard } from '../components/RoomCard';
import { SearchAndFilter } from '../components/SearchAndFilter';
import { useResponsiveLayout } from '../hooks/useResponsiveLayout';

interface BrowseRoomsScreenProps {
  rooms: Room[];
  onSelectRoom: (room: Room) => void;
}

export function BrowseRoomsScreen({ rooms, onSelectRoom }: BrowseRoomsScreenProps) {
  const { columns, cardWidth, cardGap, horizontalPadding } = useResponsiveLayout();
  const [refreshing, setRefreshing] = useState(false);

  const [filter, setFilter] = useState<FilterCriteria>({
    searchQuery: '',
    selectedBuilding: 'ALL',
    selectedType: 'ALL',
    onlyAvailable: false,
    minCapacity: 0,
  });

  const handleFilterChange = useCallback((updated: Partial<FilterCriteria>) => {
    setFilter((prev) => ({ ...prev, ...updated }));
  }, []);

  const filteredRooms = useMemo(() => {
    return rooms.filter((r) => {
      if (filter.searchQuery.trim().length > 0) {
        const query = filter.searchQuery.toLowerCase();
        const matched =
          r.name.toLowerCase().includes(query) ||
          r.code.toLowerCase().includes(query) ||
          r.building.toLowerCase().includes(query) ||
          r.amenities.some((a) => a.toLowerCase().includes(query));
        if (!matched) return false;
      }
      if (filter.selectedBuilding !== 'ALL' && r.building !== filter.selectedBuilding) return false;
      if (filter.selectedType !== 'ALL' && r.type !== filter.selectedType) return false;
      if (filter.onlyAvailable && r.status !== 'available') return false;
      if (filter.minCapacity > 0 && r.capacity < filter.minCapacity) return false;
      return true;
    });
  }, [rooms, filter]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 600);
  }, []);

  const renderItem = useCallback(
    ({ item }: { item: Room }) => (
      <RoomCard
        room={item}
        onPress={onSelectRoom}
        style={{ width: columns > 1 ? cardWidth : undefined, marginBottom: cardGap }}
      />
    ),
    [columns, cardWidth, cardGap, onSelectRoom]
  );

  const keyExtractor = useCallback((item: Room) => item.id, []);

  const ListEmpty = useCallback(
    () => (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyIcon}>🔍</Text>
        <Text style={styles.emptyTitle}>Không tìm thấy phòng phù hợp</Text>
        <Text style={styles.emptySubtitle}>
          Thử thay đổi từ khóa, bỏ lọc tòa nhà hoặc giảm sức chứa tối thiểu.
        </Text>
        <Pressable
          style={styles.resetBtn}
          onPress={() =>
            setFilter({
              searchQuery: '',
              selectedBuilding: 'ALL',
              selectedType: 'ALL',
              onlyAvailable: false,
              minCapacity: 0,
            })
          }
        >
          <Text style={styles.resetBtnText}>Xóa tất cả bộ lọc</Text>
        </Pressable>
      </View>
    ),
    []
  );

  return (
    <View style={styles.screen}>
      <SearchAndFilter
        filter={filter}
        onFilterChange={handleFilterChange}
        totalResults={filteredRooms.length}
      />
      <FlatList
        data={filteredRooms}
        key={columns}
        numColumns={columns}
        columnWrapperStyle={columns > 1 ? { gap: cardGap } : undefined}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        contentContainerStyle={[styles.listContent, { paddingHorizontal: horizontalPadding }]}
        initialNumToRender={8}
        maxToRenderPerBatch={6}
        windowSize={5}
        removeClippedSubviews={Platform.OS === 'android'}
        ListEmptyComponent={ListEmpty}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#2563EB']}
            tintColor="#2563EB"
          />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  listContent: {
    paddingTop: 14,
    paddingBottom: 24,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 32,
  },
  emptyIcon: {
    fontSize: 52,
    marginBottom: 14,
  },
  emptyTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 13,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20,
  },
  resetBtn: {
    backgroundColor: '#2563EB',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
  },
  resetBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 13,
  },
});
