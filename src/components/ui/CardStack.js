import {
    useEffect,
    useLayoutEffect,
    useMemo,
    useRef,
    useState,
} from "react";
import {
    Animated,
    PanResponder,
    Pressable,
    View,
    useWindowDimensions,
} from "react-native";

import { cardStack, cardStackMotion as M } from "../../styles/style";

// Slot 3 is "hidden, just behind the stack". Cards start there when they enter.
const HIDDEN = M.rotate.length - 1;
const SLOTS = M.rotate.map((_, i) => i);
const NO_DRAG = new Animated.Value(0);

function StackCard({ depth, panX, dragProgress, dragRotate, startHidden, snap, reveal, skeleton, onLayout, children }) {
    const slot = useRef(new Animated.Value(startHidden ? HIDDEN : depth)).current;
    const previousDepth = useRef(depth);
    const isFront = depth === 0;
    const crossfade = reveal && Boolean(skeleton);

    useLayoutEffect(() => {
        if (previousDepth.current === 0 && depth > 0) {
            // The card that just left the front slides in from behind.
            slot.setValue(HIDDEN);
        } else if (snap && depth < previousDepth.current) {
            slot.setValue(depth);
        }
        previousDepth.current = depth;
        Animated.spring(slot, {
            toValue: depth,
            friction: M.spring.friction,
            tension: M.spring.tension,
            overshootClamping: M.spring.overshootClamping,
            useNativeDriver: false,
        }).start();
    }, [depth, slot, snap]);

    const pose = useMemo(() => {
        // While the front card is dragged, the cards behind move up a slot.
        const position = isFront
            ? slot
            : Animated.add(slot, Animated.multiply(dragProgress, -1));
        const at = (outputRange) =>
            position.interpolate({
                inputRange: SLOTS,
                outputRange,
                extrapolate: "clamp",
            });

        const fade = (outputRange) =>
            position.interpolate({
                inputRange: [0, M.reveal, HIDDEN],
                outputRange,
                extrapolate: "clamp",
            });

        return {
            content: crossfade ? fade([1, 0, 0]) : 1,
            skeleton: crossfade ? fade([0, 1, 1]) : 0,
            style: {
                opacity: at(M.opacity),
                transform: [
                    { translateX: isFront ? panX : NO_DRAG },
                    { translateX: at(M.x) },
                    { translateY: at(M.y) },
                    { rotate: at(M.rotate) },
                    { rotate: isFront ? dragRotate : "0deg" },
                    { scale: at(M.scale) },
                ],
            },
            overlay: at(M.overlay),
        };
    }, [isFront, slot, panX, dragProgress, dragRotate, crossfade]);

    return (
        <Animated.View
            pointerEvents={isFront ? "box-none" : "none"}
            onLayout={onLayout}
            style={[cardStack.card, pose.style]}
        >
            {/* Hugs the card, so the darkening layer covers the card and nothing else. */}
            <View>
                <Animated.View style={{ opacity: pose.content }}>{children}</Animated.View>
                {skeleton && !isFront ? (
                    <Animated.View
                        pointerEvents="none"
                        importantForAccessibility="no-hide-descendants"
                        accessibilityElementsHidden
                        style={[cardStack.placeholder, { opacity: pose.skeleton }]}
                    >
                        {skeleton}
                    </Animated.View>
                ) : null}
                <Animated.View
                    pointerEvents="none"
                    style={[cardStack.overlay, { opacity: pose.overlay }]}
                />
            </View>
        </Animated.View>
    );
}

/**
 * A deck of cards. Swipe the front card left or right and it flies off, the
 * next card moves up, and the sent-away card goes to the back, so it loops
 * through every item forever. Dots underneath show where you are.
 *
 *  - data:          the items
 *  - renderItem:    ({ item, index }) => element. The card needs a fixed width
 *                   (OrgCard variant="featured" has one: 300)
 *  - keyExtractor:  (item, index) => string. Defaults to item.id, item.key or index
 *  - initialIndex:  which item starts at the front (default 0)
 *  - onIndexChange: called with the new front index
 *  - renderSkeleton: ({ fill }) => element, e.g. <CardSkeleton fill={fill} />.
 *                   Optional. With it, cards behind show the skeleton and the real
 *                   card fades in as it reaches the front, and `loading` works
 *  - loading:       true shows a stack of skeletons (no swiping, no dots) while
 *                   the data is still being fetched. Needs renderSkeleton
 *  - revealContent: with a skeleton, false shows the real cards at all times
 *                   (default true: cross-fade from the skeleton)
 *  - maxVisible:    how many cards show in the stack (default 3)
 *  - maxDots:       most dots to show; more items than this scrolls a window of dots
 *  - style:         one-off override for the whole component
 *
 * Tapping a dot jumps to that item. Vertical drags are left alone, so a
 * parent ScrollView still scrolls.
 */
