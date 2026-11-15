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

const DEFAULT_ASPECT_RATIO = 390 / 160;

const getAspectRatio = (source, aspectRatio) => {
    if (aspectRatio) return aspectRatio;
    if (isElement(source) || typeof Image.resolveAssetSource !== "function") {
        return DEFAULT_ASPECT_RATIO;
    }
    const asset = Image.resolveAssetSource(source);
    return asset?.width && asset?.height
        ? asset.width / asset.height
        : DEFAULT_ASPECT_RATIO;
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
        aspectRatio,
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

    const fillsHeader = isTop && fill;
    const layerWidth = width + edgeBleed * 2;
    const height = fillsHeader
        ? headerHeight
        : layerWidth / getAspectRatio(source, aspectRatio);

    return (
        <Animated.View
            pointerEvents="none"
            style={[
                isTop ? styles.topLayer : styles.bottomLayer,
                { left: -edgeBleed, right: -edgeBleed, height },
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
    bodyColor = "#000000",
    edgeBleed = 2,
    bottomBleed = 3,
    headerContent,
    bottomPadding = 0,
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
            {topLayers.map(renderLayer)}

            <Animated.ScrollView
                {...scrollProps}
                onScroll={onScroll}
                scrollEventThrottle={16}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={contentContainerStyle}
            >
                <View style={{ height: headerHeight }}>
                    {bottomLayers.map(renderLayer)}
                    <View>{headerContent}</View>
                </View>

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
    body: { marginTop: -1 },
});