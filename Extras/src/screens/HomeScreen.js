import { StyleSheet, Text, View } from 'react-native'
import React, { useState, useRef, useContext, useEffect } from 'react'
import Constants from 'expo-constants'
import { Context } from '../context/Context';
import { Appbar } from 'react-native-paper'

//components
import TopBar from '../components/TopBar'
import BottomBar from '../components/BottomBar'
import Swipes from '../components/Swipes'



const HomeScreen = ({navigation, route}) => {



  const { user, extras, jobs } = useContext(Context)
  const [currentIndex, setCurrentIndex] = useState(0)
  const swipesRef = useRef(null)
  const {isExtra, loggedIn } = route.params

  useEffect(() => {
    console.log('in home')
    // console.log('isExtra from route.params on HomeScreen', isExtra)
    // console.log('loggedIn from route.params on HomeScreen', loggedIn)
    console.log('extras on HomeScreen', extras)
    console.log('jobs on HomeScreen', jobs)
    // console.log('currentIndex in useEffect', currentIndex)
  }, [])
  



  const handleLike = () => {
    console.log('like')
    nextUser()
  }

  const handlePass = () => {
    console.log('pass')
    nextUser()
  }

  const nextUser = () => {
    console.log('getting here')
    const nextIndex = isExtra ? 
    (jobs.length - 2 === currentIndex ? 0 : currentIndex + 1) : 
    (extras.length - 2 === currentIndex ? 0 : currentIndex + 1)
    setCurrentIndex(nextIndex)
  }

  const handleLikePress = () => {
    swipesRef.current.openLeft()
  }

  const handlePassPress = () => {
    swipesRef.current.openRight()
  }

  

  return (
    <View style={styles.container}>
      
      <Appbar.Header>
        <Appbar.Content title={isExtra ? "Jobs" : "Extras"} />
      </Appbar.Header>
      <TopBar isExtra={isExtra} loggedIn={loggedIn} />
      <View style={styles.swipes}>
        {isExtra && jobs.length > 1 ? 
          jobs.map(
              (u, i) =>
                currentIndex === i && (
                  <Swipes
                    key={i}
                    ref={swipesRef}
                    currentIndex={currentIndex}
                    data={jobs}
                    handleLike={handleLike}
                    handlePass={handlePass}
                  ></Swipes>
                )
            )
        : !isExtra && extras.length > 1 ?
           extras.map(
            (u, i) =>            
              currentIndex === i && (
                <Swipes
                  key={i}
                  ref={swipesRef}
                  currentIndex={currentIndex}
                  data={extras}
                  handleLike={handleLike}
                  handlePass={handlePass}
                ></Swipes>
              )
          )
          :
          <View><Text>no data</Text></View>
        }
      </View>
      <BottomBar handleLikePress={handleLikePress} handlePassPress={handlePassPress} />
    </View>
  )
}

export default HomeScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: Constants.statusBarHeight,
  },
  swipes: {
    flex: 1,
    padding: 10,
    paddingTop: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.29,
    shadowRadius: 4.65,
    elevation: 7,
  },
  button: {
    backgroundColor: '#0782f9',
    width: '60%',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 40,
},
  buttonText: {
      color: 'white',
      fontWeight: '700',
      fontSize: 16,
  },
})