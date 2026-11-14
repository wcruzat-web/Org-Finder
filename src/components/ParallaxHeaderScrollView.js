import React from "react";
import { Image, StyleSheet, View, useWindowDimensions } from "react-native";
import Animated, {
    Extrapolation,
    interpolate,
    useAnimatedScrollHandler,
    useAnimatedStyle,
    useSharedValue,
} from "react-native-reanimated";

const isElement = (source) => React.isValidElement(source);

const renderSource = (source, resizeMode) =>
    isElement(source) ? (
        source
    ) : (
        <Image source={source} style={styles.fill} resizeMode={resizeMode} />
    );

// Image sources report their own size; elements (SVG) use the aspectRatio prop.
const getAspectRatio = (source, fallback) => {
    if (isElement(source)) return fallback;
    const asset = Image.resolveAssetSource(source);
    return asset?.width && asset?.height
        ? asset.width / asset.height
        : fallback;
};

function Layer({
    layer,
    scrollY,
    headerHeight,
    width,
    edgeBleed,
    bottomBleed,
}) {
    const {
        source,
        anchor = "top",
        aspectRatio = 390 / 160,
        stretch = true,
        fill = false,
        fade,
    } = layer;
    const isTop = anchor === "top";
    const speed = layer.speed ?? (isTop ? 0.3 : 1);

    const animatedStyle = useAnimatedStyle(() => {
        const y = scrollY.value;

        const opacity = fade
            ? interpolate(
                  y,
                  [fade[0] * headerHeight, fade[1] * headerHeight],
                  [1, 0],
                  Extrapolation.CLAMP,
              )
            : 1;

        if (isTop) {
            // Drifts up at (speed x scroll). Never moves down, so no gap opens at the top.
            const transform = [
                {
                    translateY: interpolate(
                        y,
                        [0, headerHeight],
                        [0, -headerHeight * speed],
                        Extrapolation.CLAMP,
                    ),
                },
            ];
            // Pulled down past the top: stretch from the top edge to fill the gap
            if (stretch) {
                transform.push({
                    scale: interpolate(y, [-headerHeight, 0], [2, 1], {
                        extrapolateLeft: Extrapolation.EXTEND,
                        extrapolateRight: Extrapolation.CLAMP,
                    }),
                });
            }
            return { opacity, transform };
        }

        // Bottom layers live in the scroll content (already moving at speed 1).
        // Push them down by the difference so they appear to move at `speed`.
        return {
            opacity,
            transform: [
                {
                    translateY: interpolate(
                        y,
                        [0, headerHeight],
                        [0, headerHeight * (1 - speed)],
                        Extrapolation.CLAMP,
                    ),
                },
            ],
        };
    });

    // Natural height from the aspect ratio, unless a top layer should fill the whole header
    const fillsHeader = isTop && fill;
    const layerWidth = width + edgeBleed * 2; // a little wider than the screen, so no gaps at the sides
    const height = fillsHeader
        ? headerHeight
        : layerWidth / getAspectRatio(source, aspectRatio);

    return (
        <Animated.View
            pointerEvents="none"
            style={[
                isTop ? styles.topLayer : styles.bottomLayer,
                { left: -edgeBleed, right: -edgeBleed, height },
                // bottom layers sink a few px under the body, hiding any transparent strip at their base
                !isTop && { bottom: -bottomBleed },
                animatedStyle,
            ]}
        >
            {renderSource(source, fillsHeader ? "cover" : "stretch")}
        </Animated.View>
    );
}

export default function ParallaxHeaderScrollView({
    layers = [],
    headerHeight = 300,
    bodyColor = "#000000", // must match the fill color of the lowest 'bottom' layer exactly
    edgeBleed = 2, // px that layers extend past each side of the screen
    bottomBleed = 3, // px that bottom layers sink under the body
    headerContent,
    bottomPadding = 0, // extra room at the end (e.g. floating tab bar)
    children,
    contentContainerStyle,
    ...scrollProps
}) {
    const { width, height: windowHeight } = useWindowDimensions();
    const scrollY = useSharedValue(0);

    const onScroll = useAnimatedScrollHandler((e) => {
        scrollY.value = e.contentOffset.y;
    });

    const topLayers = layers.filter((l) => (l.anchor ?? "top") === "top");
    const bottomLayers = layers.filter((l) => l.anchor === "bottom");

    const renderLayer = (layer, i) => (
        <Layer
            key={layer.id ?? i}
            layer={layer}
            scrollY={scrollY}
            headerHeight={headerHeight}
            width={width}
            edgeBleed={edgeBleed}
            bottomBleed={bottomBleed}
        />
    );

    return (
        <View style={[styles.root, { backgroundColor: bodyColor }]}>
            {/* Behind the scroll view: stays on screen, moves by parallax only */}
            {topLayers.map(renderLayer)}

            <Animated.ScrollView
                {...scrollProps}
                onScroll={onScroll}
                scrollEventThrottle={16}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={contentContainerStyle}
            >
                {/* Transparent header area: top layers show through */}
                <View style={{ height: headerHeight }}>
                    {bottomLayers.map(renderLayer)}
                    <View>{headerContent}</View>
                </View>

                {/* Opaque body, same color as the lowest bottom layer's fill */}
                <View
                    style={[
                        styles.body,
                        {
                            backgroundColor: bodyColor,
                            minHeight: windowHeight,
                            paddingBottom: bottomPadding,
                        },
                    ]}
                >
                    {children}
                </View>
            </Animated.ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    root: { flex: 1 },
    fill: { width: "100%", height: "100%" },
    topLayer: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        transformOrigin: "top",
    },
    bottomLayer: {
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 0,
    },
    // 1px overlap hides any hairline seam between the last layer and the body
    body: { marginTop: -1 },
});
