import React from 'react';
import { Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer';
import { format } from 'date-fns';

// Register Arabic font
Font.register({
  family: 'NotoSansArabic',
  src: 'https://cdn.jsdelivr.net/npm/@fontsource/noto-sans-arabic/files/noto-sans-arabic-arabic-400-normal.woff'
});

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontFamily: 'NotoSansArabic',
    direction: 'rtl'
  },
  title: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center'
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    fontSize: 12
  },
  headerItem: {
    marginBottom: 5
  },
  table: {
    marginTop: 10,
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#000'
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    minHeight: 25,
    alignItems: 'center'
  },
  tableCell: {
    padding: 4,
    fontSize: 10,
    textAlign: 'center',
    borderRightWidth: 1,
    borderRightColor: '#000'
  },
  summary: {
    marginTop: 20,
    fontSize: 12
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5
  },
  signature: {
    marginTop: 30,
    fontSize: 10
  }
});

interface AttendancePDFProps {
  teacherName: string;
  subject: string;
  level: string;
  etudeName: string;
  students: any[];
  sessions: any[];
  totalAmount: number;
  teacherShare: number;
  servicesFee: number;
}

export const AttendancePDF: React.FC<AttendancePDFProps> = ({
  teacherName,
  subject,
  level,
  etudeName,
  students,
  sessions,
  totalAmount,
  teacherShare,
  servicesFee
}) => {
  const getStatusSymbol = (status: string) => {
    switch (status) {
      case 'present':
        return '+';
      case 'absent_verified':
        return 'A';
      default:
        return '-';
    }
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>بطاقة حضور دروس التدارك</Text>

        <View style={styles.header}>
          <View>
            <Text style={styles.headerItem}>الاستاذ: {teacherName}</Text>
            <Text style={styles.headerItem}>المستوى: {level}</Text>
          </View>
          <View>
            <Text style={styles.headerItem}>المادة: {subject}</Text>
            <Text style={styles.headerItem}>الدراسة: {etudeName}</Text>
          </View>
        </View>

        <View style={styles.table}>
          <View style={styles.tableRow}>
            <View style={[styles.tableCell, { width: '5%' }]}>
              <Text>ع/ر</Text>
            </View>
            <View style={[styles.tableCell, { width: '25%' }]}>
              <Text>الاسم و اللقب</Text>
            </View>
            <View style={[styles.tableCell, { width: '15%' }]}>
              <Text>القسم</Text>
            </View>
            {sessions.map(session => (
              <View key={session._id} style={[styles.tableCell, { width: `${40 / sessions.length}%` }]}>
                <Text>{format(new Date(session.date), 'MM/dd')}</Text>
              </View>
            ))}
            <View style={[styles.tableCell, { width: '15%' }]}>
              <Text>المبلغ</Text>
            </View>
          </View>

          {students.map((student, index) => (
            <View key={student._id} style={styles.tableRow}>
              <View style={[styles.tableCell, { width: '5%' }]}>
                <Text>{index + 1}</Text>
              </View>
              <View style={[styles.tableCell, { width: '25%' }]}>
                <Text>{student.name}</Text>
              </View>
              <View style={[styles.tableCell, { width: '15%' }]}>
                <Text>{student.class}</Text>
              </View>
              {sessions.map(session => {
                const record = session.attendanceRecords.find(
                  r => r.student === student._id
                );
                return (
                  <View key={session._id} style={[styles.tableCell, { width: `${40 / sessions.length}%` }]}>
                    <Text>{getStatusSymbol(record?.status || '')}</Text>
                  </View>
                );
              })}
              <View style={[styles.tableCell, { width: '15%' }]}>
                <Text>{calculateStudentAmount(student._id, sessions)} د</Text>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.summary}>
          <View style={styles.summaryRow}>
            <Text>المبلغ الجملي: {totalAmount.toFixed(3)} د</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text>مناب الأستاذ (80%): {teacherShare.toFixed(3)} د</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text>الخصم بعنوان خدمات (20%): {servicesFee.toFixed(3)} د</Text>
          </View>
        </View>

        <View style={styles.signature}>
          <Text>إني الممضي أسفله</Text>
          <Text>أشهد أني تسلمت المبلغ {teacherShare.toFixed(3)} د</Text>
          <Text>بتاريخ {format(new Date(), 'yyyy/MM/dd')}</Text>
          <Text>الإمضاء: _________________</Text>
        </View>
      </Page>
    </Document>
  );
};

const calculateStudentAmount = (studentId: string, sessions: any[]) => {
  const presentCount = sessions.reduce((count, session) => {
    const record = session.attendanceRecords.find(
      r => r.student === studentId && r.status === 'present'
    );
    return count + (record ? 1 : 0);
  }, 0);
  return (presentCount * 35).toFixed(3); // Using base amount of 35
};