export default function CardStack({
    data = [],
    renderItem,
    keyExtractor,
    initialIndex = 0,
    onIndexChange,
    revealContent = true,
    renderSkeleton,
    loading = false,
    maxVisible = 3,
    maxDots = 7,
    style,
}) {
    const count = data.length;
    const { width } = useWindowDimensions();

    const [index, setIndex] = useState(initialIndex);
    const current = count > 0 ? ((index % count) + count) % count : 0;
    const [cardHeight, setCardHeight] = useState(0);

    const panX = useRef(new Animated.Value(0)).current;
    const dragProgress = useMemo(
        () =>
            panX.interpolate({
                inputRange: [-M.swipeDistance, 0, M.swipeDistance],
                outputRange: [1, 0, 1],
                extrapolate: "clamp",
            }),
        [panX],
    );
    const dragRotate = useMemo(
        () =>
            panX.interpolate({
                inputRange: [-M.dragRange, 0, M.dragRange],
                outputRange: [`-${M.dragRotation}deg`, "0deg", `${M.dragRotation}deg`],
                extrapolate: "clamp",
            }),
        [panX],
    );

    const busy = useRef(false); // true while a card is flying away
    const fromSwipe = useRef(false); // true for the change caused by a finished swipe
    const mounted = useRef(false);
    const currentRef = useRef(current);
    currentRef.current = current;
    const latest = useRef({});

    useEffect(() => {
        mounted.current = true;
    }, []);

    // The new front card always starts centred.
    useLayoutEffect(() => {
        panX.setValue(0);
        busy.current = false;
        fromSwipe.current = false;
    }, [current, panX]);

    const goTo = (next) => {
        if (next === currentRef.current) return;
        currentRef.current = next;
        setIndex(next);
        onIndexChange?.(next);
    };
    const advance = () => goTo((currentRef.current + 1) % latest.current.count);

    const springBack = () =>
        Animated.spring(panX, {
            toValue: 0,
            friction: 7,
            tension: 80,
            useNativeDriver: false,
        }).start();

    const settle = (dx, vx) => {
        const farEnough = Math.abs(dx) >= M.swipeDistance;
        const fastEnough = Math.abs(vx) >= M.flingVelocity;
        if (!farEnough && !fastEnough) {
            springBack();
            return;
        }
        busy.current = true;
        const direction = Math.sign(dx || vx) || 1;
        Animated.timing(panX, {
            toValue: direction * latest.current.width,
            duration: M.dismissMs,
            useNativeDriver: false,
        }).start(({ finished }) => {
            if (!finished) return;
            fromSwipe.current = true;
            advance();
        });
    };

    latest.current = { count, width, advance, settle, springBack };
    const responder = useRef(
        PanResponder.create({
            onMoveShouldSetPanResponder: (_, g) =>
                latest.current.count > 1 &&
                !busy.current &&
                Math.abs(g.dx) > 8 &&
                Math.abs(g.dx) > Math.abs(g.dy) * 1.5,
            onPanResponderTerminationRequest: () => false,
            onPanResponderMove: (_, g) => panX.setValue(g.dx),
            onPanResponderRelease: (_, g) => latest.current.settle(g.dx, g.vx),
            onPanResponderTerminate: () => latest.current.springBack(),
        }),
    ).current;

    if (loading && renderSkeleton) {
        return (
            <View style={style}>
                <View
                    style={[
                        cardStack.stage,
                        cardHeight > 0 ? { height: cardHeight + M.extraHeight } : null,
                    ]}
                >
                    {[2, 1, 0].map((depth) => (
                        <StackCard
                            key={`skeleton-${depth}`}
                            depth={depth}
                            panX={panX}
                            dragProgress={dragProgress}
                            dragRotate={dragRotate}
                            startHidden={false}
                            snap={false}
                            reveal={false}
                            skeleton={null}
                            onLayout={(e) =>
                                setCardHeight((h) =>
                                    Math.max(h, Math.ceil(e.nativeEvent.layout.height)),
                                )
                            }
                        >
                            {renderSkeleton({ fill: false })}
                        </StackCard>
                    ))}
                </View>
            </View>
        );
    }

    if (count === 0) return null;

    const visible = Math.min(count, maxVisible);
    const cards = [];
    for (let depth = visible - 1; depth >= 0; depth -= 1) {
        const itemIndex = (current + depth) % count;
        const item = data[itemIndex];
        const key = keyExtractor
            ? keyExtractor(item, itemIndex)
            : String(item?.id ?? item?.key ?? itemIndex);

        cards.push(
            <StackCard
                key={key}
                depth={depth}
                panX={panX}
                dragProgress={dragProgress}
                dragRotate={dragRotate}
                startHidden={mounted.current}
                snap={fromSwipe.current}
                reveal={revealContent}
                skeleton={renderSkeleton ? renderSkeleton({ fill: true }) : null}
                onLayout={(e) =>
                    setCardHeight((h) =>
                        Math.max(h, Math.ceil(e.nativeEvent.layout.height)),
                    )
                }
            >
                {renderItem({ item, index: itemIndex })}
            </StackCard>,
        );
    }

    const dotCount = Math.min(count, maxDots);
    const firstDot = Math.min(
        Math.max(current - Math.floor(dotCount / 2), 0),
        count - dotCount,
    );
    const dots = [];
    for (let i = firstDot; i < firstDot + dotCount; i += 1) {
        dots.push(
            <Pressable
                key={i}
                hitSlop={8}
                onPress={() => goTo(i)}
                accessibilityRole="button"
                accessibilityLabel={`Show card ${i + 1} of ${count}`}
                accessibilityState={{ selected: i === current }}
                style={[
                    cardStack.dot,
                    i === current ? cardStack.dotActive : cardStack.dotInactive,
                ]}
            />,
        );
    }

    return (
        <View style={style}>
            <View
                {...responder.panHandlers}
                style={[
                    cardStack.stage,
                    cardHeight > 0 ? { height: cardHeight + M.extraHeight } : null,
                ]}
            >
                {cards}
            </View>
            {count > 1 ? <View style={cardStack.dots}>{dots}</View> : null}
        </View>
    );
}