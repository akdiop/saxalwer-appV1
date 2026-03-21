import * as Haptics from 'expo-haptics';
import { useCallback, useEffect, useRef, useState } from 'react';
import type { GestureResponderEvent } from 'react-native';

function haptic() {
	void Haptics.selectionAsync().catch(() => undefined);
}

interface UseSwipeableOptions {
	count: number;
	autoPlay?: boolean;
	interval?: number;
	loop?: boolean;
	threshold?: number;
	hapticEnabled?: boolean;
	hapticPattern?: number | number[];
}

interface SwipeHandlers {
	onTouchStart: (e: GestureResponderEvent) => void;
	onTouchMove: (e: GestureResponderEvent) => void;
	onTouchEnd: (e: GestureResponderEvent) => void;
	onMouseDown: (e: unknown) => void;
	onMouseUp: (e: unknown) => void;
	onMouseLeave: () => void;
}

interface UseSwipeableReturn {
	activeIdx: number;
	direction: number;
	isDragging: boolean;
	handlers: SwipeHandlers;
	goTo: (idx: number) => void;
	goNext: () => void;
	goPrev: () => void;
}

type Point = { x: number; y: number };

function getTouchPoint(e: GestureResponderEvent): Point {
	const native = e.nativeEvent as {
		changedTouches?: Array<{ pageX: number; pageY: number; clientX?: number; clientY?: number }>;
		touches?: Array<{ pageX: number; pageY: number; clientX?: number; clientY?: number }>;
		pageX?: number;
		pageY?: number;
	};

	const touch = native.touches?.[0] || native.changedTouches?.[0];

	if (touch) {
		return {
			x: touch.clientX ?? touch.pageX,
			y: touch.clientY ?? touch.pageY,
		};
	}

	return {
		x: native.pageX ?? 0,
		y: native.pageY ?? 0,
	};
}

export function useSwipeable(options: UseSwipeableOptions): UseSwipeableReturn {
	const {
		count,
		autoPlay = false,
		interval = 6000,
		loop = true,
		threshold = 40,
		hapticEnabled = true,
		hapticPattern: _hapticPattern = 12,
	} = options;

	const [activeIdx, setActiveIdx] = useState(0);
	const [direction, setDirection] = useState(0);
	const [isDragging, setIsDragging] = useState(false);

	const touchRef = useRef({ startX: 0, startY: 0, startTime: 0, swiped: false });
	const mouseRef = useRef({ startX: 0, isDown: false });
	const idxRef = useRef(activeIdx);
	idxRef.current = activeIdx;

	const fireHaptic = useCallback(() => {
		if (hapticEnabled) haptic();
	}, [hapticEnabled]);

	const goNext = useCallback(() => {
		if (count <= 0) return;
		const atEnd = idxRef.current >= count - 1;
		if (!loop && atEnd) return;
		fireHaptic();
		setDirection(1);
		setActiveIdx((prev) => (prev + 1) % count);
	}, [count, loop, fireHaptic]);

	const goPrev = useCallback(() => {
		if (count <= 0) return;
		const atStart = idxRef.current <= 0;
		if (!loop && atStart) return;
		fireHaptic();
		setDirection(-1);
		setActiveIdx((prev) => (prev - 1 + count) % count);
	}, [count, loop, fireHaptic]);

	const goTo = useCallback(
		(idx: number) => {
			if (count <= 0) return;
			const safeIdx = Math.max(0, Math.min(count - 1, idx));
			fireHaptic();
			setDirection(safeIdx > idxRef.current ? 1 : -1);
			setActiveIdx(safeIdx);
		},
		[count, fireHaptic]
	);

	useEffect(() => {
		if (!autoPlay || isDragging || count <= 1) return;
		const timer = setInterval(() => {
			setDirection(1);
			setActiveIdx((prev) => (prev + 1) % count);
		}, interval);

		return () => clearInterval(timer);
	}, [autoPlay, isDragging, count, interval]);

	const onTouchStart = useCallback((e: GestureResponderEvent) => {
		const point = getTouchPoint(e);
		touchRef.current = {
			startX: point.x,
			startY: point.y,
			startTime: Date.now(),
			swiped: false,
		};
		setIsDragging(true);
	}, []);

	const onTouchMove = useCallback((e: GestureResponderEvent) => {
		if (touchRef.current.swiped) return;
		const point = getTouchPoint(e);
		const deltaX = point.x - touchRef.current.startX;
		const deltaY = point.y - touchRef.current.startY;

		if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 10) {
			// Intentionally empty: keep parity with web behavior where horizontal swipe takes precedence.
		}
	}, []);

	const onTouchEnd = useCallback(
		(e: GestureResponderEvent) => {
			setIsDragging(false);
			const point = getTouchPoint(e);
			const deltaX = point.x - touchRef.current.startX;
			const deltaY = point.y - touchRef.current.startY;
			const elapsed = Date.now() - touchRef.current.startTime;

			const isHorizontal = Math.abs(deltaX) > Math.abs(deltaY);
			const isSwipe = isHorizontal && (Math.abs(deltaX) > threshold || (elapsed < 250 && Math.abs(deltaX) > 20));

			if (isSwipe && !touchRef.current.swiped) {
				touchRef.current.swiped = true;
				if (deltaX < 0) goNext();
				else goPrev();
			}
		},
		[threshold, goNext, goPrev]
	);

	const onMouseDown = useCallback((e: unknown) => {
		const event = e as { clientX?: number };
		mouseRef.current = { startX: event.clientX ?? 0, isDown: true };
		setIsDragging(true);
	}, []);

	const onMouseUp = useCallback(
		(e: unknown) => {
			if (!mouseRef.current.isDown) return;
			mouseRef.current.isDown = false;
			setIsDragging(false);

			const event = e as { clientX?: number };
			const deltaX = (event.clientX ?? 0) - mouseRef.current.startX;
			if (Math.abs(deltaX) > threshold) {
				if (deltaX < 0) goNext();
				else goPrev();
			}
		},
		[threshold, goNext, goPrev]
	);

	const onMouseLeave = useCallback(() => {
		if (mouseRef.current.isDown) {
			mouseRef.current.isDown = false;
			setIsDragging(false);
		}
	}, []);

	return {
		activeIdx,
		direction,
		isDragging,
		handlers: {
			onTouchStart,
			onTouchMove,
			onTouchEnd,
			onMouseDown,
			onMouseUp,
			onMouseLeave,
		},
		goTo,
		goNext,
		goPrev,
	};
}
