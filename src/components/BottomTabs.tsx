import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { TabType } from '../types/room';

interface BottomTabsProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  bookingsCount: number;
}

export function BottomTabs({ activeTab, onTabChange, bookingsCount }: BottomTabsProps) {
  const tabs: { key: TabType; label: string; icon: string }[] = [
    { key: 'browse', label: 'Browse Rooms', icon: '🏛️' },
    { key: 'bookings', label: 'My Bookings', icon: '📅' },
    { key: 'profile', label: 'Profile', icon: '👤' },
  ];

  return (
    <View style={styles.tabBar}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.key;
        return (
          <Pressable
            key={tab.key}
            style={styles.tabItem}
            onPress={() => onTabChange(tab.key)}
            hitSlop={8}
          >
            <View style={styles.iconWrapper}>
              <Text style={styles.tabIcon}>{tab.icon}</Text>
              {tab.key === 'bookings' && bookingsCount > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{bookingsCount}</Text>
                </View>
              )}
            </View>
            <Text style={[styles.tabLabel, isActive && styles.tabLabelActive]}>
              {tab.label}
            </Text>
            {isActive && <View style={styles.activeBar} />}
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    paddingBottom: 16,
    paddingTop: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 8,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    position: 'relative',
    paddingVertical: 4,
  },
  iconWrapper: {
    position: 'relative',
  },
  tabIcon: {
    fontSize: 20,
    marginBottom: 2,
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -10,
    backgroundColor: '#EF4444',
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '800',
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748B',
  },
  tabLabelActive: {
    color: '#1E3A8A',
    fontWeight: '700',
  },
  activeBar: {
    position: 'absolute',
    top: -8,
    width: 32,
    height: 3,
    backgroundColor: '#2563EB',
    borderRadius: 2,
  },
});
