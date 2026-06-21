import { Ionicons } from '@expo/vector-icons';
import { Redirect, Slot, usePathname, useRouter } from 'expo-router';
import * as Speech from 'expo-speech';
import React from 'react';
import {
    Platform,
    Pressable,
    SafeAreaView,
    StyleSheet,
    Text,
    View,
} from 'react-native';

import AppLockOverlay from '../../components/AppLockOverlay';
import HamburgerMenu from '../../components/HamburgerMenu';
import OfflineBanner from '../../components/OfflineBanner';
import SensitiveContent from '../../components/SensitiveContent';
import { shouldShowSplash } from '../../utils/splashUtils';
import { useApp } from '../../context/appcontext';

const BASE = {
	beige: '#F5F1E6',
	deepGreen: '#1A3C34',
	terracotta: '#A65D40',
	copper: '#B5622A',
	cocoa: '#4A2F27',
};

type NavItem = {
	labelFr: string;
	labelWo: string;
	path: string;
	icon: keyof typeof Ionicons.glyphMap;
	activeIcon: keyof typeof Ionicons.glyphMap;
	matches: (pathname: string) => boolean;
};

const NAV_ITEMS: NavItem[] = [
	{
		icon: 'home-outline',
		activeIcon: 'home',
		labelFr: 'Accueil',
		labelWo: 'Ker gi',
		path: '/',
		matches: (pathname) => pathname === '/',
	},
	{
		icon: 'search-outline',
		activeIcon: 'search',
		labelFr: 'Explorer',
		labelWo: 'Seet',
		path: '/bibliotheque',
		matches: (pathname) => pathname.startsWith('/bibliotheque'),
	},
	{
		icon: 'chatbubble-ellipses-outline',
		activeIcon: 'chatbubble-ellipses',
		labelFr: 'Assistant',
		labelWo: 'Jappale',
		path: '/chat',
		matches: (pathname) => pathname === '/chat',
	},
	{
		icon: 'map-outline',
		activeIcon: 'map',
		labelFr: 'Localiser',
		labelWo: 'Carte',
		path: '/carte',
		matches: (pathname) => pathname.startsWith('/carte'),
	},
	{
		icon: 'person-outline',
		activeIcon: 'person',
		labelFr: 'Profil',
		labelWo: 'Sama yoon',
		path: '/profil',
		matches: (pathname) => pathname.startsWith('/profil'),
	},
];

