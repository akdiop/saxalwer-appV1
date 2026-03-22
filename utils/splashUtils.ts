let splashShown = false;

export function shouldShowSplash(): boolean {
  return !splashShown;
}

export function markSplashAsShown(): void {
  splashShown = true;
}

export function hasSplashBeenShown(): boolean {
  return splashShown;
}

export function getPostSplashRoute(): '/' {
  return '/';
}
