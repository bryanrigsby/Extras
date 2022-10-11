import { StyleSheet, View, Alert, Image, Text } from 'react-native'
import React, {useContext, useEffect} from 'react'
import { Appbar } from 'react-native-paper';
import { auth, db } from '../firebase/firebase';
import { Context } from '../context/Context';

const SelectionScreen = ({navigation}) => {

  const { user, setUser, extras, setExtras, jobs, setJobs } = useContext(Context);
 
  useEffect(() => {
    getJobs()
    getExtras()
    navigation.navigate('Home')
  }, [])
  

  // const getUserLookingFor = () => {
  //   Alert.alert(
  //       [
  //           {
  //               text: "See Extras",
  //               onPress: () => console.log('see extras')
  //               // onPress: () => {getExtras(); navigation.navigate('Home')}
  //           },
  //           {
  //               text: "See Jobs",
  //               onPress: () => console.log('see jobs')
  //               // onPress: () => {getJobs(); navigation.navigate('Home')}
  //           }
  //       ]
  //   )
  // }

  const getJobs = async () => {
    //get jobs and save to global state
    let temp = [];
    try{
      let snapshot = await db.collection('jobs').get()
      if(snapshot){
        snapshot.forEach((doc) => {
          // console.log('in querySnapshot', doc.data())
          temp.push(doc.data())
        })
      }
      else{
        Alert.alert('No jobs returned')
      }
    }
    catch(error) {
        Alert.alert(error)
    }
      //save temp to jobContext here
      setJobs(temp)
  }
  
  const getExtras = async () => {
    //get extras and save to global state
    let temp = [];
    try{
      let snapshot = await db.collection('extras').get()
      if(snapshot){
        snapshot.forEach((doc) => {
          // console.log('in querySnapshot', doc.data())
          temp.push(doc.data())
        })
      }
      else{
        Alert.alert('No extras returned')
      }
    }
    catch(error){
      Alert.alert(error)
    }
      //save temp extraContext here
      setExtras(temp)
  }
  
  return (
    <>
    {/* <Appbar.Header>
        <Appbar.Content title="Extras" />
    </Appbar.Header> */}
    <View style={styles.imageContainer}>
      <Image
        style={styles.imageStyle}
        source={require('../../assets/e.png')}
      />

    </View>
    </>
  )
}

export default SelectionScreen

const styles = StyleSheet.create({
    imageContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
        // backgroundColor: 'pink'
    },
    imageStyle: {
        width: 100,
        height: 100
    }
})