export function RootLayout() {
	const {
		isOnboarded,
		discreteMode,
		toggleDiscreteMode,
		toggleOralMode,
		hasSeenWelcome,
		hasConsented,
		hasCompletedTutorial,
		language,
		oralMode,
		appLockEnabled,
		appLockReady,
		isAppLocked,
		lockApp,
		unlockApp,
	} =
		useApp();
	const pathname = usePathname();
	const router = useRouter();
	const [menuOpen, setMenuOpen] = React.useState(false);
	const wo = language === 'wo';
	const isLegalRoute = pathname === '/legal';
	const canShowPrivacyControls = pathname !== '/splash' && !isAppLocked;
	const shouldApplyGlobalDiscreteMask = discreteMode && pathname !== '/splash' && !isAppLocked;

	React.useEffect(() => {
		if (isAppLocked) {
			setMenuOpen(false);
		}
	}, [isAppLocked]);

	if (!appLockReady) {
		return <SafeAreaView style={styles.safeArea} />;
	}

	if (shouldShowSplash() && pathname !== '/splash') {
		return <Redirect href={"/splash" as any} />;
	}

	if ((!hasSeenWelcome || !hasConsented) && pathname !== '/splash' && pathname !== '/welcome' && !isLegalRoute) {
		return <Redirect href={"/welcome" as any} />;
	}

	if (!hasCompletedTutorial && pathname !== '/splash' && pathname !== '/welcome' && pathname !== '/tutoriel' && !isLegalRoute) {
		return <Redirect href={"/tutoriel" as any} />;
	}

	if (
		!isOnboarded &&
		!pathname.startsWith('/onboarding') &&
		pathname !== '/splash' &&
		pathname !== '/welcome' &&
		pathname !== '/tutoriel' &&
		pathname !== '/orientation' &&
		!isLegalRoute
	) {
		return <Redirect href={"/onboarding" as any} />;
	}

	const isNavVisible =
		!pathname.startsWith('/onboarding') &&
		pathname !== '/splash' &&
		pathname !== '/welcome' &&
		pathname !== '/tutoriel' &&
		pathname !== '/orientation' &&
		!isLegalRoute;
	const privacyControlsBottom = isNavVisible ? (oralMode ? 112 : 102) : 18;

	return (
		<SafeAreaView style={styles.safeArea}>
			<View pointerEvents="none" style={styles.textureLayer}>
				<View style={styles.blobTop} />
				<View style={styles.blobBottom} />
				<View style={styles.gridOverlay} />
			</View>

			{menuOpen ? (
				<HamburgerMenu
					isOpen={menuOpen}
					onClose={() => setMenuOpen(false)}
					discreteMode={discreteMode}
					onToggleDiscrete={toggleDiscreteMode}
					oralMode={oralMode}
					onToggleOral={toggleOralMode}
					onNavigate={(route) => {
						setMenuOpen(false);
						router.push(route as never);
					}}
				/>
			) : null}

			{isNavVisible && !menuOpen && (
				<Pressable
					style={styles.menuButton}
					onPress={() => setMenuOpen((prev) => !prev)}
					accessibilityRole="button"
					accessibilityLabel={wo ? 'Menu' : 'Menu'}
				>
					<Ionicons name="menu" size={20} color={BASE.deepGreen} />
				</Pressable>
			)}

				<View
					style={[
						styles.main,
						isNavVisible ? styles.mainWithNav : null,
					]}
				>
					<OfflineBanner topOffset={isNavVisible && !menuOpen ? 62 : 14} />
					<SensitiveContent
						actionLabel={wo ? 'Wone' : 'Afficher'}
						label={wo ? 'Xët bi sutura na' : 'Écran masqué'}
						masked={shouldApplyGlobalDiscreteMask}
						resetKey={`${pathname}:${shouldApplyGlobalDiscreteMask}`}
						strength="strong"
						style={styles.slotMask}
					>
						<Slot />
					</SensitiveContent>
				</View>

			{canShowPrivacyControls && !menuOpen && (
				<View style={[styles.privacyActions, { bottom: privacyControlsBottom }]}>
					{appLockEnabled ? (
						<Pressable
							style={styles.lockButton}
							onPress={lockApp}
							accessibilityRole="button"
							accessibilityLabel={wo ? 'Téj app bi léegi' : "Verrouiller l'application maintenant"}
						>
							<Ionicons name="lock-closed" size={18} color={BASE.deepGreen} />
						</Pressable>
					) : null}

					<Pressable
						style={[styles.discreteButton, discreteMode ? styles.discreteOn : styles.discreteOff]}
						onPress={toggleDiscreteMode}
						accessibilityRole="button"
						accessibilityLabel={
							discreteMode
								? wo
									? 'Fann mode bu nebb'
									: 'Desactiver mode discret'
								: wo
									? 'Taal mode bu nebb'
									: 'Activer mode discret'
						}
					>
						<Ionicons
							name={discreteMode ? 'eye-off' : 'eye'}
							size={20}
							color={discreteMode ? '#FFFFFF' : BASE.deepGreen}
						/>
					</Pressable>
				</View>
			)}

			{isNavVisible && (
				<View style={[styles.navBar, oralMode ? styles.navBarOral : null]}>
					{NAV_ITEMS.map((item) => {
						const active = item.matches(pathname);
						const label = wo ? item.labelWo : item.labelFr;

						return (
							<Pressable
								key={item.path}
								style={styles.navButton}
								onPress={() => {
									if (oralMode) {
										Speech.stop();
										Speech.speak(label, { language: 'fr-FR', rate: 0.85 });
									}
									router.push(item.path as never);
								}}
								accessibilityRole="button"
								accessibilityLabel={label}
							>
								<View style={styles.iconWrap}>
									<Ionicons
										name={active ? item.activeIcon : item.icon}
										size={oralMode ? 24 : 20}
										color={active ? BASE.deepGreen : '#6E5A53'}
									/>
									{oralMode && <Ionicons name="volume-medium" size={10} color={active ? BASE.deepGreen : '#6E5A53'} style={styles.volumeBadge} />}
									{active && <View style={[styles.activeDot, oralMode ? styles.activeDotOral : null]} />}
								</View>
								{!oralMode && (
									<Text style={[styles.navLabel, active ? styles.navLabelActive : null]}>{label}</Text>
								)}
							</Pressable>
						);
					})}
				</View>
			)}

			{appLockEnabled && isAppLocked ? (
				<AppLockOverlay language={language} onUnlock={unlockApp} />
			) : null}
		</SafeAreaView>
	);
}

