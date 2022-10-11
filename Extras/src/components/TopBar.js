import React from 'react'
import { View, StyleSheet } from 'react-native'
import { FontAwesome5, FontAwesome } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native';
import { auth } from '../firebase/firebase';


export default function TopBar() {

  const navigation = useNavigation()
  

  async function handleProfileButton(){
    await auth.onAuthStateChanged(user => {
      if(user){
        console.log('user is already logged in', user)
        navigation.navigate('Profile')
      }
      else{
        console.log('user is not logged in')
        navigation.navigate('Login')
      }
    })

  }

  return (
    <View style={styles.container}>
      <FontAwesome5 name="fire" size={27} color="#F06795" />
      <FontAwesome name="comments" size={27} color="#5c5c5c" />
      <FontAwesome name="user" size={27} color="#5c5c5c" onPress={handleProfileButton}/>
    </View>
  )
}

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
