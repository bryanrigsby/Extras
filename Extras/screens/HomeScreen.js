import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { auth } from '../firebase/firebase'
import { useNavigation } from '@react-navigation/native'

const HomeScreen = ({params}) => {

  console.log('params in HomeScreen', params)

  const navigation = useNavigation()

  const handleSignOut = () => {
    auth
    .signOut()
    .then(() => {
      navigation.replace("Login")
    }) 
    .catch(error => alert(error.message))

  }

  return (
    <SafeAreaView>
      <View style={styles.container}>
        <Text>Email: { auth.currentUser?.email}</Text>
        <TouchableOpacity
          onPress={handleSignOut}
          style={styles.button}
        >
          <Text style={styles.buttonText}>Sign out</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}

export default HomeScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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