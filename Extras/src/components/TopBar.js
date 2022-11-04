import React, {useEffect, useState} from 'react'
import { View, StyleSheet, Alert } from 'react-native'
import { FontAwesome5, FontAwesome } from '@expo/vector-icons'
import { TabRouter, useNavigation } from '@react-navigation/native';
import { auth } from '../firebase/firebase';
import { getAsyncStorage, getUserDBInfo, getUserFromDB } from '../util';
import { getAuth, onAuthStateChanged } from "firebase/auth";


const TopBar = ({isExtra}) => {

  const [loggedIn, setLoggedIn] = useState(false)
  const navigation = useNavigation()
  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      // console.log(user)
      if (!user) {
        setLoggedIn(false)
        navigation.navigate('Login')
      }
      else{
        setLoggedIn(true)
        // Alert.alert('user logged in')
      }
    });

    return () => {
      unsubscribe()
    }
  }, [])
  

  const profileButtonPressed = () => {
    console.log('loggedIn in TopBar', loggedIn)
    if(loggedIn){
      Alert.alert(`Where to?`, '', [
        { text: 'Log out', onPress: () => handleSignOut()},
        { text: 'Edit Profile', onPress: () => handleGoToProfile() }
    ])
    }
    else{
      console.log('user is not logged in')
      navigation.navigate('Login')
    }

  }

  const handleGoToProfile = async () => {
    //get user id from async and get user data to pass to profile screen

    let asyncUser = await getAsyncStorage('@user')
    console.log('asyncUser', asyncUser)

    let userInfo = await getUserFromDB(asyncUser.uid)

    console.log('userInfo in TopBar', userInfo)
    
    

    navigation.navigate('Profile', {userInfo: userInfo, editProfile: true, isExtra: isExtra})
  }

  const handleSignOut = () => {
    auth
    .signOut()
    .then(() => {
      navigation.replace("Login")
    }) 
    .catch(error => alert(error.message))

  }

  const addJobPressed = () => {

  }

  const likedListPressed = () => {

  }

  return (
    <View style={styles.container}>
      {loggedIn && <FontAwesome5 name="list" size={27} color="#5c5c5c" onPress={likedListPressed} />}
      {(loggedIn && !isExtra) && <FontAwesome name="plus" size={27} color="#5c5c5c" onPress={addJobPressed} />}
      <FontAwesome name="user" size={27} color="#5c5c5c" onPress={profileButtonPressed}/>
    </View>
  )
}

export default TopBar

const styles = StyleSheet.create({
  container: {
    height: 60,
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 15,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.12,
    shadowRadius: 5.46,
    elevation: 9,
  },
})
