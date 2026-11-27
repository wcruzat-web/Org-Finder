import React, { useEffect, useRef, useState } from "react";
import { AccessibilityInfo, Animated, Easing, View } from "react-native";
import Svg, { Defs, LinearGradient, Rect, Stop } from "react-native-svg";

import {
    card,
    skeleton,
    skeletonColors,
    skeletonMotion as MOTION,
} from "../../styles/style";

/**
 * Loading placeholder shaped like OrgCard variant="featured": the same shell
 * (so the same 300 x 164 size) with grey shapes where the content will go and a
 * light band sweeping across. The sweep is skipped when the phone's
 * "reduce motion" setting is on.
 *
 *  - fill:  true makes it fill whatever it sits in (used inside CardStack,
 *           where it stands in for the card). Default false: 300 wide.
 *  - style: one-off override, applied last
 */
export default function CardSkeleton({ fill = false, style }) {
    const [width, setWidth] = useState(0);
    const [reduceMotion, setReduceMotion] = useState(false);
    const progress = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        let alive = true;
        AccessibilityInfo.isReduceMotionEnabled?.()
            .then((value) => alive && setReduceMotion(value))
            .catch(() => {});
        const subscription = AccessibilityInfo.addEventListener?.(
            "reduceMotionChanged",
            setReduceMotion,
        );
        return () => {
            alive = false;
            subscription?.remove?.();
        };
    }, []);

    // One looping value drives the whole sweep (transform only, so it runs natively).
    useEffect(() => {
        if (reduceMotion || width === 0) return undefined;
        progress.setValue(0);
        const loop = Animated.loop(
            Animated.timing(progress, {
                toValue: 1,
                duration: MOTION.shimmerMs,
                easing: Easing.linear,
                useNativeDriver: true,
            }),
        );
        loop.start();
        return () => loop.stop();
    }, [reduceMotion, width, progress]);

    const translateX = progress.interpolate({
        inputRange: [0, 1],
        outputRange: [-MOTION.shimmerWidth, width],
    });

    return (
        <View
            accessibilityRole="progressbar"
            accessibilityLabel="Loading"
            onLayout={(e) => setWidth(e.nativeEvent.layout.width)}
            style={[card.base, card.featured, fill ? skeleton.fill : null, style]}
        >
            <View style={card.header}>
                <View style={[skeleton.block, skeleton.avatar]} />
                <View style={card.headerText}>
                    <View style={skeleton.titleRow}>
                        <View style={[skeleton.block, skeleton.title]} />
                    </View>
                    <View style={skeleton.tagsRow}>
                        <View style={[skeleton.block, skeleton.tag]} />
                        <View style={[skeleton.block, skeleton.tag]} />
                    </View>
                </View>
                <View style={[skeleton.block, skeleton.pill]} />
            </View>

            <View>
                <View style={skeleton.descRow}>
                    <View style={[skeleton.block, skeleton.descBar]} />
                </View>
                <View style={skeleton.descRow}>
                    <View style={[skeleton.block, skeleton.descBar, skeleton.descBarShort]} />
                </View>
            </View>

            <View style={[card.footer, card.featuredFooter]}>
                <View style={skeleton.stat}>
                    <View style={[skeleton.block, skeleton.statIcon]} />
                    <View style={[skeleton.block, skeleton.statBar]} />
                </View>
                <View style={[skeleton.block, skeleton.button]} />
            </View>

            {!reduceMotion && width > 0 ? (
                <Animated.View
                    pointerEvents="none"
                    style={[skeleton.shimmer, { transform: [{ translateX }] }]}
                >
                    <Svg width={MOTION.shimmerWidth} height="100%">
                        <Defs>
                            <LinearGradient id="skeleton-shimmer" x1="0" y1="0" x2="1" y2="0">
                                <Stop offset="0" stopColor={skeletonColors.shimmer} stopOpacity="0" />
                                <Stop offset="0.5" stopColor={skeletonColors.shimmer} stopOpacity="0.14" />
                                <Stop offset="1" stopColor={skeletonColors.shimmer} stopOpacity="0" />
                            </LinearGradient>
                        </Defs>
                        <Rect width="100%" height="100%" fill="url(#skeleton-shimmer)" />
                    </Svg>
                </Animated.View>
            ) : null}
        </View>
    );
}