import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

//show jobs for user and have edit button that navigates to Jobs screen
//edit button will pass id for job to be editted aka selectedJob and pass editJob as true

const JobsScreen = () => {
  return (
    <View style={styles.container}>
      <Text>JobsScreen</Text>
    </View>
  )
}

export default JobsScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    }
})