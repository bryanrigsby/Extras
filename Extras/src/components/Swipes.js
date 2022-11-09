import React, { useState, useEffect } from 'react'
import { StyleSheet } from 'react-native'
import Swipeable from 'react-native-gesture-handler/Swipeable'
import { RectButton } from 'react-native-gesture-handler'
import SwipeableImage from './SwipeableImage'

const Swipes = ({ data, currentIndex, handleLike, handlePass, swipesRef }) => {
  
  const [willLike, setWillLike] = useState(false)
  const [willPass, setWillPass] = useState(false)

  useEffect(() => {
    console.log('in Swipes')
    console.log('currentIndex', currentIndex)
    // console.log('data in Swipes', data)
    // console.log('currentIndex in Swipes', currentIndex)
  }, [currentIndex])
  


  const renderLeftActions = () => {
    return (
      <RectButton style={styles.container}>
        {/* <SwipeableImage data={data[currentIndex + 1]}></SwipeableImage> */}
      </RectButton>
    )
  }
  const renderRightActions = () => {
    return (
      <RectButton style={styles.container}>
        {/* <SwipeableImage data={data[currentIndex + 1]}></SwipeableImage> */}
      </RectButton>
    )
  }

  return (
    <Swipeable
      ref={swipesRef}
      friction={2}
      leftThreshold={40}
      rightThreshold={40}
      renderLeftActions={renderLeftActions}
      renderRightActions={renderRightActions}
      onSwipeableLeftOpen={() => {
        setWillLike(false)
        handleLike()
      }}
      onSwipeableRightOpen={() => {
        setWillPass(false)
        handlePass()
      }}
      onSwipeableLeftWillOpen={() => setWillLike(true)}
      onSwipeableRightWillOpen={() => setWillPass(true)}
    >
      <SwipeableImage data={data[currentIndex]} willLike={willLike} willPass={willPass} />
    </Swipeable>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
})

export default React.forwardRef((props, ref) => <Swipes swipesRef={ref} {...props}></Swipes>)
