import React, { useMemo, useState } from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
} from 'react-native';

const WATCHLIST = [
  { symbol: 'LT', side: 'LONG', price: 4072.3, trigger: 4089, stop: 4061.4 },
  { symbol: 'DLF', side: 'LONG', price: 681.3, trigger: 684.45, stop: 675.25 },
  { symbol: 'HDFCAMC', side: 'LONG', price: 2616, trigger: 2630, stop: 2530 },
  { symbol: 'LODHA', side: 'LONG', price: 1242.2, trigger: 1259.45, stop: 1236.8 },
  { symbol: 'BHARTIARTL', side: 'LONG', price: 1949.4, trigger: 1963.02, stop: 1940.5 },
];

function WatchCard({ item, onPress }) {
  const distance = ((item.trigger - item.price) / item.price) * 100;
  const reached = distance <= 0;
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.85}>
      <View style={styles.cardTop}>
        <View>
          <Text style={styles.symbol}>{item.symbol}</Text>
          <Text style={styles.meta}>{item.side} · FUTURES/CASH</Text>
        </View>
        <View style={[styles.badge, reached ? styles.badgeHot : styles.badgeWatch]}>
          <Text style={styles.badgeText}>{reached ? 'TRIGGERED' : 'WATCH'}</Text>
        </View>
      </View>
      <View style={styles.priceRow}>
        <Text style={styles.price}>₹{item.price.toLocaleString('en-IN')}</Text>
        <Text style={styles.distance}>{Math.abs(distance).toFixed(2)}% to trigger</Text>
      </View>
      <View style={styles.levelRow}>
        <View><Text style={styles.label}>Trigger</Text><Text style={styles.level}>₹{item.trigger.toLocaleString('en-IN')}</Text></View>
        <View><Text style={styles.label}>Stop</Text><Text style={styles.level}>₹{item.stop.toLocaleString('en-IN')}</Text></View>
      </View>
    </TouchableOpacity>
  );
}

function HomeScreen({ onOpen }) {
  const sorted = useMemo(() => [...WATCHLIST].sort((a, b) => Math.abs(a.trigger - a.price) - Math.abs(b.trigger - b.price)), []);
  return (
    <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
      <View style={styles.hero}>
        <Text style={styles.eyebrow}>MAVERICK PRO</Text>
        <Text style={styles.title}>Trading desk, in your pocket.</Text>
        <Text style={styles.subtitle}>Mobile demo · local sample data only</Text>
      </View>
      <View style={styles.summaryRow}>
        <View style={styles.summaryBox}><Text style={styles.summaryValue}>5</Text><Text style={styles.summaryLabel}>Watchlist</Text></View>
        <View style={styles.summaryBox}><Text style={styles.summaryValue}>0</Text><Text style={styles.summaryLabel}>Open Trades</Text></View>
        <View style={styles.summaryBox}><Text style={styles.summaryValue}>1</Text><Text style={styles.summaryLabel}>Alerts</Text></View>
      </View>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Closest to trigger</Text>
        <Text style={styles.sectionAction}>Auto sorted</Text>
      </View>
      {sorted.map((item) => <WatchCard key={item.symbol} item={item} onPress={() => onOpen(item)} />)}
    </ScrollView>
  );
}

function Placeholder({ title, text }) {
  return <View style={styles.placeholder}><Text style={styles.placeholderTitle}>{title}</Text><Text style={styles.placeholderText}>{text}</Text></View>;
}

function DetailScreen({ stock, onBack }) {
  const risk = ((stock.price - stock.stop) / stock.price) * 100;
  const reward = ((stock.trigger - stock.price) / stock.price) * 100;
  return (
    <ScrollView contentContainerStyle={styles.scrollContent}>
      <TouchableOpacity onPress={onBack} style={styles.backButton}><Text style={styles.backText}>‹ Watchlist</Text></TouchableOpacity>
      <Text style={styles.detailSymbol}>{stock.symbol}</Text>
      <Text style={styles.detailPrice}>₹{stock.price.toLocaleString('en-IN')}</Text>
      <Text style={styles.subtitle}>LONG · sample mobile detail view</Text>
      <View style={styles.detailPanel}>
        <Text style={styles.panelTitle}>Trade levels</Text>
        <View style={styles.metric}><Text style={styles.label}>Trigger</Text><Text style={styles.metricValue}>₹{stock.trigger.toLocaleString('en-IN')}</Text></View>
        <View style={styles.metric}><Text style={styles.label}>Stop loss</Text><Text style={styles.metricValue}>₹{stock.stop.toLocaleString('en-IN')}</Text></View>
        <View style={styles.metric}><Text style={styles.label}>Distance to trigger</Text><Text style={styles.metricValue}>{reward.toFixed(2)}%</Text></View>
        <View style={styles.metric}><Text style={styles.label}>Risk to stop</Text><Text style={styles.metricValue}>{risk.toFixed(2)}%</Text></View>
      </View>
      <View style={styles.detailPanel}>
        <Text style={styles.panelTitle}>Rule check</Text>
        <Text style={styles.rule}>✓ Futures or Cash only</Text>
        <Text style={styles.rule}>✓ Stop loss defined</Text>
        <Text style={styles.rule}>✓ Setup not marked as chase</Text>
        <Text style={styles.ruleMuted}>Entry timing and live verification are intentionally disabled in this demo.</Text>
      </View>
    </ScrollView>
  );
}

