import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useState, useEffect, useRef, useContext } from 'react'
import { auth, db } from '../firebase/firebase'
import { useNavigation } from '@react-navigation/native'
import Constants from 'expo-constants'
import { Context } from '../context/Context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getExtras, getJobs } from '../util'
import { Appbar, TextInput, Button, ActivityIndicator, MD2Colors } from 'react-native-paper'
import { getAuth, onAuthStateChanged } from "firebase/auth";

//components
import TopBar from '../components/TopBar'
import axios from 'axios'
import BottomBar from '../components/BottomBar'
import Swipes from '../components/Swipes'
import { Alert } from 'react-native'


const HomeScreen = ({navigation, route}) => {

  console.log('params in HomeScreen', route.params)

  const { user, setUser, extras, setExtras, jobs, setJobs } = useContext(Context)
  const [currentIndex, setCurrentIndex] = useState(0)
  const swipesRef = useRef(null)
  const {isExtra} = route.params

  const handleLike = () => {
    console.log('like')
    nextUser()
  }

  const handlePass = () => {
    console.log('pass')
    nextUser()
  }

  const nextUser = () => {
    const nextIndex = isExtra ? (jobs.length - 2 === currentIndex ? 0 : currentIndex + 1) : (extras.length - 2 === currentIndex ? 0 : currentIndex + 1)
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
      <TopBar isExtra={isExtra}/>
      <View style={styles.swipes}>
        {isExtra && jobs.length > 0 ? 
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
        : !isExtra && extras.length > 0 ?
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