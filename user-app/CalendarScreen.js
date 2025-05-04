import { Calendar } from 'react-native-calendars';
import { SafeAreaView, View, Text, StyleSheet } from 'react-native';
import { useEffect, useState } from 'react';
import { readTable } from './supabase';

export default function CalendarScreen() {
  const [selected, setSelected] = useState(new Date().toISOString().slice(0, 10));
  const [events, setEvents] = useState({});

  function onDayPress(day) {
    setSelected(day.dateString);
  }

  async function loadMonth(year, month) {
    const from = `${year}-${String(month).padStart(2, "0")}-01`;
    const toDate = new Date(year, month, 0); 
    const to = `${year}-${String(month).padStart(2, "0")}-${String(toDate.getDate()).padStart(2, "0")}`;

    const rows = await readTable("transactions", { from, to });

    const grouped = rows.reduce((acc, item) => {
      const date = item.date.slice(0, 10);
      if (!acc[date]) acc[date] = [];
      acc[date].push({
        id: item.id,
        title: `${item.person} (${item.type} ₹${item.amount})`,
        time: item.note || '',
      });
      return acc;
    }, {});

    setEvents(grouped);
  }

  useEffect(() => {
    const today = new Date();
    loadMonth(today.getFullYear(), today.getMonth() + 1); 
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <Calendar
        onDayPress={onDayPress}
        onMonthChange={(m) => loadMonth(m.year, m.month)}
        markedDates={{
          ...Object.keys(events).reduce((acc, date) => {
            acc[date] = { marked: true, dotColor: '#4a90e2' };
            return acc;
          }, {}),
          [selected]: {
            ...(Object.keys(events).includes(selected) ? { marked: true } : {}),
            selected: true,
            selectedColor: '#4a90e2',
          },
        }}
        style={styles.calendar}
        theme={{
          backgroundColor: '#1a1a1a',
          calendarBackground: '#1a1a1a',
          dayTextColor: '#fff',
          monthTextColor: '#fff',
          todayTextColor: '#4a90e2',
          arrowColor: '#4a90e2',
          textDisabledColor: '#666',
          selectedDayBackgroundColor: '#4a90e2',
          selectedDayTextColor: '#ffffff',
          textMonthFontWeight: 'bold',
          textDayHeaderFontWeight: 'bold',
        }}
      />

      <View style={styles.eventListContainer}>
        <Text style={styles.eventListTitle}>Transactions on {selected}</Text>
        {events[selected] ? (
          events[selected].map((ev) => (
            <View key={ev.id} style={styles.eventCard}>
              <View style={styles.timeBadge}>
                <Text style={styles.timeText}>{ev.time || "—"}</Text>
              </View>
              <Text style={styles.eventText}>{ev.title}</Text>
            </View>
          ))
        ) : (
          <Text style={styles.noEventsText}>No transactions this day.</Text>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212' },
  calendar: { borderBottomWidth: 1, borderColor: '#2a2a2a' },
  eventListContainer: { padding: 16 },
  eventListTitle: { fontSize: 14, fontWeight: '700', color: '#fff', marginBottom: 8 },
  eventCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#1f1f1f', padding: 12, borderRadius: 10, marginBottom: 10 },
  timeBadge: { backgroundColor: '#4a90e2', borderRadius: 6, paddingHorizontal: 8, paddingVertical: 4, marginRight: 10 },
  timeText: { color: '#fff', fontWeight: '600', fontSize: 12 },
  eventText: { color: '#eee', fontSize: 14, fontWeight: '500' },
  noEventsText: { marginTop: 10, color: '#999', fontSize: 12, fontStyle: 'italic' },
});