export default function App() {
  const [tab, setTab] = useState('Home');
  const [selected, setSelected] = useState(null);
  const body = selected ? <DetailScreen stock={selected} onBack={() => setSelected(null)} /> : tab === 'Home' ? <HomeScreen onOpen={setSelected} /> : tab === 'Scanner' ? <Placeholder title="Scanner" text="Mobile scanner screen placeholder for your test." /> : tab === 'Journal' ? <Placeholder title="Journal" text="Journal screen placeholder. No persistence is connected." /> : <Placeholder title="Settings" text="Settings placeholder. This build has no login, sync or APIs." />;
  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" />
      <View style={styles.app}>{body}</View>
      {!selected && <View style={styles.nav}>{['Home', 'Scanner', 'Journal', 'Settings'].map((name) => <TouchableOpacity key={name} style={styles.navItem} onPress={() => setTab(name)}><Text style={[styles.navText, tab === name && styles.navTextActive]}>{name}</Text></TouchableOpacity>)}</View>}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#0A0B0F' }, app: { flex: 1 }, scrollContent: { padding: 18, paddingBottom: 28 },
  hero: { marginTop: 10, marginBottom: 22 }, eyebrow: { color: '#8B93A7', fontSize: 12, fontWeight: '800', letterSpacing: 1.6 },
  title: { color: '#F7F8FB', fontSize: 30, lineHeight: 36, fontWeight: '800', marginTop: 8 }, subtitle: { color: '#8B93A7', fontSize: 14, marginTop: 8 },
  summaryRow: { flexDirection: 'row', gap: 10, marginBottom: 26 }, summaryBox: { flex: 1, backgroundColor: '#12141A', borderWidth: 1, borderColor: '#20232C', borderRadius: 16, padding: 14 },
  summaryValue: { color: '#F7F8FB', fontSize: 22, fontWeight: '800' }, summaryLabel: { color: '#777F91', fontSize: 11, marginTop: 4 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }, sectionTitle: { color: '#F7F8FB', fontSize: 18, fontWeight: '700' }, sectionAction: { color: '#7F89A3', fontSize: 12 },
  card: { backgroundColor: '#12141A', borderWidth: 1, borderColor: '#20232C', borderRadius: 18, padding: 16, marginBottom: 12 }, cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  symbol: { color: '#FFFFFF', fontSize: 20, fontWeight: '800' }, meta: { color: '#70788A', fontSize: 11, marginTop: 4 }, badge: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 10 }, badgeWatch: { backgroundColor: '#202632' }, badgeHot: { backgroundColor: '#322326' }, badgeText: { color: '#D7DBE7', fontSize: 10, fontWeight: '800' },
  priceRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', marginTop: 20 }, price: { color: '#F7F8FB', fontSize: 26, fontWeight: '800' }, distance: { color: '#AEB5C6', fontSize: 12 },
  levelRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 18, borderTopWidth: 1, borderTopColor: '#20232C', paddingTop: 14 }, label: { color: '#70788A', fontSize: 11, textTransform: 'uppercase', letterSpacing: 0.7 }, level: { color: '#DCE0EA', fontSize: 15, fontWeight: '700', marginTop: 5 },
  nav: { height: 72, flexDirection: 'row', backgroundColor: '#0E1015', borderTopWidth: 1, borderTopColor: '#20232C', paddingBottom: 6 }, navItem: { flex: 1, alignItems: 'center', justifyContent: 'center' }, navText: { color: '#677084', fontSize: 11, fontWeight: '700' }, navTextActive: { color: '#FFFFFF' },
  placeholder: { flex: 1, padding: 24, justifyContent: 'center' }, placeholderTitle: { color: '#FFFFFF', fontSize: 32, fontWeight: '800' }, placeholderText: { color: '#8B93A7', fontSize: 15, lineHeight: 22, marginTop: 10 },
  backButton: { marginTop: 8, marginBottom: 20 }, backText: { color: '#AAB1C0', fontSize: 15 }, detailSymbol: { color: '#FFFFFF', fontSize: 34, fontWeight: '900' }, detailPrice: { color: '#FFFFFF', fontSize: 28, fontWeight: '800', marginTop: 6 },
  detailPanel: { backgroundColor: '#12141A', borderWidth: 1, borderColor: '#20232C', borderRadius: 18, padding: 16, marginTop: 18 }, panelTitle: { color: '#FFFFFF', fontSize: 17, fontWeight: '800', marginBottom: 12 },
  metric: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 11, borderBottomWidth: 1, borderBottomColor: '#20232C' }, metricValue: { color: '#F5F6FA', fontSize: 15, fontWeight: '700' },
  rule: { color: '#D8DDE8', fontSize: 14, marginTop: 10 }, ruleMuted: { color: '#747C8F', fontSize: 12, lineHeight: 18, marginTop: 14 },
});
