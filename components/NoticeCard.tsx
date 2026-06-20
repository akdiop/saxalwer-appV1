import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native';

type Props = {
  title: string;
  description: string;
  iconName?: React.ComponentProps<typeof Ionicons>['name'];
  accentColor?: string;
  style?: StyleProp<ViewStyle>;
};

const DEFAULT_ACCENT = '#B5622A';

export default function NoticeCard({
  title,
  description,
  iconName = 'cloud-offline-outline',
  accentColor = DEFAULT_ACCENT,
  style,
}: Props) {
  return (
    <View
      style={[
        styles.card,
        {
          borderColor: `${accentColor}28`,
        },
        style,
      ]}
    >
      <View style={[styles.iconWrap, { backgroundColor: `${accentColor}14` }]}>
        <Ionicons name={iconName} size={16} color={accentColor} />
      </View>
      <View style={styles.textWrap}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description}>{description}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    borderRadius: 14,
    borderWidth: 1,
    backgroundColor: '#FFFDF9',
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  iconWrap: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textWrap: {
    flex: 1,
  },
  title: {
    color: '#1A3C34',
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 2,
  },
  description: {
    color: '#4A2F27',
    fontSize: 12,
    lineHeight: 18,
  },
});