export default RootLayout;

const styles = StyleSheet.create({
	safeArea: {
		flex: 1,
		backgroundColor: BASE.beige,
	},
	textureLayer: {
		...StyleSheet.absoluteFillObject,
		opacity: 0.22,
	},
	blobTop: {
		position: 'absolute',
		top: -80,
		right: -90,
		width: 260,
		height: 220,
		borderRadius: 130,
		backgroundColor: BASE.terracotta,
		opacity: 0.13,
	},
	blobBottom: {
		position: 'absolute',
		bottom: -110,
		left: -80,
		width: 280,
		height: 240,
		borderRadius: 140,
		backgroundColor: BASE.cocoa,
		opacity: 0.08,
	},
	gridOverlay: {
		...StyleSheet.absoluteFillObject,
		borderColor: 'rgba(181,98,42,0.08)',
		borderWidth: Platform.OS === 'web' ? StyleSheet.hairlineWidth : 0,
	},
	menuButton: {
		position: 'absolute',
		top: 14,
		left: 14,
		zIndex: 44,
		width: 40,
		height: 40,
		borderRadius: 20,
		backgroundColor: 'rgba(255,255,255,0.92)',
		alignItems: 'center',
		justifyContent: 'center',
	},
	main: {
		flex: 1,
	},
	mainWithNav: {
		paddingBottom: 90,
	},
	slotMask: {
		flex: 1,
	},
	privacyActions: {
		position: 'absolute',
		right: 16,
		zIndex: 46,
		alignItems: 'center',
		gap: 10,
	},
	discreteButton: {
		width: 44,
		height: 44,
		borderRadius: 22,
		alignItems: 'center',
		justifyContent: 'center',
		zIndex: 46,
		shadowColor: '#000000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.18,
		shadowRadius: 8,
		elevation: 6,
	},
	discreteOn: {
		backgroundColor: BASE.deepGreen,
	},
	discreteOff: {
		backgroundColor: '#FFFFFF',
	},
	lockButton: {
		width: 40,
		height: 40,
		borderRadius: 20,
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: 'rgba(255,255,255,0.94)',
		borderWidth: 1,
		borderColor: 'rgba(26,60,52,0.12)',
		shadowColor: '#000000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.12,
		shadowRadius: 8,
		elevation: 4,
	},
	navBar: {
		position: 'absolute',
		left: 0,
		right: 0,
		bottom: 0,
		height: 64,
		paddingHorizontal: 8,
		borderTopWidth: StyleSheet.hairlineWidth,
		borderTopColor: 'rgba(181,98,42,0.2)',
		backgroundColor: 'rgba(255,255,255,0.95)',
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-around',
		shadowColor: '#000000',
		shadowOffset: { width: 0, height: -2 },
		shadowOpacity: 0.08,
		shadowRadius: 8,
		elevation: 8,
	},
	navBarOral: {
		height: 74,
	},
	navButton: {
		flex: 1,
		maxWidth: 72,
		alignItems: 'center',
		justifyContent: 'center',
		paddingVertical: 2,
		gap: 2,
	},
	iconWrap: {
		position: 'relative',
		padding: 3,
	},
	volumeBadge: {
		position: 'absolute',
		right: -4,
		bottom: -1,
	},
	activeDot: {
		position: 'absolute',
		left: '50%',
		marginLeft: -2,
		bottom: -5,
		width: 4,
		height: 4,
		borderRadius: 2,
		backgroundColor: BASE.deepGreen,
	},
	activeDotOral: {
		width: 6,
		height: 6,
		borderRadius: 3,
		marginLeft: -3,
		bottom: -3,
	},
	navLabel: {
		fontSize: 10,
		fontWeight: '500',
		color: '#6E5A53',
	},
	navLabelActive: {
		fontWeight: '700',
		color: BASE.deepGreen,
	},
});
