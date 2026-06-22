import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

type AppLockOverlayProps = {
	language: 'fr' | 'wo';
	onUnlock: (code: string) => Promise<boolean>;
};

export default function AppLockOverlay({ language, onUnlock }: AppLockOverlayProps) {
	const [code, setCode] = React.useState('');
	const [error, setError] = React.useState('');
	const [isSubmitting, setIsSubmitting] = React.useState(false);
	const isWo = language === 'wo';
	const canSubmit = code.trim().length === 4 && !isSubmitting;

	const handleUnlock = async () => {
		if (!canSubmit) {
			return;
		}

		setIsSubmitting(true);
		setError('');
		const success = await onUnlock(code);
		setIsSubmitting(false);

		if (success) {
			setCode('');
			return;
		}

		setCode('');
		setError(isWo ? 'Code bi baaxul.' : 'Code incorrect.');
	};

	return (
		<View style={styles.overlay}>
			<View style={styles.card}>
				<View style={styles.iconWrap}>
					<Ionicons color="#1A3C34" name="lock-closed" size={24} />
				</View>

				<Text style={styles.title}>{isWo ? 'App bi dafa teju' : 'Application verrouillee'}</Text>
				<Text style={styles.subtitle}>
					{isWo
						? 'Dugal sa code secret ngir dugg ci biir.'
						: "Entre ton code secret pour rouvrir l'application."}
				</Text>

				<TextInput
					autoFocus
					keyboardType="number-pad"
					maxLength={4}
					onChangeText={(value) => {
						setCode(value.replace(/[^0-9]/g, ''));
						if (error) {
							setError('');
						}
					}}
					onSubmitEditing={() => void handleUnlock()}
					placeholder="0000"
					placeholderTextColor="rgba(74,47,39,0.35)"
					secureTextEntry
					selectTextOnFocus
					style={styles.input}
					textContentType="oneTimeCode"
					value={code}
				/>

				{error ? <Text style={styles.errorText}>{error}</Text> : null}

				<Pressable
					accessibilityRole="button"
					onPress={() => void handleUnlock()}
					style={({ pressed }) => [
						styles.primaryButton,
						!canSubmit && styles.primaryButtonDisabled,
						pressed && canSubmit ? styles.primaryButtonPressed : null,
					]}
				>
					{isSubmitting ? (
						<ActivityIndicator color="#FFFFFF" />
					) : (
						<Text style={styles.primaryButtonText}>{isWo ? 'Ubbi' : 'Deverrouiller'}</Text>
					)}
				</Pressable>

				<Text style={styles.helperText}>
					{isWo
						? 'Code bi des na ci appareil bii rekk.'
						: 'Le code reste stocke localement sur cet appareil.'}
				</Text>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	overlay: {
		...StyleSheet.absoluteFill,
		zIndex: 120,
		backgroundColor: 'rgba(245,241,230,0.98)',
		paddingHorizontal: 24,
		alignItems: 'center',
		justifyContent: 'center',
	},
	card: {
		width: '100%',
		maxWidth: 360,
		borderRadius: 24,
		paddingHorizontal: 22,
		paddingTop: 24,
		paddingBottom: 20,
		backgroundColor: '#FFFDF9',
		borderWidth: 1,
		borderColor: 'rgba(181,98,42,0.14)',
		alignItems: 'center',
		shadowColor: '#000000',
		shadowOffset: { width: 0, height: 10 },
		shadowOpacity: 0.12,
		shadowRadius: 20,
		elevation: 12,
	},
	iconWrap: {
		width: 56,
		height: 56,
		borderRadius: 28,
		backgroundColor: '#E8F0EB',
		alignItems: 'center',
		justifyContent: 'center',
		marginBottom: 14,
	},
	title: {
		color: '#4A2F27',
		fontSize: 22,
		fontWeight: '800',
		textAlign: 'center',
	},
	subtitle: {
		marginTop: 8,
		marginBottom: 18,
		color: '#4A2F27',
		fontSize: 14,
		lineHeight: 21,
		textAlign: 'center',
	},
	input: {
		width: '100%',
		height: 52,
		borderRadius: 16,
		borderWidth: 1,
		borderColor: '#D7C9B8',
		backgroundColor: '#FFFFFF',
		paddingHorizontal: 16,
		fontSize: 18,
		letterSpacing: 6,
		textAlign: 'center',
		color: '#4A2F27',
		fontWeight: '700',
	},
	errorText: {
		marginTop: 10,
		color: '#8F3529',
		fontSize: 13,
		fontWeight: '600',
	},
	primaryButton: {
		width: '100%',
		height: 50,
		borderRadius: 16,
		backgroundColor: '#1A3C34',
		marginTop: 18,
		alignItems: 'center',
		justifyContent: 'center',
	},
	primaryButtonDisabled: {
		backgroundColor: 'rgba(26,60,52,0.36)',
	},
	primaryButtonPressed: {
		opacity: 0.88,
	},
	primaryButtonText: {
		color: '#FFFFFF',
		fontSize: 15,
		fontWeight: '800',
	},
	helperText: {
		marginTop: 12,
		color: 'rgba(74,47,39,0.72)',
		fontSize: 12,
		textAlign: 'center',
	},
});
