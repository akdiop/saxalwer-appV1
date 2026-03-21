# Missing / Adaptation Notes

This file tracks web-to-React-Native conversion gaps and placeholders.

## Global technical gaps
- `window.speechSynthesis` from web components is not available in React Native.
- Replacement should be `expo-speech` (not yet wired in these converted pages).
- `framer-motion` web animations were simplified to static RN layout and `Pressable` interactions.
- CSS `backdrop-filter` and browser hover interactions (`onMouseEnter`/`onMouseLeave`) are not available in native runtime.
- Any web-only blur effect (`filter: blur`) for full-screen masking was reduced to opacity-based fallback.

## Onboarding component signature mismatches
- `HealthNeeds` is currently a zero-prop component, while Figma flow expected `onFinish(needs)` callback.
- `PersonalGoals` is currently a zero-prop component, while Figma flow expected `selectedAge` + `onFinish(goals)` callbacks.
- `ContextualPersonalization` is currently a zero-prop component, while Figma flow expected `onComplete`, `onSkip`, `onBack` callbacks.
- Because of this, `onboarding-page.tsx` uses a placeholder next-step flow after each screen.

## Converted pages requiring follow-up
- `orientation.tsx` and `orientation-sensible.tsx` currently save simplified sessions.
- If strict production parity is needed, map their state exactly to app-context session models and scoring logic from your original implementation.

## Map permissions
- `map/index.tsx` uses `expo-location` and requires foreground location permission at runtime.
- Ensure app permissions/plist are configured if targeting production builds.
