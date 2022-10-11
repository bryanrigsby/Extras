import { StyleSheet, View, Alert, KeyboardAvoidingView, ScrollView, Image } from 'react-native'
import React, {useState, useEffect, useContext} from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useNavigation } from '@react-navigation/native'
import { db } from '../firebase/firebase'
import { collection, addDoc, doc, updateDoc } from 'firebase/firestore'
import { getStorage, ref, getDownloadURL, uploadBytes } from 'firebase/storage'
import { Appbar, TextInput, Button, RadioButton, Text, Divider, ActivityIndicator, MD2Colors } from 'react-native-paper'
import DropDown from "react-native-paper-dropdown"
import { Context } from '../context/Context'
import { getJobs, getExtras, setAsyncStorage } from '../util'
import * as ImagePicker from 'expo-image-picker';
import uuid from "uuid";



const ProfileScreen = ({route, navigation}) => {


  const { user, setUser, extras, setExtras, jobs, setJobs } = useContext(Context)
  const userEmail = route.params.userEmail
  const userUID = route.params.userUID

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
  const [imageURI, setImageURI] = useState(null)
  const [errorMsg, setErrorMsg] = useState('')
  const [isLoading, setIsLoading] = useState(false)


  const [extra, setExtra] = useState({
    uid: '',
    email: '',
    firstName: '',
    lastName: '',
    gender: null,
    pictureURL: null,
    //add rest
  })

  const setGenderFunc = (gender) => {
    setGender(gender)
    setValidationError({...validationError, gender: false})
  }

  const [company, setCompany] = useState({
    uid: '',
    email: '',
    companyName: '',
    //add rest
  })

  const [validationError, setValidationError] = useState({
    
    //extra
    firstName: false,
    lastName: false,
    gender: false,
    imageURI: false,

    //company
    companyName: false,
  })

  useEffect(() => {
    console.log('user in profile screen', user)
    // console.log('extra', extra)
    // console.log('gender', gender)
    console.log('userEmail', userEmail)
    console.log('userUID', userUID)
  }, [])
  

  const validateExtra = () => {
    console.log('imageURI in validateExtra', imageURI)
    if(!extra.firstName || extra.firstName.trim() === ''){
      setValidationError({...validationError, firstName: true})
      setErrorMsg('First name is required')
      return false
    }
    if(extra.firstName.length > 50){
      setValidationError({...validationError, firstName: true})
      setErrorMsg('First name must be less than 50 charaters')
      return false
    }
    if(!extra.lastName || extra.lastName.trim() === ''){
      setValidationError({...validationError, lastName: true})
      setErrorMsg('Last name is required')
      return false
    }
    if(extra.lastName.length > 50){
      setValidationError({...validationError, lastName: true})
      setErrorMsg('Last name must be less than 50 charaters')
      return false
    }
    if(!imageURI){
      setValidationError({...validationError, imageURI: true})
      setErrorMsg('A picture must be provided')
      return false
    }
    if(!gender){
      setValidationError({...validationError, gender: true})
      setErrorMsg('Gender must be selected')
      return false
    }

    return true
  }
  
  const addExtra = async() => {
    console.log("getting into addExtra", extra)
    try {
      let isValid = validateExtra()
      if(!isValid){
          return
      }

      setIsLoading(true)

      //adjust to handle multiple images
      let returnedPictureURL = await handleImagePicked(userUID)

      const extraObj = {
        uid: userUID,
        email: userEmail,
        firstName: extra.firstName,
        lastName: extra.lastName,
        gender: gender,
        //adjust to handle multiple images
        pictureURL: returnedPictureURL,
      }


      const docRef = await addDoc(collection(db, 'extras'), extraObj)
      Object.assign(extraObj, {id: docRef.id})
      const extraRef = doc(db, 'extras', docRef.id)
      await updateDoc(extraRef, {
        id: docRef.id
      })

      setUser(extraObj)
      const userForAsync = JSON.stringify({uid: extraObj.uid, isExtra: true});
      await setAsyncStorage(userForAsync)

      //adjust for editing profile
      let returnedJobs = await getJobs()
      setJobs(returnedJobs)

      setIsLoading(false)

      Alert.alert(
        'Thanks for joining!',
        'Your extra account has been created.',
        [
          {
            text: 'Yea!',
            onPress: () => navigation.navigate('Home', {isExtra: true}),
            style: 'cancel'
          }
        ]
      )
    } catch (error) {
      console.log('an error occured', error)
      Alert.alert('Something went wrong')
      setIsLoading(false)
      return
    }

  }

  const validateCompany = () => {
    if(!company.companyName || company.companyName.trim() === ''){
      setValidationError({...validationError, companyName: true})
      setErrorMsg('Company name is required')
      return false
    }
    if(company.companyName.length > 50){
      setValidationError({...validationError, companyName: true})
      setErrorMsg('Company name must be less than 50 charaters')
      return false
    }
    return true
  }

  const addCompany = async() => {
    console.log('getting into addCompany')
    try {
      let isValid = validateCompany()
      if(!isValid){
          return
      }
      
      console.log('company validated successfully')

      const companyObj = {
        uid: userUID,
        email: userEmail,
        companyName: company.companyName,
      }

      console.log('companyObj to be saved', companyObj)

      const docRef = await addDoc(collection(db, 'companies'), companyObj)
      Object.assign(companyObj, {id: docRef.id})
      const companyRef = doc(db, 'companies', docRef.id)
      await updateDoc(companyRef, {
        id: docRef.id
      })

      setUser(companyObj)
      const userForAsync = JSON.stringify({uid: companyObj.uid, isExtra: false});
      await setAsyncStorage(userForAsync)


      //* add ability to add jobs */




      //adjust for editing profile
      let returnedExtras = await getExtras()
      setExtras(returnedExtras)

      Alert.alert(
        'Thanks for joining!',
        'Your company account has been created.',
        [
          {
            text: 'Yea!',
            onPress: () => navigation.navigate('Home', {isExtra: false}),
            style: 'cancel'
          }
        ]
      )
    } catch (error) {
      console.log('an error occured', error)
    }

  }

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      alert("Sorry, we need camera roll permissions to make this work!");
      return
    }
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log('pick image result',result);

    if (!result.cancelled) {
      setImageURI(result.uri);
    }
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      alert("Sorry, we need camera roll permissions to make this work!");
      return
    }
    let result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
    });

    if (!result.cancelled) {
      setImage(result.uri);
    }
  }

  const handleImagePicked = async (uid) => {
    try {
      const uploadUrl = await uploadImageAsync(imageURI, uid)
      console.log('uploadURL', uploadUrl)
      return uploadUrl
    }
    catch (e) {
      console.log(e);
      alert("Upload failed, sorry :(");
    }
  }

  const uploadImageAsync = async (uri, uid) => {
    const blob = await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = function () {
        resolve(xhr.response);
      };
      xhr.onerror = function (e) {
        console.log(e);
        reject(new TypeError("Network request failed"));
      };
      xhr.responseType = "blob";
      xhr.open("GET", uri, true);
      xhr.send(null);
    });

    //adjust to handle multiple images
    const fileRef = ref(getStorage(), uid);
    const result = await uploadBytes(fileRef, blob);
  
    // We're done with the blob, close and release it
    blob.close();
  
    return await getDownloadURL(fileRef);
  }

  return (
    <>
    <Appbar.Header>
        <Appbar.Content title="Extras" />
    </Appbar.Header>
    {isLoading ?
      <ActivityIndicator style={styles.container} animating={isLoading} color={MD2Colors.purple400} size={'large'} />
    :
    <View style={styles.container}>
      <ScrollView>
        <KeyboardAvoidingView enabled behavior={'position'} style={styles.container}>
          <View style={styles.formContainer}>
          <Text variant={"headlineLarge"} style={styles.label}>Who are you?</Text>
            <View style={styles.buttonContainer}>
                <Button style={{marginRight: 10, width: 150, marginBottom: 20}} mode="contained" onPress={() => setUserType('extra')}>
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
                <Text style={validationError.firstName ? styles.errorText : {display: 'none'}}>{errorMsg}</Text>

                <TextInput
                  label="Enter Last Name"
                  value={extra.lastName}
                  onChangeText={text => setExtra({...extra, lastName:text}, setValidationError({...validationError, lastName: false}))}
                  style={{marginBottom: 10}}
                />
                <Text style={validationError.lastName ? styles.errorText : {display: 'none'}}>{errorMsg}</Text>

                {/* change to upload */}
                <View>
                  <Button mode="contained" onPress={pickImage}>Choose image</Button>
                  <Button mode="contained" onPress={takePhoto}>Take photo</Button>
                </View>
                
                {imageURI && <Image source={{ uri: imageURI }} style={{ width: 200, height: 200 }} />}
           
                <Text style={validationError.imageURI ? styles.errorText : {display: 'none'}}>{errorMsg}</Text>
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
                <Text style={validationError.gender ? styles.errorText: {display: 'none'}}>{errorMsg}</Text>
              </>
              :
              <>
              <TextInput
                  label="Enter Company Name"
                  value={company.companyName}
                  onChangeText={text => setCompany({...company, companyName:text}, setValidationError({...validationError, companyName: false}))}
                  style={{marginBottom: 10}}
                />
                <Text style={validationError.companyName ? styles.errorText : {display: 'none'}}>{errorMsg}</Text>
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
    }
  </>
  )
  
}

export default ProfileScreen

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