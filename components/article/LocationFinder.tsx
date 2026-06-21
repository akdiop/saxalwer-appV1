import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { CENTERS_DATA } from '../../data/centers';

type LocationFinderProps = {
  language: 'fr' | 'wo';
  filterTags?: string[];
  headline?: string;
  maxItems?: number;
  compact?: boolean;
};

const CENTERS = Object.values(CENTERS_DATA);

export function LocationFinder({
  language,
  filterTags = [],
  headline,
  maxItems = 2,
}: LocationFinderProps) {
  const router = useRouter();
  const filtered =
    filterTags.length === 0
      ? CENTERS
      : CENTERS.filter((center) => {
          const haystack = [
            center.type,
            center.location,
            center.description,
            ...center.tags,
            ...center.services.map((service) => service.label),
          ]
            .join(' ')
            .toLowerCase();

          return filterTags.some((tag) => haystack.includes(tag.toLowerCase()));
        });

  const visibleCenters = (filtered.length > 0 ? filtered : CENTERS).slice(0, maxItems);

  return (
    <View style={styles.wrap}>
      <Text style={styles.title}>
        {headline || (language === 'wo' ? 'Centre yi ci sa wet' : 'Centres proches de vous')}
      </Text>

      <View style={styles.list}>
        {visibleCenters.map((center) => (
          <Pressable
            key={center.id}
            style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
            onPress={() => router.push(`/carte/${center.id}` as never)}
          >
            <View style={styles.cardTopRow}>
              <View style={styles.cardTopTextWrap}>
                <Text style={styles.name}>{center.name}</Text>
                <Text style={styles.city}>{center.location}</Text>
              </View>

              <View style={[styles.statusPill, center.isOpen ? styles.statusOpen : styles.statusClosed]}>
                <Text style={[styles.statusText, center.isOpen ? styles.statusTextOpen : styles.statusTextClosed]}>
                  {center.isOpen
                    ? language === 'wo'
                      ? 'Ubbeeku'
                      : 'Ouvert'
                    : language === 'wo'
                    ? 'Tëj'
                    : 'Fermé'}
                </Text>
              </View>
            </View>

            <View style={styles.tagsRow}>
              {center.tags.slice(0, 2).map((tag) => (
                <View key={tag} style={styles.tagPill}>
                  <Text style={styles.tagText}>{tag}</Text>
                </View>
              ))}
            </View>

            <View style={styles.metaRow}>
              <View style={styles.metaItem}>
                <Ionicons name="location-outline" size={12} color="#7D5A44" />
                <Text style={styles.metaText}>{center.distance}</Text>
              </View>

              <View style={styles.metaItem}>
                <Ionicons name="star" size={12} color="#D4AF37" />
                <Text style={styles.metaText}>{center.rating.toFixed(1)}</Text>
              </View>

              <View style={styles.metaItem}>
                <Ionicons name="chevron-forward" size={12} color="#B5622A" />
                <Text style={styles.linkText}>
                  {language === 'wo' ? 'Gis centre bi' : 'Voir le centre'}
                </Text>
              </View>
            </View>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

export default LocationFinder;

const styles = StyleSheet.create({
  wrap: {
    marginTop: 12,
    borderRadius: 14,
    padding: 12,
    backgroundColor: '#F8F1E7',
    borderWidth: 1,
    borderColor: 'rgba(181,98,42,0.20)',
    gap: 8,
  },
  title: {
    fontSize: 12,
    fontWeight: '700',
    color: '#4A2F27',
  },
  list: {
    gap: 8,
  },
  card: {
    borderRadius: 12,
    padding: 10,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: 'rgba(181,98,42,0.15)',
  },
  cardPressed: {
    opacity: 0.82,
  },
  cardTopRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 8,
  },
  cardTopTextWrap: {
    flex: 1,
  },
  name: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1A3C34',
  },
  city: {
    fontSize: 11,
    color: '#4A2F27',
    opacity: 0.7,
    marginTop: 2,
    marginBottom: 6,
  },
  statusPill: {
    borderRadius: 99,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  statusOpen: {
    backgroundColor: 'rgba(26,60,52,0.10)',
  },
  statusClosed: {
    backgroundColor: 'rgba(166,93,64,0.10)',
  },
  statusText: {
    fontSize: 10,
    fontWeight: '700',
  },
  statusTextOpen: {
    color: '#1A3C34',
  },
  statusTextClosed: {
    color: '#A65D40',
  },
  tagsRow: {
    flexDirection: 'row',
    gap: 6,
    flexWrap: 'wrap',
  },
  tagPill: {
    borderRadius: 99,
    paddingHorizontal: 8,
    paddingVertical: 3,
    backgroundColor: 'rgba(181,98,42,0.10)',
  },
  tagText: {
    fontSize: 10,
    color: '#B5622A',
    fontWeight: '700',
  },
  metaRow: {
    marginTop: 8,
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 10,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 10,
    color: '#7D5A44',
    fontWeight: '600',
  },
  linkText: {
    fontSize: 10,
    color: '#B5622A',
    fontWeight: '700',
  },
});
