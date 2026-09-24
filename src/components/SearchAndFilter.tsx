import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Pressable, ScrollView } from 'react-native';
import { FilterCriteria } from '../types/room';

interface SearchAndFilterProps {
  filter: FilterCriteria;
  onFilterChange: (updated: Partial<FilterCriteria>) => void;
  totalResults: number;
}

const BUILDINGS = ['ALL', 'Tòa nhà A', 'Tòa nhà B', 'Tòa nhà C', 'Tòa nhà K', 'Thư viện trung tâm'];
const ROOM_TYPES = [
  { key: 'ALL', label: 'Tất cả loại phòng' },
  { key: 'lab', label: 'Phòng thực hành Lab' },
  { key: 'study', label: 'Phòng tự học' },
  { key: 'meeting', label: 'Phòng họp nhóm' },
  { key: 'studio', label: 'Studio sáng tạo' },
  { key: 'seminar', label: 'Hội trường hội thảo' },
];

export function SearchAndFilter({ filter, onFilterChange, totalResults }: SearchAndFilterProps) {
  const [showExtendedFilters, setShowExtendedFilters] = useState(false);

  const activeFiltersCount =
    (filter.selectedBuilding !== 'ALL' ? 1 : 0) +
    (filter.selectedType !== 'ALL' ? 1 : 0) +
    (filter.onlyAvailable ? 1 : 0) +
    (filter.minCapacity > 0 ? 1 : 0);

  return (
    <View style={styles.container}>
      {/* Thanh tìm kiếm theo wireframe [Tìm kiếm...] [Bộ lọc ▼] */}
      <View style={styles.searchRow}>
        <View style={styles.inputWrapper}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.input}
            value={filter.searchQuery}
            onChangeText={(text) => onFilterChange({ searchQuery: text })}
            placeholder="Tìm tên phòng, mã phòng, thiết bị..."
            placeholderTextColor="#94A3B8"
            returnKeyType="search"
            autoCapitalize="none"
            clearButtonMode="while-editing"
          />
          {filter.searchQuery.length > 0 && (
            <Pressable
              hitSlop={8}
              onPress={() => onFilterChange({ searchQuery: '' })}
              style={styles.clearBtn}
            >
              <Text style={styles.clearBtnText}>✕</Text>
            </Pressable>
          )}
        </View>

        {/* Nút bật/tắt bộ lọc nâng cao */}
        <Pressable
          style={({ pressed }) => [
            styles.filterToggleBtn,
            (showExtendedFilters || activeFiltersCount > 0) && styles.filterToggleActive,
            pressed && { opacity: 0.8 },
          ]}
          onPress={() => setShowExtendedFilters(!showExtendedFilters)}
          hitSlop={6}
        >
          <Text
            style={[
              styles.filterToggleText,
              (showExtendedFilters || activeFiltersCount > 0) && styles.filterToggleTextActive,
            ]}
          >
            Bộ lọc {showExtendedFilters ? '▲' : '▼'}
          </Text>
          {activeFiltersCount > 0 && (
            <View style={styles.filterBadge}>
              <Text style={styles.filterBadgeText}>{activeFiltersCount}</Text>
            </View>
          )}
        </Pressable>
      </View>

      {/* Chip lọc nhanh cuộn ngang */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.quickChipsContainer}
      >
        <Pressable
          style={[styles.chip, filter.onlyAvailable && styles.chipActive]}
          onPress={() => onFilterChange({ onlyAvailable: !filter.onlyAvailable })}
        >
          <Text style={[styles.chipText, filter.onlyAvailable && styles.chipTextActive]}>
            {filter.onlyAvailable ? '✓ Đang còn trống' : '⚡ Đang còn trống'}
          </Text>
        </Pressable>

        {BUILDINGS.map((b) => {
          const isSelected = filter.selectedBuilding === b;
          return (
            <Pressable
              key={b}
              style={[styles.chip, isSelected && styles.chipActive]}
              onPress={() => onFilterChange({ selectedBuilding: b })}
            >
              <Text style={[styles.chipText, isSelected && styles.chipTextActive]}>
                {b === 'ALL' ? '🏢 Tất cả tòa nhà' : b}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>

      {/* Bảng bộ lọc mở rộng nhiều tiêu chí */}
      {showExtendedFilters && (
        <View style={styles.extendedPanel}>
          <Text style={styles.filterSectionTitle}>Phân Loại Phòng</Text>
          <View style={styles.chipsWrap}>
            {ROOM_TYPES.map((t) => {
              const isSelected = filter.selectedType === t.key;
              return (
                <Pressable
                  key={t.key}
                  style={[styles.chipSmall, isSelected && styles.chipSmallActive]}
                  onPress={() => onFilterChange({ selectedType: t.key })}
                >
                  <Text style={[styles.chipSmallText, isSelected && styles.chipSmallTextActive]}>
                    {t.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          <Text style={[styles.filterSectionTitle, { marginTop: 10 }]}>Sức Chứa Tối Thiểu</Text>
          <View style={styles.chipsWrap}>
            {[
              { val: 0, label: 'Mọi quy mô' },
              { val: 10, label: 'Từ 10 chỗ' },
              { val: 25, label: 'Từ 25 chỗ' },
              { val: 40, label: 'Từ 40 chỗ' },
            ].map((cap) => {
              const isSelected = filter.minCapacity === cap.val;
              return (
                <Pressable
                  key={cap.val}
                  style={[styles.chipSmall, isSelected && styles.chipSmallActive]}
                  onPress={() => onFilterChange({ minCapacity: cap.val })}
                >
                  <Text style={[styles.chipSmallText, isSelected && styles.chipSmallTextActive]}>
                    {cap.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          {activeFiltersCount > 0 && (
            <Pressable
              style={styles.resetBtn}
              onPress={() =>
                onFilterChange({
                  selectedBuilding: 'ALL',
                  selectedType: 'ALL',
                  onlyAvailable: false,
                  minCapacity: 0,
                  searchQuery: '',
                })
              }
            >
              <Text style={styles.resetBtnText}>↺ Đặt lại tất cả bộ lọc</Text>
            </Pressable>
          )}
        </View>
      )}

      {/* Thanh thông tin số lượng kết quả */}
      <View style={styles.resultsBar}>
        <Text style={styles.resultsCount}>
          Tìm thấy <Text style={styles.resultsBold}>{totalResults}</Text> phòng học VKU
        </Text>
        {activeFiltersCount > 0 && (
          <Text style={styles.activeFilterNote}>Đang áp dụng bộ lọc</Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    paddingTop: 10,
    paddingBottom: 8,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    gap: 10,
  },
  inputWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 44,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  searchIcon: {
    fontSize: 15,
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: '#0F172A',
    paddingVertical: 0,
  },
  clearBtn: {
    padding: 4,
  },
  clearBtnText: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '700',
  },
  filterToggleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    paddingHorizontal: 12,
    height: 44,
    borderRadius: 12,
    gap: 6,
  },
  filterToggleActive: {
    backgroundColor: '#EFF6FF',
    borderColor: '#3B82F6',
  },
  filterToggleText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#475569',
  },
  filterToggleTextActive: {
    color: '#1D4ED8',
  },
  filterBadge: {
    backgroundColor: '#2563EB',
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  filterBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
  },
  quickChipsContainer: {
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 4,
    gap: 8,
  },
  chip: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  chipActive: {
    backgroundColor: '#1E3A8A',
    borderColor: '#1E3A8A',
  },
  chipText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
  },
  chipTextActive: {
    color: '#FFFFFF',
  },
  extendedPanel: {
    marginHorizontal: 16,
    marginTop: 10,
    padding: 12,
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  filterSectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#334155',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
    marginBottom: 6,
  },
  chipsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  chipSmall: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 16,
  },
  chipSmallActive: {
    backgroundColor: '#2563EB',
    borderColor: '#2563EB',
  },
  chipSmallText: {
    fontSize: 12,
    color: '#475569',
    fontWeight: '500',
  },
  chipSmallTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  resetBtn: {
    alignSelf: 'flex-start',
    marginTop: 10,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  resetBtnText: {
    fontSize: 12,
    color: '#DC2626',
    fontWeight: '600',
  },
  resultsBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  resultsCount: {
    fontSize: 12,
    color: '#64748B',
  },
  resultsBold: {
    fontWeight: '700',
    color: '#0F172A',
  },
  activeFilterNote: {
    fontSize: 11,
    color: '#2563EB',
    fontWeight: '600',
  },
});
