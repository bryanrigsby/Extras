import { StyleSheet, View, Alert, KeyboardAvoidingView, ScrollView, Image } from 'react-native'
import React, {useState, useEffect, useContext} from 'react'
import { db } from '../firebase/firebase'
import { collection, addDoc, doc, updateDoc } from 'firebase/firestore'
import { getStorage, ref, getDownloadURL, uploadBytes } from 'firebase/storage'
import { Appbar, TextInput, Button, Text, Divider, ActivityIndicator, MD2Colors } from 'react-native-paper'
import DropDown from "react-native-paper-dropdown"
import { Context } from '../context/Context'
import { validateEmail, getJobs, getExtras, validateSocial, validatePhoneNumber } from '../util'
import * as ImagePicker from 'expo-image-picker';
import Ionicons from '@expo/vector-icons/Ionicons';



const ProfileScreen = ({navigation, route}) => {

  const { user, setUser, setExtras, setJobs } = useContext(Context)

  //will only have these from editProfile
  const isExtra = route.params && route.params.isExtra ? route.params.isExtra : false
  const editProfile = route.params && route.params.editProfile ? route.params.editProfile : false
  //

  const genderList = [
    { label: "Male", value: "male" },
    { label: "Female", value: "female" },
    { label: "Non-Binary", value: "nonbinary" },
  ];

  const raceList = [
    { label: "American Indian or Alaska Native", value: "American Indian or Alaska Native" },
    { label: "Asian", value: "Asian" },
    { label: "Black or African American", value: "Black or African American" },
    { label: "Hispanic or Latino", value: "Hispanic or Latino" },
    { label: "Native Hawaiian or Other Pacific Islander.", value: "Native Hawaiian or Other Pacific Islander." },
    { label: "White", value: "White" }
  ];

  const heightFeetList = [
    { label: "3", value: 3 },
    { label: "4", value: 4 },
    { label: "5", value: 5 },
    { label: "6", value: 6 },
    { label: "7", value: 7 },
    { label: "8", value: 8 },
  ];

  const heightInchesList = [
    { label: "0", value: 0 },
    { label: "1", value: 1 },
    { label: "2", value: 2 },
    { label: "3", value: 3 },
    { label: "4", value: 4 },
    { label: "5", value: 5 },
    { label: "6", value: 6 },
    { label: "7", value: 7 },
    { label: "8", value: 8 },
    { label: "9", value: 9 },
    { label: "10", value: 10 },
    { label: "11", value: 11 }
  ];

  const bodyTypeList = [
    { label: "Rectangle", value: "Rectangle" },
    { label: "Inverted Triangle", value: "Inverted Triangle" },
    { label: "Hourglass", value: "Hourglass" },
    { label: "Apple", value: "Apple" },
    { label: "Pear", value: "Pear" },
  ];

  const fluentLanguagesList = [
    { label: "English", value: "English" },
    { label: "Mandarin", value: "Mandarin" },
    { label: "Hindi", value: "Hindi" },
    { label: "Spanish", value: "Spanish" },
    { label: "French", value: "French" },
    { label: "Arabic", value: "Arabic" },
    { label: "Bengali", value: "Bengali" },
    { label: "Russian", value: "Russian" },
    { label: "Portuguese", value: "Portuguese" },
    { label: "Indonesian", value: "Indonesian" }
  ];

  const religionList = [
    { label: "None", value: "None" },
    { label: "Christianity", value: "Christianity" },
    { label: "Islam", value: "Islam" },
    { label: "Hinduism", value: "Hinduism" },
    { label: "Buddhism", value: "Buddhism" },
    { label: "Judaism", value: "Judaism" },
  ];

  //Extra state
  const [extra, setExtra] = useState({
    uid: route.params.newUser ? route.params.newUser.uid : user ? user.uid : null,
    email: route.params.newUser ? route.params.newUser.email : user ? user.email : null,
    id: editProfile && isExtra ? user.id: null,
    firstName: editProfile && isExtra ? user.firstName : null,
    lastName: editProfile && isExtra ? user.lastName : null,
    age: editProfile && isExtra ? user.age : null,
    skills: editProfile && isExtra ? user.skills : null,
    professionalBackground: editProfile && isExtra ? user.professionalBackground : null,
    pictureURL: editProfile && isExtra ? user.pictureURL : null,
  })

  //Extra state dropdown
  const [showGenderDropDown, setShowGenderDropDown] = useState(false);
  const [gender, setGender] = useState(editProfile && isExtra ? user.gender : null)
  const [showRaceDropDown, setShowRaceDropDown] = useState(false);
  const [race, setRace] = useState(editProfile && isExtra ? user.race : null)
  const [showHeightFeetDropDown, setShowHeightFeetDropDown] = useState(false);
  const [heightFeet, setHeightFeet] = useState(editProfile && isExtra ? user.heightFeet : null)
  const [showHeightInchesDropDown, setShowHeightInchesDropDown] = useState(false);
  const [heightInches, setHeightInches] = useState(editProfile && isExtra ? user.heightInches : null)
  const [showBodyTypeDropDown, setShowBodyTypeDropDown] = useState(false);
  const [bodyType, setBodyType] = useState(editProfile && isExtra ? user.bodyType : null)
  // const [showFluentLanguagesDropDown, setShowFluentLanguagesDropDown] = useState(false);
  // const [fluentLanguages, setFluentLanguages] = useState(editProfile && isExtra ? user.fluentLanguages : '')
  const [showReligionDropDown, setShowReligionDropDown] = useState(false);
  const [religion, setReligion] = useState(editProfile && isExtra ? user.religion : null)
  const [imageSelected, setImageSelected] = useState(editProfile && isExtra && user.pictureURL ? true: false)
  const [newPictureBool, setNewPictureBool] = useState(false)
  /////

  //Extra dropdown function
  const setDropDownFunc = (type, value) => {
    console.log(`type: ${type}, value: ${value}`)
    switch (type) {
      case 'gender':
        setGender(value)
        break;
      case 'race':
        setRace(value)
        break;
      case 'heightFeet':
        setHeightFeet(value)
        break;
      case 'heightInches':
        setHeightInches(value)
        break;
      case 'bodyType':
        setBodyType(value)
        break;
      case 'fluentLanguages':
        setFluentLanguages(value)
        break;
      case 'religion':
        setReligion(value)
        break;    
      default:
        break;
    }
    
    setValidationError({...validationError, [type]: false})
  }


  //Company state
  const [company, setCompany] = useState({
    uid: route.params.newUser ? route.params.newUser.uid : user ? user.uid : null,
    email: route.params.newUser ? route.params.newUser.email : user ? user.email : null,
    id: editProfile ? user.id : null,
    companyName: editProfile ? user.companyName : null,
    companySocialMedia: editProfile ? user.companySocialMedia : null,
    pointOfContactFirstName: editProfile ? user.pointOfContactFirstName : null,
    pointOfContactLastName: editProfile ? user.pointOfContactLastName : null,
    pointOfContactEmail: editProfile ? user.pointOfContactEmail : null,
    pointOfContactPhoneNumber: editProfile ? user.pointOfContactPhoneNumber : null,
  })

  //other state
  const [errorMsg, setErrorMsg] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [userType, setUserType] = useState('extra')
   

  const [validationError, setValidationError] = useState({
    
    //extra
    firstName: null,
    lastName: null,
    age: null,
    gender: null,
    race: null,
    height: null,
    bodyType: null,
    fluentLanguages: null,
    religion: null,
    skills: null,
    professionalBackground: null,
    pictureURL: null,

    //company
    companyName: false,
    companySocialMedia: false,
    pointOfContactFirstName: false,
    pointOfContactLastName: false,
    pointOfContactEmail: false,
    pointOfContactPhoneNumber: false
  })


  useEffect(() => {
    console.log('getting into useEffect on ProfileScreen')
    if(editProfile && isExtra){
      setUserType('extra')
    }
    else if(editProfile && !isExtra){
      setUserType('company')      
    }
    console.log('user in ProfileScreen', user)
    
  }, [])


  const validateExtra = () => {
    console.log('getting into validateExtra')
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
    if(!gender){
      setValidationError({...validationError, gender: true})
      setErrorMsg('Gender is required')
      return false
    }
    if(!extra.age){
      setValidationError({...validationError, age: true})
      setErrorMsg('Age is required')
      return false
    }
    if(isNaN(parseInt(extra.age))){
      setValidationError({...validationError, age: true})
      setErrorMsg('Age must be numeric')
      return false
    }
    if(extra.age > 150 || extra.age < 16){
      setValidationError({...validationError, age: true})
      setErrorMsg('Age must be between 16 and 150')
      return false
    }
    if(!race){
      setValidationError({...validationError, race: true})
      setErrorMsg('Race is required')
      return false
    }
    if(!heightFeet || heightInches < 0){
      setValidationError({...validationError, height: true})
      setErrorMsg('Height must include feet and inches')
      return false
    }
    if(!bodyType){
      setValidationError({...validationError, bodyType: true})
      setErrorMsg('Body Type is required')
      return false
    }
    // if(!fluentLanguages){
    //   setValidationError({...validationError, fluentLanguages: true})
    //   setErrorMsg('At least one language is required')
    //   return false
    // }
    if(!religion){
      setValidationError({...validationError, religion: true})
      setErrorMsg('Religion is required')
      return false
    }
    if(!extra.skills){
      setValidationError({...validationError, skills: true})
      setErrorMsg('Special Skills are required')
      return false
    }
    if(!extra.professionalBackground){
      setValidationError({...validationError, professionalBackground: true})
      setErrorMsg('Professional Background is required')
      return false
    }
    if(!extra.pictureURL){
      setValidationError({...validationError, pictureURL: true})
      setErrorMsg('Profile picture is required')
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

      console.log('extra validated successfully')

      setIsLoading(true)

      let uid = route.params.newUser ? route.params.newUser.uid : user ? user.uid : null

      //adjust to handle multiple images
      let returnedPictureURL
      if(newPictureBool){
        returnedPictureURL = await handleImagePicked(uid)
      } 

      const extraObj = {
        uid: uid,
        email: route.params.newUser ? route.params.newUser.email : user ? user.email : null,
        id: extra.id,
        firstName: extra.firstName,
        lastName: extra.lastName,
        gender: gender,
        age: extra.age,
        race: race,
        heightFeet: heightFeet,
        heightInches: heightInches,
        bodyType: bodyType,
        // fluentLanguages: fluentLanguages,
        religion: religion,
        skills: extra.skills,
        professionalBackground: extra.professionalBackground,

        //adjust to handle multiple images
        pictureURL: editProfile ? user.pictureURL : newPictureBool ? returnedPictureURL : null,
      }

      console.log('extraObj', extraObj)

      if(editProfile){
        const extraRef = doc(db, 'extras', extraObj.id)
        await updateDoc(extraRef, extraObj)
      }
      else{
        const docRef = await addDoc(collection(db, 'extras'), extraObj)
        const extraRef = doc(db, 'extras', docRef.id)
        await updateDoc(extraRef, {
          id: docRef.id
        })
      }

      setIsLoading(false)

      Alert.alert(
        `Your account has been ${editProfile ? 'edited' : 'created'}.`,
        '',
        [
          {
            text: 'Yea!',
            onPress: () => navigation.navigate('Home', {isExtra: true, loggedIn: true}),
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
      setErrorMsg('Company Name is required')
      return false
    }
    if(company.companyName.length > 50){
      setValidationError({...validationError, companyName: true})
      setErrorMsg('Company Name must be less than 50 charaters')
      return false
    }
    if(!company.companySocialMedia || company.companySocialMedia.trim() === ''){
      setValidationError({...validationError, companySocialMedia: true})
      setErrorMsg('Company Social Media is required')
      return false
    }
    if(company.companySocialMedia.length > 500){
      setValidationError({...validationError, companySocialMedia: true})
      setErrorMsg('Company Social Media must be less than 500 charaters')
      return false
    }
    if(!validateSocial(company.companySocialMedia)){
      setValidationError({...validationError, companySocialMedia: true})
      setErrorMsg('Company Social Media must be a valid url')
      return false
    }
    if(!company.pointOfContactFirstName || company.pointOfContactFirstName.trim() === ''){
      setValidationError({...validationError, pointOfContactFirstName: true})
      setErrorMsg('Point of Contact First Name is required')
      return false
    }
    if(company.pointOfContactFirstName.length > 50){
      setValidationError({...validationError, pointOfContactFirstName: true})
      setErrorMsg('Point of Contact First Name must be less than 50 charaters')
      return false
    }
    if(!company.pointOfContactLastName || company.pointOfContactLastName.trim() === ''){
      setValidationError({...validationError, pointOfContactLastName: true})
      setErrorMsg('Point of Contact Last Name is required')
      return false
    }
    if(company.pointOfContactLastName.length > 50){
      setValidationError({...validationError, pointOfContactLastName: true})
      setErrorMsg('Point of Contact Last Name must be less than 50 charaters')
      return false
    }
    if(!company.pointOfContactEmail || company.pointOfContactEmail.trim() === ''){
      setValidationError({...validationError, pointOfContactEmail: true})
      setErrorMsg('Point of Contact Email is required')
      return false
    }
    if(!validateEmail(company.pointOfContactEmail)){
      setValidationError({...validationError, pointOfContactEmail: true})
      setErrorMsg('Point of Contact Email is not valid')
      return false
    }
    if(!company.pointOfContactPhoneNumber || company.pointOfContactPhoneNumber.trim() === ''){
      setValidationError({...validationError, pointOfContactPhoneNumber: true})
      setErrorMsg('Point of Contact Phone Number is required')
      return false
    }
    if(!validatePhoneNumber(company.pointOfContactPhoneNumber)){
      setValidationError({...validationError, pointOfContactPhoneNumber: true})
      setErrorMsg('Point of Contact Phone Number is not valid')
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

      setIsLoading(true)

      const companyObj = {
        uid: route.params.newUser ? route.params.newUser.uid : user ? user.uid : null,
        email: route.params.newUser ? route.params.newUser.email : user ? user.email : null,
        id: company.id,
        companyName: company.companyName,
        companySocialMedia: company.companySocialMedia,
        pointOfContactFirstName: company.pointOfContactFirstName,
        pointOfContactLastName: company.pointOfContactLastName,
        pointOfContactEmail: company.pointOfContactEmail,
        pointOfContactPhoneNumber: company.pointOfContactPhoneNumber
      }

      console.log('companyObj to be saved', companyObj)

      if(editProfile){
        const companyRef = doc(db, 'companies', companyObj.id)
        await updateDoc(companyRef, companyObj)
      }
      else{
        const docRef = await addDoc(collection(db, 'companies'), companyObj)
        const companyRef = doc(db, 'companies', docRef.id)
        await updateDoc(companyRef, {
          id: docRef.id
        })
      }
      
      setIsLoading(false)

      Alert.alert(
        `Your account has been ${editProfile ? 'edited' : 'created'}.`,
        '',
        [
          {
            text: 'Yea!',
            onPress: () => navigation.navigate('Home', {isExtra: false, loggedIn: true}),
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
      setNewPictureBool(true)
      setImageSelected(true)
      // setImageURI(result.uri);
      setExtra({...extra, pictureURL:result.uri})
      setValidationError({...validationError, pictureURL: false})
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
      setNewPictureBool(true)
      setImageSelected(true)
      setExtra({...extra, pictureURL:result.uri})
      setValidationError({...validationError, pictureURL: false})
    }
  }

  const handleImagePicked = async (uid) => {
    try {
      const uploadUrl = await uploadImageAsync(extra.pictureURL, uid)
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
        <Appbar.Content title={editProfile ? "Edit Profile" : "Create Profile"} />
    </Appbar.Header>
    {isLoading ?
    <View style={styles.activityIndicatorContainer}>
      <ActivityIndicator animating={isLoading} color={MD2Colors.purple400} size={'large'} />
    </View>
    :
    <View style={styles.mainContainer}>

      {/* header */}
      <View style={styles.headerContainer}>
        <Text variant={"headlineLarge"} style={styles.headingText}>{route.params.newUser ? route.params.newUser.email : user ? user.email : 'Welcome'}</Text>

        {!editProfile && 
        <View style={styles.buttonContainer}>
            <Button style={userType == 'extra' ? [styles.button, {marginRight: 10, backgroundColor: 'blue'}] : [styles.button, {marginRight: 10}]} mode="contained" onPress={() => setUserType('extra')}>
              Extra
          </Button>
           
          <Button style={userType == 'company' ? [styles.button, {backgroundColor: 'blue'}] : [styles.button]} mode="contained" onPress={() => setUserType('company')}>
              Company
          </Button>

          <Divider bold style={{marginBottom: 20}} />
        </View>
        }
      </View>

      <View style={styles.contentContainer}>
        {!userType ? 
            <View style={{display: 'none'}}></View>
          : userType == 'extra' ? 
          <>
          <KeyboardAvoidingView enabled behavior={'position'}>
            <ScrollView>
              <TextInput
                label="First Name"
                value={extra.firstName}
                onChangeText={text => setExtra({...extra, firstName:text}, setValidationError({...validationError, firstName: false}))}
                style={styles.textInput}
              />
              <Text style={validationError.firstName ? styles.errorText : {display: 'none'}}>{errorMsg}</Text>

              <TextInput
                label="Last Name"
                value={extra.lastName}
                onChangeText={text => setExtra({...extra, lastName:text}, setValidationError({...validationError, lastName: false}))}
                style={styles.textInput}
              />
              <Text style={validationError.lastName ? styles.errorText : {display: 'none'}}>{errorMsg}</Text>

              <View style={styles.textInput}>
                <DropDown
                  label={"Gender"}
                  mode={"flat"}
                  visible={showGenderDropDown}
                  showDropDown={() => setShowGenderDropDown(true)}
                  onDismiss={() => setShowGenderDropDown(false)}
                  value={gender}
                  setValue={(e) => setDropDownFunc('gender', e)}
                  list={genderList}
                />
              </View>
              <Text style={validationError.gender ? styles.errorText: {display: 'none'}}>{errorMsg}</Text>

              <TextInput
                label="Age"
                numeric
                keyboardType='numeric'
                value={extra.age}
                onChangeText={text => setExtra({...extra, age:text}, setValidationError({...validationError, age: false}))}
                style={styles.textInput}
              />
              <Text style={validationError.age ? styles.errorText : {display: 'none'}}>{errorMsg}</Text>

              <View style={styles.textInput}>
                <DropDown
                  label={"Race"}
                  mode={"flat"}
                  visible={showRaceDropDown}
                  showDropDown={() => setShowRaceDropDown(true)}
                  onDismiss={() => setShowRaceDropDown(false)}
                  value={race}
                  setValue={(e) => setDropDownFunc('race', e)}
                  list={raceList}
                />
              </View>
              <Text style={validationError.race ? styles.errorText: {display: 'none'}}>{errorMsg}</Text>

              <View style={styles.textInput}>
                <DropDown
                  label={"Height (feet)"}
                  mode={"flat"}
                  visible={showHeightFeetDropDown}
                  showDropDown={() => setShowHeightFeetDropDown(true)}
                  onDismiss={() => setShowHeightFeetDropDown(false)}
                  value={heightFeet}
                  setValue={(e) => setDropDownFunc('heightFeet', e)}
                  list={heightFeetList}
                />
              </View>

              <View style={styles.textInput}>
                <DropDown
                  label={"Height (inches)"}
                  mode={"flat"}
                  visible={showHeightInchesDropDown}
                  showDropDown={() => setShowHeightInchesDropDown(true)}
                  onDismiss={() => setShowHeightInchesDropDown(false)}
                  value={heightInches}
                  setValue={(e) => setDropDownFunc('heightInches', e)}
                  list={heightInchesList}
                />
              </View>
              <Text style={validationError.height ? styles.errorText: {display: 'none'}}>{errorMsg}</Text>

              <View style={styles.textInput}>
                <DropDown
                  label={"Body Type"}
                  mode={"flat"}
                  visible={showBodyTypeDropDown}
                  showDropDown={() => setShowBodyTypeDropDown(true)}
                  onDismiss={() => setShowBodyTypeDropDown(false)}
                  value={bodyType}
                  setValue={(e) => setDropDownFunc('bodyType', e)}
                  list={bodyTypeList}
                />
              </View>
              <Text style={validationError.bodyType ? styles.errorText: {display: 'none'}}>{errorMsg}</Text>
{/* 
          
              <View style={styles.textInput}>
                <DropDown
                  label={"Fluent Languages"}
                  multiSelect
                  mode={"flat"}
                  visible={showFluentLanguagesDropDown}
                  showDropDown={() => setShowFluentLanguagesDropDown(true)}
                  onDismiss={() => setShowFluentLanguagesDropDown(false)}
                  value={fluentLanguages}
                  setValue={(e) => {setDropDownFunc('fluentLanguages', e)}}
                  list={fluentLanguagesList}
                />
              </View>
              <Text style={validationError.fluentLanguages ? styles.errorText: {display: 'none'}}>{errorMsg}</Text> */}

              <View style={styles.textInput}>
                <DropDown
                  label={"Religion"}
                  mode={"flat"}
                  visible={showReligionDropDown}
                  showDropDown={() => setShowReligionDropDown(true)}
                  onDismiss={() => setShowReligionDropDown(false)}
                  value={religion}
                  setValue={(e) => setDropDownFunc('religion', e)}
                  list={religionList}
                />
              </View>
              <Text style={validationError.religion ? styles.errorText: {display: 'none'}}>{errorMsg}</Text>

              <TextInput
                label="Special skills"
                numberOfLines={4}
                multiline
                value={extra.skills}
                onChangeText={text => setExtra({...extra, skills:text}, setValidationError({...validationError, skills: false}))}
                style={styles.textInput}
              />
              <Text style={validationError.skills ? styles.errorText : {display: 'none'}}>{errorMsg}</Text>

              <TextInput
                label="Professional Background"
                numberOfLines={4}
                multiline
                value={extra.professionalBackground}
                onChangeText={text => setExtra({...extra, professionalBackground:text}, setValidationError({...validationError, professionalBackground: false}))}
                style={styles.textInput}
              />
              <Text style={validationError.professionalBackground ? styles.errorText : {display: 'none'}}>{errorMsg}</Text>

              <Text variant={"headlineSmall"} style={{marginTop: 10, textAlign: 'center'}}>Profile Picture</Text>
              <View style={styles.buttonContainer}>
                <Button style={[styles.button, {marginRight: 10}]} mode="contained" onPress={pickImage}>
                  Choose image
                </Button>
                <Button style={styles.button} mode="contained" onPress={takePhoto}>
                  Take photo
                </Button>
              </View>

              {/* <Image source={{uri: extra.pictureURL}} style={styles.photo} /> */}

              <Text variant={"headlineSmall"} style={imageSelected ? [styles.imageSelected, styles.headingText] : {display: 'none'}}>
                <Ionicons name="md-checkmark-circle" size={32} color="green" />
                Image Selected
              </Text>

              <Text style={validationError.pictureURL ? styles.errorText : {display: 'none'}}>{errorMsg}</Text>

              <Divider bold style={{marginBottom: 10}} />
              </ScrollView>
          </KeyboardAvoidingView>
          </>
          :
          <KeyboardAvoidingView>
            <ScrollView>
              <TextInput
                label="Company Name"
                value={company.companyName}
                onChangeText={text => setCompany({...company, companyName:text}, setValidationError({...validationError, companyName: false}))}
                style={styles.textInput}
              />
              <Text style={validationError.companyName ? styles.errorText : {display: 'none'}}>{errorMsg}</Text>

              <TextInput
                label="Company Social Media"
                value={company.companySocialMedia}
                onChangeText={text => setCompany({...company, companySocialMedia:text}, setValidationError({...validationError, companySocialMedia: false}))}
                style={styles.textInput}
              />
              <Text style={validationError.companySocialMedia ? styles.errorText : {display: 'none'}}>{errorMsg}</Text>

              <TextInput
                label="Point of Contact First Name"
                value={company.pointOfContactFirstName}
                onChangeText={text => setCompany({...company, pointOfContactFirstName:text}, setValidationError({...validationError, pointOfContactFirstName: false}))}
                style={styles.textInput}
              />
              <Text style={validationError.pointOfContactFirstName ? styles.errorText : {display: 'none'}}>{errorMsg}</Text>

              <TextInput
                label="Point of Contact Last Name"
                value={company.pointOfContactLastName}
                onChangeText={text => setCompany({...company, pointOfContactLastName:text}, setValidationError({...validationError, pointOfContactLastName: false}))}
                style={styles.textInput}
              />
              <Text style={validationError.pointOfContactLastName ? styles.errorText : {display: 'none'}}>{errorMsg}</Text>

              <TextInput
                label="Point of Contact Email"
                value={company.pointOfContactEmail}
                onChangeText={text => setCompany({...company, pointOfContactEmail:text}, setValidationError({...validationError, pointOfContactEmail: false}))}
                style={styles.textInput}
              />
              <Text style={validationError.pointOfContactEmail ? styles.errorText : {display: 'none'}}>{errorMsg}</Text>

              <TextInput
                label="Point of Contact Phone Number"
                value={company.pointOfContactPhoneNumber}
                onChangeText={text => setCompany({...company, pointOfContactPhoneNumber:text}, setValidationError({...validationError, pointOfContactPhoneNumber: false}))}
                style={{marginBottom: 20}}
              />
              <Text style={validationError.pointOfContactPhoneNumber ? styles.errorText : {display: 'none'}}>{errorMsg}</Text>

                
              <Divider bold style={styles.textInput} />
            </ScrollView>
          </KeyboardAvoidingView>
        }
      </View>


      {/* footer  */}
      <View style={styles.footerContainer}>
        {userType &&
          <View style={styles.submitContainer}>
            {editProfile &&
            <Button style={{marginRight: 10}} width={150} mode="contained" onPress={() => navigation.navigate('Home', {isExtra: isExtra, loggedIn: true})}>
                Go back
            </Button>
            }
            <Button mode="contained" width={150} onPress={userType == 'extra' ?  addExtra : addCompany}>
                {editProfile ? 'Edit' : 'Create'}
            </Button>
          </View>
        }
      </View>

    </View>
    }
    </>
  )
}

export default ProfileScreen

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1
  },
  headerContainer:{
    padding: 20,
    borderBottomColor: 'grey',
    borderBottomWidth: 1
  },
  contentContainer: {
    flex: 1
  },
  footerContainer: {
    padding: 40,
    borderTopColor: 'grey',
    borderTopWidth: 1,
    alignItems: 'center'
  },
  activityIndicatorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  headingText: {
    textAlign: 'center',
    marginBottom: 10
  },
  buttonContainer: {
    justifyContent: 'center',
    flexDirection: 'row',
  },
  button: {
    width: 150,
  },
  textInput: {
    marginBottom: 10
  },
  imageSelected: {
    marginVertical: 10
  },
  errorText: {
    color: 'crimson',
    fontWeight: 'bold',
    marginBottom: 10,
    marginTop: 6,
    textAlign: 'center',
  }, 
  submitContainer: {
    flexDirection: 'row',
  },
  photo: {
    height: '100%',
    resizeMode: 'cover',
    borderRadius: 20,
  },
})