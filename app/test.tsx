import { Text, View } from 'react-native';

export default function TestPage() {
  return (
    <View style={{ flex: 1, backgroundColor: '#F5F1E6', justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ fontSize: 24, color: '#1A3C34', fontWeight: 'bold' }}>
        Test Page Works!
      </Text>
      <Text style={{ fontSize: 14, color: '#6E5A53', marginTop: 10 }}>
        SaxalWér is loading...
      </Text>
    </View>
  );
}
