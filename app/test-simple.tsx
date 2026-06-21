import { Text, View } from 'react-native';

export default function TestSimple() {
  return (
    <View style={{ flex: 1, backgroundColor: '#ffffff', justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ fontSize: 32, color: '#000000', fontWeight: 'bold' }}>
        HELLO WORLD!
      </Text>
      <Text style={{ fontSize: 16, color: '#666666', marginTop: 10 }}>
        If you see this, React Native Web works
      </Text>
    </View>
  );
}
