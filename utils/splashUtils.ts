let splashShown = false;

export function shouldShowSplash(): boolean {
  // Temporarily disabled for debugging - always skip splash during web dev
  if (typeof window !== 'undefined') {
    return false;
  }
  return !splashShown;
}

export function markSplashAsShown(): void {
  splashShown = true;
}

export function hasSplashBeenShown(): boolean {
  return splashShown;
}

export function resetSplashShown(): void {
  splashShown = false;
}

export function getPostSplashRoute(): '/' {
  return '/';
}
