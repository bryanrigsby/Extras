import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useState, useEffect, useRef, useContext } from 'react'
import { auth, db } from '../firebase/firebase'
import { useNavigation } from '@react-navigation/native'
import Constants from 'expo-constants'
import { Context } from '../context/Context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getExtras, getJobs } from '../util'

//components
import TopBar from '../components/TopBar'
import axios from 'axios'
import BottomBar from '../components/BottomBar'
import Swipes from '../components/Swipes'


const HomeScreen = ({navigation, route}) => {

  console.log('params in HomeScreen', route.params)

  const { user, setUser, extras, setExtras, jobs, setJobs } = useContext(Context)
  const [currentIndex, setCurrentIndex] = useState(0)
  const swipesRef = useRef(null)
  const {isExtra} = route.params

  // useEffect(() => {
 

  //   console.log('user on home screen', user)
  //   console.log('jobs on home screen', jobs)
  //   console.log('extras on home screen', extras)
  // }, [])

  function handleLike() {
    console.log('like')
    nextUser()
  }

  function handlePass() {
    console.log('pass')
    nextUser()
  }

  function nextUser() {
    const nextIndex = isExtra ? (jobs.length - 2 === currentIndex ? 0 : currentIndex + 1) : (extras.length - 2 === currentIndex ? 0 : currentIndex + 1)
    setCurrentIndex(nextIndex)
  }

  function handleLikePress() {
    swipesRef.current.openLeft()
  }
  function handlePassPress() {
    swipesRef.current.openRight()
  }

  const handleSignOut = () => {
    auth
    .signOut()
    .then(() => {
      navigation.replace("Login")
    }) 
    .catch(error => alert(error.message))

  }

  return (
    <View style={styles.container}>
      <TopBar />
      <View style={styles.swipes}>
        {isExtra ?
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
        :
        extras.length > 0 &&
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