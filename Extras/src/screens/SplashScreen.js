import { StyleSheet, Text, View } from 'react-native'
import React, {useState, useEffect, useContext} from 'react'
import { getAuth, onAuthStateChanged } from "firebase/auth";
import {getExtras, getJobs, getUserFromDB} from '../util'
import { Context } from '../context/Context';

const SplashScreen = ({navigation}) => {

    const auth = getAuth();
    const { setUser, setExtras, setJobs } = useContext(Context)

    useEffect(() => {
      console.log('in SplashScreen')
      setTimeout(async () => {  
        const user = auth.currentUser
        console.log('current user', user)
            setExtras(await getExtras())
            setJobs(await getJobs())
            if (user) {
                getUser(user.uid)
            } else {
                setUser(null)
                navigation.navigate('Login')
            }

      }, 1000)
    }, [])

    
    const getUser = async (uid) => {
        let result = await getUserFromDB(uid)
        console.log('in splashscreen')
        console.log('result', result)
        setUser(result.user)
        if(!result){
          navigation.navigate('Login')
          return
        }
        else{
          let isExtra = !!result.user.firstName
          console.log('isExtra in splash screen', isExtra)
          navigation.navigate('Home', {isExtra: isExtra, loggedIn: true})
        }
      }

  return (
    <View style={styles.container}>
      <Text>Splash Screen</Text>
    </View>
  )
}

export default SplashScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    }
})