import { SafeAreaView, StyleSheet, Text, View, TextInput, Pressable } from 'react-native'
import {Picker} from '@react-native-picker/picker';
import React, {useState, useEffect} from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ScrollView } from 'react-native';
import { KeyboardAvoidingView } from 'react-native';
import { Header } from 'react-native/Libraries/NewAppScreen';
import { Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';



const RegisterScreen = ({route}) => {
  const {userUID, userEmail} = route.params;

  // console.log('userUID', userUID)
  // console.log('user.email in RegisterScreen', userEmail)

  const navigation = useNavigation()

  const [userType, setUserType] = useState('extra')

  const [extra, setExtra] = useState({
    uid: userUID,
    email: userEmail,
    firstName: '',
    lastName: '',
    gender: 'male',
    //add rest
  })

  const [company, setCompany] = useState({
    uid: userUID,
    email: userEmail,
    companyName: '',
    //add rest
  })

  const [validationError, setValidationError] = useState({
    
    //extra
    firstName: false,
    lastName: false,
    gender: false,

    //company
    companyName: false,
  })
  
  const addExtra = async() => {
    console.log("getting into addExtra")
    try {
      if(!extra.firstName || extra.firstName.trim() === ''){
        setValidationError({...validationError, firstName: true})
        return
      }
      if(extra.firstName.length > 50){
        Alert.alert(
          "First name cannot be over 50 characters",
          "",
          [
              {
                  text: "OK",
                  onPress: () => console.log("OK pressed"),
              }
          ]
      )
        return
      }
      if(!extra.lastName || extra.lastName.trim() === ''){
        setValidationError({...validationError, lastName: true})
        return
      }
      if(extra.lastName.length > 50){
        Alert.alert(
          "Last name cannot be over 50 characters",
          "",
          [
              {
                  text: "OK",
                  onPress: () => console.log("OK pressed"),
              }
          ]
      )
        return
      }
      if(!extra.gender){
        setValidationError({...validationError, gender: true})
        return
      }

      console.log('extra validated successfully')

      const extraObj = {
        ...extra,
        firstName: extra.firstName,
        lastName: extra.lastName,
        gender: extra.gender,
      }

      console.log('extraObj to be saved', extraObj)

      const res = await firestore().collection('extras').add(extraObj)
      console.log('created extra', res)
      Object.assign(extra, {id: res.id})
      await firestore().collection('extras').doc(res.id).update({
        id: res.id
      })

      Alert.alert(
        'Thanks for joining!',
        'Your account has been created.',
        [
          {
            text: 'Yea!',
            onPress: () => navigation.navigate('Home', {userInfo: extraObj}),
            style: 'cancel'
          }
        ]
      )
    } catch (error) {
      console.log('an error occured', error)
    }

  }

  const addCompany = async() => {
    console.log('getting into addCompany')
    console.log('company', company)
    try {
      if(!company.companyName || company.companyName.trim() === ''){
        setValidationError({...validationError, companyName: true})
        return
      }
      if(company.companyName.length > 50){
        Alert.alert(
          "Company name cannot be over 50 characters",
          "",
          [
              {
                  text: "OK",
                  onPress: () => console.log("OK pressed"),
              }
          ]
      )
        return
      }
    
      console.log('company validated successfully')

      const companyObj = {
        ...company,
        companyName: company.companyName,
      }

      console.log('companyObj to be saved', companyObj)

      const res = await firestore().collection('companies').add(companyObj)
      console.log('created company', res)
      Object.assign(company, {id: res.id})
      await firestore().collection('companies').doc(res.id).update({
        id: res.id
      })

      Alert.alert(
        'Thanks for joining!',
        'Your account has been created.',
        [
          {
            text: 'Yea!',
            onPress: () => navigation.navigate('Home', {userInfo: companyObj}),
            style: 'cancel'
          }
        ]
      )
    } catch (error) {
      console.log('an error occured', error)
    }

  }

  return (
    <SafeAreaView>
      <ScrollView>
        <KeyboardAvoidingView enabled behavior={'position'} style={styles.container}>
          <View style={styles.formContainer}>
            {/* <Text style={styles.header}>Account Details</Text> */}
            <Text style={styles.header}>{userEmail}</Text> 
            <View style={styles.pickerContainer}>
              <Picker
              selectedValue={userType}
              onValueChange={(itemValue, itemIndex) => 
                setUserType(itemValue)
              }
            >
              <Picker.Item label={"Extra"} value={"extra"} />
              <Picker.Item label={"Company"} value={"company"} />
              </Picker>
            </View>
          
            <View style={styles.bodyContainer}>
              {userType && userType == 'extra' ? 
              <>
                <TextInput 
                autoCorrect={false}
                autoComplete={'off'}
                maxLength={50}
                style={styles.formTextInput}
                placeholderTextColor={'grey'}
                placeholder='Enter first Name'
                onChangeText={(text) => setExtra({...extra, firstName:text}, setValidationError({...validationError, firstName: false}))}
                value={extra.firstName}
                />
                <Text style={validationError.firstName ? styles.errorText : {display: 'none'}}>First Name is required</Text>

                <TextInput 
                autoCorrect={false}
                autoComplete={'off'}
                maxLength={50}
                style={styles.formTextInput}
                placeholderTextColor={'grey'}
                placeholder='Enter last Name'
                onChangeText={(text) => setExtra({...extra, lastName:text}, setValidationError({...validationError, lastName: false}))}
                value={extra.lastName}
                />
                <Text style={validationError.lastName ? styles.errorText : {display: 'none'}}>Last Name is required</Text>

                <Picker
                  selectedValue={extra.gender}
                  onValueChange={(itemValue, itemIndex) => 
                    setExtra({...extra, gender: itemValue})
                  }
                >
                  <Picker.Item label={"Male"} value={"male"} />
                  <Picker.Item label={"Female"} value={"female"} />
                  <Picker.Item label={"Non-binary"} value={"nonbinary"} />
                </Picker>
                <Text style={validationError.gender ? styles.errorText: {display: 'none'}}>Gender is required</Text>
              </>
              :
              <>
                <TextInput 
                  autoCorrect={false}
                  autoComplete={'off'}
                  maxLength={50}
                  style={styles.formTextInput}
                  placeholderTextColor={'grey'}
                  placeholder='Company Name'
                  onChangeText={(text) => setCompany({...company, companyName:text}, setValidationError({...validationError, companyName: false}))}
                  value={company.companyName}
                />
                <Text style={validationError.companyName ? styles.errorText : {display: 'none'}}>Company Name is required</Text>
              </>
              }
            </View>
            
            <View style={styles.submitContainer}>
              <Pressable
              style={[styles.submitButton, {marginTop: 20}]}
              onPress={userType == 'extra' ?  addExtra : addCompany}
              >
                <Text style={styles.textStyle}>Create Account</Text>
              </Pressable>
            </View>

          </View>
        </KeyboardAvoidingView>
      </ScrollView>
    </SafeAreaView>
  )
  
}

export default RegisterScreen

const styles = StyleSheet.create({
  container: {
    height: '100%',
    marginTop: 10
  },
  header: {
    textAlign: 'center',
    fontSize: 25,
    fontWeight: 'bold',
    marginBottom: -40,
    // backgroundColor: 'pink',
  },
  label: {
    textAlign: 'center',
    fontSize: 15,
    // fontWeight: 'bold',
    // marginBottom: 20,
  },
  formContainer:{
    padding: 10,
  },
  formTextInput: {
    textAlign: 'center',
    borderWidth: 2,
    // borderColor: 'white',
    paddingVertical: 10,
    marginHorizontal: 10,
    fontSize: 20,
    borderRadius: 6,
    // color: 'white',
    fontWeight: 'bold',
    marginBottom: 2,
  },
  pickerContainer: {

  },
  bodyContainer: {

  },
  submitContainer: {

  },
  errorText: {
    color: 'crimson',
    fontWeight: 'bold',
    marginBottom: 10,
    marginTop: 6,
    textAlign: 'center',
  },    
  textStyle: {
    fontSize: 30,
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
  },
  submitButton: {
    // alignSelf: 'center',
    // borderRadius: 50,
    // backgroundColor: 'darkgreen',
    // height: 60,
    // justifyContent: 'center',
    // width: '90%',
    width: 300,
    borderRadius: 15,
    margin: 15,
    padding: 15,
    elevation: 2,
    backgroundColor: "darkgreen",
  },
})