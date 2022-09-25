import { StyleSheet, View, Pressable, Alert, KeyboardAvoidingView, ScrollView } from 'react-native'
import {Picker} from '@react-native-picker/picker';
import RadioButtonGroup, { RadioButtonItem } from "expo-radio-button";
import React, {useState, useEffect} from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import {auth, db} from '../firebase/firebase'
import { Appbar, TextInput, Button, RadioButton, Text, Divider } from 'react-native-paper';
import DropDown from "react-native-paper-dropdown";



const RegisterScreen = ({route}) => {
  const {userUID, userEmail} = route.params;

  // console.log('userUID', userUID)
  // console.log('user.email in RegisterScreen', userEmail)

  const navigation = useNavigation()

  const genderList = [
    {
      label: "Male",
      value: "male",
    },
    {
      label: "Female",
      value: "female",
    },
    {
      label: "Non-Binary",
      value: "nonbinary",
    },
  ];

  const [userType, setUserType] = useState(null)
  const [showDropDown, setShowDropDown] = useState(false);
  const [gender, setGender] = useState(null)

  const [extra, setExtra] = useState({
    uid: userUID,
    email: userEmail,
    firstName: '',
    lastName: '',
    gender: null,
    //add rest
  })

  const setGenderFunc = (gender) => {
    setGender(gender)
    // setExtra({...extra, gender: gender})
    setValidationError({...validationError, gender: false})
  }

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

  useEffect(() => {
    console.log('extra', extra)
    console.log('gender', gender)
    console.log('company', company)
  }, [extra, gender, company])
  
  
  const addExtra = async() => {
    console.log("getting into addExtra", extra)
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
      if(!gender){
        setValidationError({...validationError, gender: true})
        return
      }

      console.log('extra validated successfully')

      const extraObj = {
        ...extra,
        firstName: extra.firstName,
        lastName: extra.lastName,
        gender: gender,
      }

      console.log('extraObj to be saved', extraObj)

      const res = await db.collection('extras').add(extraObj)
      Object.assign(extra, {id: res.id})
      await db.collection('extras').doc(res.id).update({
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

      const res = await db.collection('companies').add(companyObj)
      Object.assign(company, {id: res.id})
      await db.collection('companies').doc(res.id).update({
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
    <>
    <Appbar.Header>
        <Appbar.Content title="Extras" />
    </Appbar.Header>
    <View style={styles.container}>
      <ScrollView>
        <KeyboardAvoidingView enabled behavior={'position'} style={styles.container}>
          <View style={styles.formContainer}>
          <Text variant={"headlineLarge"} style={styles.label}>Who are you?</Text>
            <View style={styles.buttonContainer}>
                <Button style={{marginRight: 10, width: 150}} mode="contained" onPress={() => setUserType('extra')}>
                    Extra
                </Button>
                <Button style={{width: 150, marginBottom: 20}} mode="contained" onPress={() => setUserType('company')}>
                    Company
                </Button>
            </View>
            <Divider bold style={{marginBottom: 20}} />
          
            <View style={styles.bodyContainer}>
              {!userType ? 
                <View style={{display: 'none'}}></View>
              : userType == 'extra' ? 
              <>
                <TextInput
                  label="Enter First Name"
                  value={extra.firstName}
                  onChangeText={text => setExtra({...extra, firstName:text}, setValidationError({...validationError, firstName: false}))}
                  style={{marginBottom: 10}}
                />
                <Text style={validationError.firstName ? styles.errorText : {display: 'none'}}>First Name is required</Text>

                <TextInput
                  label="Enter Last Name"
                  value={extra.lastName}
                  onChangeText={text => setExtra({...extra, lastName:text}, setValidationError({...validationError, lastName: false}))}
                  style={{marginBottom: 10}}
                />
                <Text style={validationError.lastName ? styles.errorText : {display: 'none'}}>Last Name is required</Text>
                <DropDown
                  label={"Gender"}
                  mode={"flat"}
                  visible={showDropDown}
                  showDropDown={() => setShowDropDown(true)}
                  onDismiss={() => setShowDropDown(false)}
                  value={gender}
                  setValue={setGenderFunc}
                  list={genderList}
                />
                <Text style={validationError.gender ? styles.errorText: {display: 'none'}}>Gender is required</Text>
              </>
              :
              <>
              <TextInput
                  label="Enter Company Name"
                  value={company.companyName}
                  onChangeText={text => setCompany({...company, companyName:text}, setValidationError({...validationError, companyName: false}))}
                  style={{marginBottom: 10}}
                />
                <Text style={validationError.companyName ? styles.errorText : {display: 'none'}}>Company Name is required</Text>
              </>
              }
            </View>
            
            {userType &&
            <View style={styles.submitContainer}>
              <Button style={{width: 250}} mode="contained" onPress={userType == 'extra' ?  addExtra : addCompany}>
                  Create Account
              </Button>
            </View>
            }

          </View> 
        </KeyboardAvoidingView>
      </ScrollView>
      </View>
    </>
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
    marginBottom: 30,
  },
  emailHeader: {
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    // backgroundColor: 'pink',
  },
  label: {
    textAlign: 'center',
    // fontSize: 15,
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
    flex: 1,
  },
  bodyContainer: {

  },
  submitContainer: {
    alignItems: 'center',
    marginTop: 10
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
  buttonContainer: {
    justifyContent: 'center',
    flexDirection: 'row',
    marginTop: 10,
    marginBottom: 10,
},
})