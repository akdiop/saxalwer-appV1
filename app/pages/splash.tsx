import { useRouter } from 'expo-router';
import { useEffect, useRef } from 'react';
import {
  Animated,
  Easing,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Svg, { Path } from 'react-native-svg';

import { getPostSplashRoute, markSplashAsShown } from '../../utils/splashUtils';

const LOGO_SOURCE = require('../assets/images/logo-saxalwer.png');

export default function SplashScreen() {
  const router = useRouter();

  const contentOpacity = useRef(new Animated.Value(0)).current;
  const contentTranslateY = useRef(new Animated.Value(14)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;

  const dot1 = useRef(new Animated.Value(0)).current;
  const dot2 = useRef(new Animated.Value(0)).current;
  const dot3 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    markSplashAsShown();

    Animated.parallel([
      Animated.timing(contentOpacity, {
        toValue: 1,
        duration: 800,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(contentTranslateY, {
        toValue: 0,
        duration: 900,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(logoOpacity, {
        toValue: 1,
        duration: 950,
        delay: 220,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();

    const createDotLoop = (value: Animated.Value, delay: number) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(value, {
            toValue: -10,
            duration: 340,
            easing: Easing.out(Easing.quad),
            useNativeDriver: true,
          }),
          Animated.timing(value, {
            toValue: 0,
            duration: 340,
            easing: Easing.in(Easing.quad),
            useNativeDriver: true,
          }),
          Animated.delay(320),
        ])
      );

    const loop1 = createDotLoop(dot1, 0);
    const loop2 = createDotLoop(dot2, 140);
    const loop3 = createDotLoop(dot3, 280);

    loop1.start();
    loop2.start();
    loop3.start();

    const timeout = setTimeout(() => {
      router.replace(getPostSplashRoute() as never);
    }, 3500);

    return () => {
      clearTimeout(timeout);
      loop1.stop();
      loop2.stop();
      loop3.stop();
    };
  }, [
    contentOpacity,
    contentTranslateY,
    dot1,
    dot2,
    dot3,
    logoOpacity,
    router,
  ]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.africaWrap}>
          <Svg width={310} height={370} viewBox="0 0 310 370" fill="none">
            <Path
              d="M155 22C173 36 185 46 200 62C220 84 243 107 244 136C245 157 230 175 230 198C231 218 243 232 243 252C242 275 221 295 204 312C189 326 177 344 158 351C140 356 123 345 110 332C96 318 79 306 71 289C61 269 67 246 57 226C49 209 31 195 29 175C27 151 44 131 60 114C72 100 82 86 93 71C104 56 111 37 127 28C137 22 145 18 155 22Z"
              stroke="#0F3D2E"
              strokeOpacity={0.1}
              strokeWidth={2}
            />
            <Path
              d="M117 145C125 156 129 166 138 176C147 186 158 196 164 208C169 217 168 229 174 238C180 248 191 252 198 261"
              stroke="#0F3D2E"
              strokeOpacity={0.07}
              strokeWidth={1.5}
            />
            <Path
              d="M173 106C187 116 194 130 194 145C194 163 185 176 175 189"
              stroke="#0F3D2E"
              strokeOpacity={0.07}
              strokeWidth={1.5}
            />
          </Svg>
        </View>

        <Animated.View
          style={[
            styles.content,
            {
              opacity: contentOpacity,
              transform: [{ translateY: contentTranslateY }],
            },
          ]}
        >
          <Animated.View style={[styles.logoGlowWrap, { opacity: logoOpacity }]}>
            <View style={styles.logoGlow} />
            <Image source={LOGO_SOURCE} style={styles.logo} resizeMode="contain" />
          </Animated.View>

          <Text style={styles.title}>SAXALWER</Text>
          <Text style={styles.tagline}>Un espace discret pour comprendre ton corps.</Text>
        </Animated.View>

        <View style={styles.loaderRow}>
          <Animated.View style={[styles.dot, { transform: [{ translateY: dot1 }] }]} />
          <Animated.View style={[styles.dot, { transform: [{ translateY: dot2 }] }]} />
          <Animated.View style={[styles.dot, { transform: [{ translateY: dot3 }] }]} />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#E8DCC8',
  },
  container: {
    flex: 1,
    backgroundColor: '#E8DCC8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  africaWrap: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0.42,
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 28,
    marginBottom: 26,
  },
  logoGlowWrap: {
    width: 178,
    height: 178,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,
  },
  logoGlow: {
    position: 'absolute',
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: '#0F3D2E',
    opacity: 0.11,
  },
  logo: {
    width: 132,
    height: 132,
    opacity: 0.93,
  },
  title: {
    fontSize: 48,
    lineHeight: 52,
    color: '#0F3D2E',
    letterSpacing: 1.4,
    textAlign: 'center',
    fontWeight: '700',
  },
  tagline: {
    marginTop: 14,
    maxWidth: 276,
    textAlign: 'center',
    color: '#4A2F27',
    fontSize: 17,
    lineHeight: 25,
    opacity: 0.92,
  },
  loaderRow: {
    position: 'absolute',
    bottom: 52,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  dot: {
    width: 9,
    height: 9,
    borderRadius: 4.5,
    backgroundColor: '#C26A3D',
  },
});
