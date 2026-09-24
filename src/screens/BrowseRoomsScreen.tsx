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

  // Filter criteria state
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

  // Filter rooms based on query and multi-parameters
  const filteredRooms = useMemo(() => {
    return rooms.filter((r) => {
      // 1. Search Query filter (matches name, code, building, or amenities)
      if (filter.searchQuery.trim().length > 0) {
        const query = filter.searchQuery.toLowerCase();
        const matchesName = r.name.toLowerCase().includes(query);
        const matchesCode = r.code.toLowerCase().includes(query);
        const matchesBuilding = r.building.toLowerCase().includes(query);
        const matchesAmenity = r.amenities.some((a) => a.toLowerCase().includes(query));
        if (!matchesName && !matchesCode && !matchesBuilding && !matchesAmenity) {
          return false;
        }
      }

      // 2. Building filter
      if (filter.selectedBuilding !== 'ALL' && r.building !== filter.selectedBuilding) {
        return false;
      }

      // 3. Room type filter
      if (filter.selectedType !== 'ALL' && r.type !== filter.selectedType) {
        return false;
      }

      // 4. Availability filter
      if (filter.onlyAvailable && r.status !== 'available') {
        return false;
      }

      // 5. Capacity filter
      if (filter.minCapacity > 0 && r.capacity < filter.minCapacity) {
        return false;
      }

      return true;
    });
  }, [rooms, filter]);

  // Pull-to-refresh simulation
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 600);
  }, []);

  // Render individual RoomCard matching wireframe
  const renderItem = useCallback(
    ({ item }: { item: Room }) => {
      return (
        <RoomCard
          room={item}
          onPress={onSelectRoom}
          style={{
            width: columns > 1 ? cardWidth : undefined,
            marginBottom: cardGap,
          }}
        />
      );
    },
    [columns, cardWidth, cardGap, onSelectRoom]
  );

  const keyExtractor = useCallback((item: Room) => item.id, []);

  // Empty search state
  const renderEmptyComponent = useCallback(() => {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyIcon}>🔍</Text>
        <Text style={styles.emptyTitle}>No Matching Rooms Found</Text>
        <Text style={styles.emptySubtitle}>
          Try adjusting your search keywords, clearing building filters, or reducing the capacity filter.
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
          <Text style={styles.resetBtnText}>Clear All Filters</Text>
        </Pressable>
      </View>
    );
  }, []);

  // List Footer
  const renderFooter = useCallback(() => {
    if (filteredRooms.length === 0) return null;
    return (
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          ⚡ 60fps Feed Powered by React Native Fabric & TurboModules
        </Text>
        <Text style={styles.footerSubText}>
          Vietnam-Korea University of Information and Communication Technology
        </Text>
      </View>
    );
  }, [filteredRooms.length]);

  return (
    <View style={styles.screen}>
      {/* Search and multi-parameter filter chips bar */}
      <SearchAndFilter
        filter={filter}
        onFilterChange={handleFilterChange}
        totalResults={filteredRooms.length}
      />

      {/* High-performance FlatList Feed matching lecture slide 183 & 277 */}
      <FlatList
        data={filteredRooms}
        key={columns} // Force re-layout when switching between portrait/landscape/tablet
        numColumns={columns}
        columnWrapperStyle={columns > 1 ? { gap: cardGap } : undefined}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        contentContainerStyle={[
          styles.listContent,
          { paddingHorizontal: horizontalPadding },
        ]}
        // 60fps performance optimizations
        initialNumToRender={8}
        maxToRenderPerBatch={6}
        windowSize={5}
        removeClippedSubviews={Platform.OS === 'android'}
        ListEmptyComponent={renderEmptyComponent}
        ListFooterComponent={renderFooter}
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
    justifyContent: 'center',
    paddingVertical: 50,
    paddingHorizontal: 24,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 6,
  },
  emptySubtitle: {
    fontSize: 13,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 16,
  },
  resetBtn: {
    backgroundColor: '#2563EB',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },
  resetBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 13,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 20,
    marginTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  footerText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#2563EB',
  },
  footerSubText: {
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 4,
    textAlign: 'center',
  },
});
