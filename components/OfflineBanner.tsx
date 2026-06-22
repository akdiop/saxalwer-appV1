import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { useApp } from '../context/appcontext';

type Props = {
	topOffset: number;
};

const COPY = {
	fr: {
		title: 'Mode hors ligne actif',
		description:
			'Les contenus locaux restent disponibles. Les actions réseau reprendront dès le retour de la connexion.',
	},
	wo: {
		title: 'Mode hors ligne bi dox na',
		description:
			'Li nekk ci appareil bi dina des disponible. Actions réseau yi dinañu tambali waat bu connexion dellusee.',
	},
} as const;

export default function OfflineBanner({ topOffset }: Props) {
	const { isOffline, language } = useApp();

	if (!isOffline) {
		return null;
	}

	const copy = COPY[language];

	return (
		<View pointerEvents="none" style={[styles.wrap, { top: topOffset }]}>
			<View style={styles.card}>
				<View style={styles.iconWrap}>
					<Ionicons name="cloud-offline-outline" size={16} color="#8A3D16" />
				</View>
				<View style={styles.textWrap}>
					<Text style={styles.title}>{copy.title}</Text>
					<Text style={styles.description}>{copy.description}</Text>
				</View>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	wrap: {
		position: 'absolute',
		left: 14,
		right: 14,
		zIndex: 43,
	},
	card: {
		flexDirection: 'row',
		alignItems: 'flex-start',
		gap: 10,
		paddingHorizontal: 12,
		paddingVertical: 10,
		borderRadius: 16,
		borderWidth: 1,
		borderColor: 'rgba(181,98,42,0.25)',
		backgroundColor: 'rgba(253,250,245,0.96)',
		shadowColor: '#000000',
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.08,
		shadowRadius: 10,
		elevation: 6,
	},
	iconWrap: {
		width: 30,
		height: 30,
		borderRadius: 15,
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: 'rgba(181,98,42,0.14)',
	},
	textWrap: {
		flex: 1,
	},
	title: {
		color: '#4A2F27',
		fontSize: 13,
		fontWeight: '700',
	},
	description: {
		marginTop: 2,
		color: '#4A2F27',
		fontSize: 11,
		lineHeight: 16,
	},
});
