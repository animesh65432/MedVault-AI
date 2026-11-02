import { scale } from '@/utils/scale'
import { useEffect } from 'react'
import { StyleSheet, View, useWindowDimensions } from 'react-native'
import Animated, {
  Easing,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated'

type Props = {
  ready: boolean
  onFinish: () => void
}

const AppSplash = ({ ready, onFinish }: Props) => {
  const { width, height } = useWindowDimensions()
  const START = scale(50)
  const diameter = Math.hypot(width, height) * 1.1

  const size = useSharedValue(START)

  const animatedCircle = useAnimatedStyle(() => ({
    width: size.value,
    height: size.value,
    borderRadius: size.value / 2,
  }))

  useEffect(() => {
    if (!ready) return
    size.value = withTiming(
      diameter,
      { duration: 1500, easing: Easing.inOut(Easing.cubic) },
      (finished) => {
        if (finished) runOnJS(onFinish)()
      }
    )
  }, [ready])

  return (
    <View style={styles.container} pointerEvents="none">
      <Animated.View style={[styles.circle, animatedCircle]} >
      </Animated.View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 999,
    elevation: 999,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#103D37',
    overflow: 'hidden',
  },
  circle: {
    backgroundColor: '#fff',
    position: "relative"
  },
})

export default AppSplash