import React, { useCallback, useRef, useState } from "react";
import { StyleSheet, Text, View, Animated } from "react-native";
import {
  TapGestureHandler,
  LongPressGestureHandler,
  PanGestureHandler,
  FlingGestureHandler,
  PinchGestureHandler,
  State,
  Directions,
  PanGestureHandlerGestureEvent,
  PinchGestureHandlerGestureEvent,
  LongPressGestureHandlerStateChangeEvent,
  TapGestureHandlerStateChangeEvent,
  FlingGestureHandlerStateChangeEvent,
} from "react-native-gesture-handler";
import { useGameContext } from "@/context/GameContext";
import { ANIMATION_CONFIG } from "@/constants/animations";

export default function GameScreen() {
  const { points, addPoints, updateTaskProgress, currentImage } =
    useGameContext();
  const [message, setMessage] = useState<string>("Tap to start!");

  const scale = useRef(new Animated.Value(1)).current;
  const translateX = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(0)).current;
  const lastDragX = useRef<number>(0);
  const lastDragY = useRef<number>(0);

  const longPressTimeout = useRef<NodeJS.Timeout | null>(null);
  const longPressProgress = useRef(new Animated.Value(0)).current;

  const onSingleTap = (event: TapGestureHandlerStateChangeEvent) => {
    if (event.nativeEvent.state === State.ACTIVE) {
      addPoints(1);
      updateTaskProgress("click");
      setMessage(`+1 point!`);

      Animated.spring(scale, {
        toValue: 1.2,
        ...ANIMATION_CONFIG.SPRING,
      }).start(() => {
        Animated.spring(scale, {
          toValue: 1,
          ...ANIMATION_CONFIG.SPRING,
        }).start();
      });
    }
  };

  const onFlingRight = (event: FlingGestureHandlerStateChangeEvent) => {
    if (event.nativeEvent.state === State.END) {
      const randomPoints = Math.floor(Math.random() * 5) + 1;
      addPoints(randomPoints);
      updateTaskProgress("swipeRight");
      setMessage(`Swipe right! +${randomPoints} points!`);
    }
  };

  const onPanStateChange = (event: PanGestureHandlerGestureEvent) => {
    if (event.nativeEvent.state === State.BEGAN) {
      setMessage((prev) => (prev !== "Dragging..." ? "Dragging..." : prev));
      translateX.setOffset(lastDragX.current);
      translateY.setOffset(lastDragY.current);
      translateX.setValue(0);
      translateY.setValue(0);
    } else if (event.nativeEvent.state === State.END) {
      lastDragX.current += event.nativeEvent.translationX;
      lastDragY.current += event.nativeEvent.translationY;

      translateX.flattenOffset();
      translateY.flattenOffset();

      addPoints(3);
      updateTaskProgress("drag");
      setMessage("Drag complete! +3 points!");
    }
  };

  const onDoubleTap = (event: TapGestureHandlerStateChangeEvent) => {
    if (event.nativeEvent.state === State.ACTIVE) {
      addPoints(2);
      updateTaskProgress("doubleClick");
      setMessage(`Double tap! +2 points!`);

      Animated.spring(scale, {
        toValue: 1.4,
        tension: 50,
        friction: 3,
        useNativeDriver: true,
      }).start(() => {
        Animated.spring(scale, {
          toValue: 1,
          tension: 50,
          friction: 4,
          useNativeDriver: true,
        }).start();
      });
    }
  };

  const onLongPressStateChange = (
    event: LongPressGestureHandlerStateChangeEvent
  ) => {
    if (event.nativeEvent.state === State.BEGAN) {
      setMessage("Hold it...");

      longPressProgress.setValue(0);
      Animated.timing(longPressProgress, {
        toValue: 1,
        duration: 3000,
        useNativeDriver: false,
      }).start();

      longPressTimeout.current = setTimeout(() => {
        addPoints(5);
        updateTaskProgress("longPress");
        setMessage("Long press! +5 points!");
      }, 3000);
    } else if (
      event.nativeEvent.state === State.END ||
      event.nativeEvent.state === State.FAILED
    ) {
      if (longPressTimeout.current) {
        clearTimeout(longPressTimeout.current);
      }
      longPressProgress.stopAnimation();
      setMessage("Press longer next time!");
    }
  };

  const onPanGestureEvent = Animated.event<PanGestureHandlerGestureEvent>(
    [{ nativeEvent: { translationX: translateX, translationY: translateY } }],
    { useNativeDriver: false }
  );

  const onFlingLeft = (event: FlingGestureHandlerStateChangeEvent) => {
    if (event.nativeEvent.state === State.END) {
      const randomPoints = Math.floor(Math.random() * 5) + 1;
      addPoints(randomPoints);
      updateTaskProgress("swipeLeft");

      setMessage(`Swipe left! +${randomPoints} points!`);
    }
  };

  const [baseScale, setBaseScale] = useState<number>(1);
  const pinchScale = useRef(new Animated.Value(1)).current;

  const onPinchGestureEvent = Animated.event<PinchGestureHandlerGestureEvent>(
    [{ nativeEvent: { scale: pinchScale } }],
    { useNativeDriver: false }
  );

  const onPinchStateChange = (event: PinchGestureHandlerGestureEvent) => {
    if (event.nativeEvent.state === State.BEGAN) {
      setMessage("Pinching...");
    } else if (event.nativeEvent.state === State.END) {
      const newScale = Math.min(
        Math.max(baseScale * event.nativeEvent.scale, 0.5),
        6
      );
      setBaseScale(newScale);

      Animated.spring(pinchScale, {
        toValue: 1,
        tension: 90,
        friction: 7,
        useNativeDriver: true,
      }).start();

      addPoints(4);
      updateTaskProgress("pinch");
      setMessage("Pinch complete! +4 points!");
    }
  };

  const combinedScale = Animated.multiply(
    scale,
    Animated.multiply(pinchScale, new Animated.Value(baseScale))
  );

  const singleTapRef = useRef<TapGestureHandler>(null);
  const doubleTapRef = useRef<TapGestureHandler>(null);
  const panRef = useRef(null);
  const pinchRef = useRef(null);
  const longPressRef = useRef(null);
  const flingLeftRef = useRef(null);
  const flingRightRef = useRef(null);
  const getImageSource = useCallback((id = 0) => {
    switch (id) {
      case 1:
        return require("../../assets/images/game_stage_1.png");
      case 2:
        return require("../../assets/images/game_stage_2.png");
      case 3:
        return require("../../assets/images/game_stage_3.png");
      case 4:
        return require("../../assets/images/game_stage_4.png");
      case 5:
        return require("../../assets/images/game_stage_5.png");
      case 6:
        return require("../../assets/images/game_stage_6.png");
      case 7:
        return require("../../assets/images/game_stage_7.png");
      case 8:
        return require("../../assets/images/game_stage_8.png");
      default:
        return require("../../assets/images/game_stage_0.png");
    }
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.points}>{points} Points</Text>
      <Text style={styles.message}>{message}</Text>

      <FlingGestureHandler
        ref={flingRightRef}
        direction={Directions.RIGHT}
        onHandlerStateChange={onFlingRight}
        simultaneousHandlers={[flingLeftRef, panRef, pinchRef]}
      >
        <FlingGestureHandler
          ref={flingLeftRef}
          direction={Directions.LEFT}
          onHandlerStateChange={onFlingLeft}
          simultaneousHandlers={[flingRightRef, panRef, pinchRef]}
        >
          <PinchGestureHandler
            ref={pinchRef}
            onGestureEvent={onPinchGestureEvent}
            onHandlerStateChange={onPinchStateChange}
            simultaneousHandlers={[panRef, flingLeftRef, flingRightRef]}
          >
            <PanGestureHandler
              ref={panRef}
              onGestureEvent={onPanGestureEvent}
              onHandlerStateChange={onPanStateChange}
              simultaneousHandlers={[pinchRef, flingLeftRef, flingRightRef]}
            >
              <TapGestureHandler
                ref={singleTapRef}
                waitFor={[doubleTapRef, longPressRef]}
                onHandlerStateChange={onSingleTap}
              >
                <TapGestureHandler
                  ref={doubleTapRef}
                  numberOfTaps={2}
                  onHandlerStateChange={onDoubleTap}
                  waitFor={longPressRef}
                >
                  <LongPressGestureHandler
                    ref={longPressRef}
                    onHandlerStateChange={onLongPressStateChange}
                    minDurationMs={3000}
                  >
                    <Animated.View style={styles.imageContainer}>
                      <Animated.Image
                        source={getImageSource(currentImage)}
                        style={[
                          styles.image,
                          {
                            transform: [
                              { translateX },
                              { translateY },
                              { scale: combinedScale },
                            ],
                          },
                        ]}
                        resizeMode="contain"
                      />
                    </Animated.View>
                  </LongPressGestureHandler>
                </TapGestureHandler>
              </TapGestureHandler>
            </PanGestureHandler>
          </PinchGestureHandler>
        </FlingGestureHandler>
      </FlingGestureHandler>

      <Text style={styles.instructions}>
        Tap, double-tap, long-press, drag, swipe or pinch the image!
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    alignItems: "center",
    justifyContent: "center",
  },
  points: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  message: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: "center",
    paddingHorizontal: 20,
  },
  imageContainer: {
    width: 200,
    height: 200,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
  image: {
    width: 150,
    height: 150,
  },
  instructions: {
    fontSize: 16,
    textAlign: "center",
    marginTop: 20,
    paddingHorizontal: 20,
    zIndex: 0,
  },
  progressContainer: {
    width: "80%",
    height: 10,
    backgroundColor: "#e0e0e0",
    borderRadius: 5,
    marginBottom: 20,
    overflow: "hidden",
  },
  progressBar: {
    height: "100%",
    backgroundColor: "tomato",
  },
});
