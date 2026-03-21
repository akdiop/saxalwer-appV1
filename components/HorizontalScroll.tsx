import { Feather } from "@expo/vector-icons";
import React, { useMemo, useRef, useState } from "react";
import {
    Animated,
    NativeScrollEvent,
    NativeSyntheticEvent,
    Pressable,
    StyleSheet,
    View,
} from "react-native";

interface HorizontalScrollProps {
  children: React.ReactNode;
  gap?: number;
  itemMinWidth?: number;
  showArrows?: boolean;
  arrowColor?: string;
}

export function HorizontalScroll({
  children,
  gap = 12,
  itemMinWidth = 280,
  showArrows = true,
  arrowColor = "#0F3D2E",
}: HorizontalScrollProps) {
  const scrollRef = useRef<any>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [containerWidth, setContainerWidth] = useState(0);
  const [contentWidth, setContentWidth] = useState(0);

  const items = useMemo(() => React.Children.toArray(children), [children]);

  const updateScrollState = (x: number, container: number, content: number) => {
    setCanScrollLeft(x > 1);
    setCanScrollRight(x < content - container - 1);
  };

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const x = event.nativeEvent.contentOffset.x;
    const container = event.nativeEvent.layoutMeasurement.width;
    const content = event.nativeEvent.contentSize.width;
    updateScrollState(x, container, content);
  };

  const handleLayout = (width: number) => {
    setContainerWidth(width);
    updateScrollState(0, width, contentWidth);
  };

  const handleContentSizeChange = (width: number) => {
    setContentWidth(width);
    updateScrollState(0, containerWidth, width);
  };

  const currentOffsetRef = useRef(0);

  const onScrollWithOffset = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    currentOffsetRef.current = event.nativeEvent.contentOffset.x;
    handleScroll(event);
  };

  const pageScroll = (direction: "left" | "right") => {
    if (!scrollRef.current || containerWidth <= 0) {
      return;
    }

    const amount = containerWidth * 0.8;
    const targetX =
      direction === "left"
        ? Math.max(0, currentOffsetRef.current - amount)
        : Math.min(Math.max(0, contentWidth - containerWidth), currentOffsetRef.current + amount);

    scrollRef.current.scrollTo({ x: targetX, animated: true });
  };

  return (
    <View style={styles.wrapper}>
      {showArrows && canScrollLeft ? (
        <Pressable
          onPress={() => pageScroll("left")}
          style={({ pressed }) => [
            styles.arrow,
            styles.leftArrow,
            { borderColor: `${arrowColor}33` },
            pressed && styles.arrowPressed,
          ]}
        >
          <Feather name="chevron-left" size={18} color={arrowColor} />
        </Pressable>
      ) : null}

      <Animated.ScrollView
        ref={scrollRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        onLayout={(e) => handleLayout(e.nativeEvent.layout.width)}
        onContentSizeChange={(w) => handleContentSizeChange(w)}
        onScroll={onScrollWithOffset}
        scrollEventThrottle={16}
        decelerationRate="fast"
        snapToAlignment="start"
        contentContainerStyle={styles.contentContainer}
      >
        {items.map((child, index) => (
          <View
            key={`horizontal-item-${index}`}
            style={{
              minWidth: itemMinWidth,
              marginRight: index < items.length - 1 ? gap : 0,
            }}
          >
            {child}
          </View>
        ))}
      </Animated.ScrollView>

      {showArrows && canScrollRight ? (
        <Pressable
          onPress={() => pageScroll("right")}
          style={({ pressed }) => [
            styles.arrow,
            styles.rightArrow,
            { borderColor: `${arrowColor}33` },
            pressed && styles.arrowPressed,
          ]}
        >
          <Feather name="chevron-right" size={18} color={arrowColor} />
        </Pressable>
      ) : null}
    </View>
  );
}

export default HorizontalScroll;

const styles = StyleSheet.create({
  wrapper: {
    position: "relative",
  },
  contentContainer: {
    paddingBottom: 8,
  },
  arrow: {
    position: "absolute",
    top: "50%",
    marginTop: -16,
    zIndex: 10,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#FFFFFF",
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 3,
  },
  leftArrow: {
    left: -8,
  },
  rightArrow: {
    right: -8,
  },
  arrowPressed: {
    transform: [{ scale: 0.95 }],
  },
});
