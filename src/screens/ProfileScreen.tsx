import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Switch,
  Alert,
} from 'react-native';

export function ProfileScreen() {
  const [notifyReminder, setNotifyReminder] = useState(true);
  const [notifyEmail, setNotifyEmail] = useState(false);

  const handleLogout = () => {
    Alert.alert(
      'Đăng xuất',
      'Bạn có chắc chắn muốn đăng xuất tài khoản sinh viên VKU?',
      [
        { text: 'Hủy', style: 'cancel' },
        { text: 'Đăng xuất', style: 'destructive', onPress: () => {} },
      ]
    );
  };

  const handleReportIssue = () => {
    Alert.alert(
      'Báo cáo sự cố phòng học',
      'Vui lòng liên hệ trực tiếp Bộ phận Quản trị Thiết bị qua Hotline: 0236 3 667 113 hoặc gửi phản ánh về phonghoc@vku.udn.vn',
      [{ text: 'Đã hiểu' }]
    );
  };

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      {/* Thẻ sinh viên VKU Smart Campus */}
      <View style={styles.idCard}>
        <View style={styles.idCardHeader}>
          <Text style={styles.uniBadge}>TRƯỜNG ĐẠI HỌC CÔNG NGHỆ THÔNG TIN VÀ TRUYỀN THÔNG VIỆT - HÀN</Text>
          <View style={styles.statusPill}>
            <View style={styles.statusDot} />
            <Text style={styles.statusText}>Hoạt động</Text>
          </View>
        </View>

        <View style={styles.profileRow}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>VA</Text>
          </View>
          <View style={styles.profileMeta}>
            <Text style={styles.studentName}>Nguyễn Văn An</Text>
            <Text style={styles.studentId}>MSSV: 22IT001 • Lớp: 22KIT</Text>
            <Text style={styles.faculty}>Khoa Khoa Học Máy Tính</Text>
            <Text style={styles.email}>annv.22it@vku.udn.vn</Text>
          </View>
        </View>

        {/* Thống kê đặt phòng cá nhân */}
        <View style={styles.idCardFooter}>
          <View style={styles.cardStat}>
            <Text style={styles.statLabel}>Hạn mức đặt</Text>
            <Text style={styles.statVal}>3 ca / ngày</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.cardStat}>
            <Text style={styles.statLabel}>Đã sử dụng</Text>
            <Text style={styles.statVal}>12 ca</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.cardStat}>
            <Text style={styles.statLabel}>Điểm uy tín</Text>
            <Text style={styles.statVal}>100 / 100</Text>
          </View>
        </View>
      </View>

      {/* Cài đặt thông báo & tiện ích */}
      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>Cài Đặt Đặt Phòng</Text>

        <View style={styles.settingRow}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingLabel}>Nhắc nhở trước ca học</Text>
            <Text style={styles.settingDesc}>Nhận thông báo nhắc trước 15 phút khi bắt đầu ca</Text>
          </View>
          <Switch
            value={notifyReminder}
            onValueChange={setNotifyReminder}
            trackColor={{ false: '#CBD5E1', true: '#2563EB' }}
            thumbColor="#FFFFFF"
          />
        </View>

        <View style={[styles.settingRow, { borderBottomWidth: 0 }]}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingLabel}>Gửi xác nhận qua Email</Text>
            <Text style={styles.settingDesc}>Gửi thông tin biên nhận về email trường</Text>
          </View>
          <Switch
            value={notifyEmail}
            onValueChange={setNotifyEmail}
            trackColor={{ false: '#CBD5E1', true: '#2563EB' }}
            thumbColor="#FFFFFF"
          />
        </View>
      </View>

      {/* Quy định sử dụng phòng học & phòng Lab */}
      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>Quy Định Sử Dụng Phòng Học</Text>

        {[
          {
            num: '1',
            title: 'Check-in đúng giờ:',
            desc: 'Quẹt thẻ sinh viên tại cửa phòng trong vòng 15 phút kể từ đầu ca học.',
          },
          {
            num: '2',
            title: 'Chống trùng lịch:',
            desc: 'Mỗi sinh viên chỉ được đặt tối đa 1 phòng trong cùng một khung giờ.',
          },
          {
            num: '3',
            title: 'Quy định hủy ca:',
            desc: 'Vui lòng hủy lịch trước ít nhất 30 phút nếu không có nhu cầu sử dụng.',
          },
          {
            num: '4',
            title: 'Bảo quản tài sản:',
            desc: 'Tắt thiết bị điện, dàn máy tính và giữ vệ sinh không gian học trước khi rời đi.',
          },
        ].map((rule) => (
          <View key={rule.num} style={styles.ruleRow}>
            <View style={styles.ruleBadge}>
              <Text style={styles.ruleNum}>{rule.num}</Text>
            </View>
            <Text style={styles.ruleText}>
              <Text style={styles.ruleBold}>{rule.title} </Text>
              {rule.desc}
            </Text>
          </View>
        ))}
      </View>

      {/* Trung tâm hỗ trợ */}
      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>Hỗ Trợ & Phản Hồi</Text>

        <Pressable
          style={styles.actionRow}
          onPress={handleReportIssue}
          hitSlop={6}
        >
          <Text style={styles.actionIcon}>🚨</Text>
          <View style={styles.actionInfo}>
            <Text style={styles.actionLabel}>Báo cáo sự cố phòng học / máy tính</Text>
            <Text style={styles.actionDesc}>Báo hỏng máy, mất kết nối mạng hoặc điều hòa</Text>
          </View>
          <Text style={styles.actionChevron}>➔</Text>
        </Pressable>

        <View style={styles.contactItem}>
          <Text style={styles.contactIcon}>🏢</Text>
          <View style={styles.contactMeta}>
            <Text style={styles.contactTitle}>Bộ phận Quản lý Phòng học VKU</Text>
            <Text style={styles.contactText}>Văn phòng: Tầng 1, Tòa nhà A • ĐT: 0236 3 667 113</Text>
            <Text style={styles.contactText}>Email hỗ trợ: phonghoc@vku.udn.vn</Text>
          </View>
        </View>
      </View>

      {/* Nút đăng xuất */}
      <Pressable
        style={({ pressed }) => [styles.logoutBtn, pressed && { opacity: 0.85 }]}
        onPress={handleLogout}
      >
        <Text style={styles.logoutBtnText}>Đăng Xuất Tài Khoản</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  content: {
    padding: 16,
    paddingBottom: 36,
  },
  idCard: {
    backgroundColor: '#1E3A8A',
    borderRadius: 16,
    padding: 18,
    shadowColor: '#1E3A8A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
    marginBottom: 16,
  },
  idCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 14,
    gap: 8,
  },
  uniBadge: {
    flex: 1,
    color: '#F59E0B',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.4,
    lineHeight: 14,
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    gap: 5,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#34D399',
  },
  statusText: {
    color: '#34D399',
    fontSize: 10,
    fontWeight: '700',
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  avatar: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: '#3B82F6',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#93C5FD',
  },
  avatarText: {
    fontSize: 20,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  profileMeta: {
    flex: 1,
  },
  studentName: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  studentId: {
    fontSize: 12,
    color: '#93C5FD',
    marginTop: 2,
    fontWeight: '600',
  },
  faculty: {
    fontSize: 12,
    color: '#BFDBFE',
    marginTop: 1,
  },
  email: {
    fontSize: 11,
    color: '#93C5FD',
    marginTop: 1,
  },
  idCardFooter: {
    flexDirection: 'row',
    marginTop: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.15)',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardStat: {
    flex: 1,
    alignItems: 'center',
  },
  statDivider: {
    width: 1,
    height: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  statLabel: {
    fontSize: 10,
    color: '#93C5FD',
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  statVal: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
    marginTop: 2,
  },
  sectionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  settingInfo: {
    flex: 1,
    marginRight: 12,
  },
  settingLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1E293B',
  },
  settingDesc: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  ruleRow: {
    flexDirection: 'row',
    marginBottom: 10,
    gap: 10,
    alignItems: 'flex-start',
  },
  ruleBadge: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 1,
  },
  ruleNum: {
    fontSize: 11,
    fontWeight: '700',
    color: '#2563EB',
  },
  ruleText: {
    fontSize: 12,
    color: '#475569',
    lineHeight: 18,
    flex: 1,
  },
  ruleBold: {
    fontWeight: '700',
    color: '#1E293B',
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF2F2',
    padding: 12,
    borderRadius: 10,
    marginBottom: 12,
    gap: 10,
  },
  actionIcon: {
    fontSize: 20,
  },
  actionInfo: {
    flex: 1,
  },
  actionLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#991B1B',
  },
  actionDesc: {
    fontSize: 11,
    color: '#B91C1C',
    marginTop: 1,
  },
  actionChevron: {
    fontSize: 13,
    color: '#991B1B',
    fontWeight: '700',
  },
  contactItem: {
    flexDirection: 'row',
    gap: 10,
    paddingTop: 6,
  },
  contactIcon: {
    fontSize: 18,
    marginTop: 2,
  },
  contactMeta: {
    flex: 1,
  },
  contactTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#334155',
  },
  contactText: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  logoutBtn: {
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 4,
    marginBottom: 12,
  },
  logoutBtnText: {
    color: '#DC2626',
    fontSize: 14,
    fontWeight: '700',
  },
});
