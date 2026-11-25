import React, { useEffect, useRef, useState } from "react";
import { Animated, Pressable, View } from "react-native";

import AppText from "./AppText";
import { segmented } from "../../styles/style";

/**
 * Segmented tabs with a highlight that slides to the selected tab, using the
 * same spring as BottomNav. Meant for 2 or 3 tabs.
 *
 *  - tabs:       [{ key: "all", label: "All" }, ...]
 *  - activeKey:  controlled selected key (omit to let the component track it)
 *  - defaultKey: starting key when uncontrolled (defaults to the first tab)
 *  - onChange:   called with the tapped tab's key
 *  - style:      one-off override for the track (e.g. margins)
 */
export default function SegmentedTabs({
    tabs = [],
    activeKey,
    defaultKey,
    onChange,
    style,
}) {
    const [internalKey, setInternalKey] = useState(defaultKey ?? tabs[0]?.key);
    const currentKey = activeKey ?? internalKey;
    const activeIndex = Math.max(
        0,
        tabs.findIndex((t) => t.key === currentKey),
    );

    const [innerWidth, setInnerWidth] = useState(0);
    const indicatorIndex = useRef(new Animated.Value(activeIndex)).current;

    useEffect(() => {
        Animated.spring(indicatorIndex, {
            toValue: activeIndex,
            friction: 8,
            tension: 50,
            useNativeDriver: true,
        }).start();
    }, [activeIndex, indicatorIndex]);

    const handlePress = (key) => {
        if (activeKey === undefined) setInternalKey(key);
        onChange?.(key);
    };

    // Every tab has the same width; the highlight moves one tab width per step.
    const tabWidth = tabs.length > 0 ? innerWidth / tabs.length : 0;
    const indicatorX = indicatorIndex.interpolate({
        inputRange: tabs.map((_, i) => i),
        outputRange: tabs.map((_, i) => i * tabWidth),
    });

    if (tabs.length === 0) return null;

    return (
        <View style={[segmented.track, style]} accessibilityRole="tablist">
            <View
                style={segmented.inner}
                onLayout={(e) => setInnerWidth(e.nativeEvent.layout.width)}
            >
                {innerWidth > 0 ? (
                    <Animated.View
                        pointerEvents="none"
                        style={[
                            segmented.indicator,
                            { width: tabWidth, transform: [{ translateX: indicatorX }] },
                        ]}
                    />
                ) : null}

                {tabs.map((tab) => (
                    <Pressable
                        key={tab.key}
                        onPress={() => handlePress(tab.key)}
                        accessibilityRole="tab"
                        accessibilityLabel={tab.label}
                        accessibilityState={{ selected: tab.key === currentKey }}
                        style={({ pressed }) => [
                            segmented.tab,
                            pressed ? segmented.tabPressed : null,
                        ]}
                    >
                        <AppText variant="label" tone="primary" numberOfLines={1}>
                            {tab.label}
                        </AppText>
                    </Pressable>
                ))}
            </View>
        </View>
    );
}