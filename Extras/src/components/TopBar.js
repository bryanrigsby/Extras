import React, {useEffect, useContext} from 'react'
import { View, StyleSheet, Alert } from 'react-native'
import { FontAwesome5, FontAwesome } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native';
import { getJobs, getUserFromDB } from '../util';
import { getAuth } from "firebase/auth";
import { Context } from '../context/Context';


const TopBar = ({ isExtra, loggedIn}) => {

  const auth = getAuth();
  const navigation = useNavigation()

  const { user, setUser, jobs } = useContext(Context)

  useEffect(() => {
    console.log('in TopBar')
    // console.log('user in TopBar', user)
    // console.log('isExtra in TopBar', isExtra)
    // console.log('loggedIn in TopBar', loggedIn)
  }, [])
  

  const profileButtonPressed = () => {
    console.log('loggedIn in TopBar profileButtonPressed()', loggedIn)
    if(loggedIn){
      Alert.alert(`Where to?`, '', [
        { text: 'Go back', onPress: () => {}},
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
    navigation.navigate('Profile', {editProfile: true, isExtra: isExtra})
  }

  const handleSignOut = () => {
    auth
    .signOut()
    .then(() => {
      setUser(null)
      navigation.replace("Login")
    }) 
    .catch(error => alert(error.message))

  }

  const addJobPressed = () => {
    console.log('loggedIn in TopBar addJobPressed()', loggedIn)
    if(loggedIn){
      Alert.alert(`Where to?`, '', [
        { text: 'Go back', onPress: () => {}},
        { text: 'See my jobs', onPress: () => getJobs()},
        { text: 'Add job', onPress: () => addJob() }
    ])
    }
    else{
      console.log('user is not logged in')
      navigation.navigate('Login')
    }
  }

  const getJobs = () => {
    //filter through jobs to get ones for this user
    console.log('user in TopBar getJobs()', user)
    console.log('jobs in TopBar getJobs()', jobs)
    if(jobs.length < 1){
      Alert.alert(`You don't seem to have any jobs`, '', [
        { text: 'Go Back', onPress: () => {}},
        { text: 'Add job', onPress: () => addJob() }
    ])
    }
    else{
      let companyJobs= jobs.filter(j => j.companyID === user.id)
      console.log('companyJobs', companyJobs)
      navigation.navigate('Jobs', {companyJobs: companyJobs})
    }
    //go to Jobs screen
  }

  const addJob = () => {
    navigation.navigate('ManageJobs')
    //go to ManageJobs screen
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
