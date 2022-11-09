import { StyleSheet, View, Alert, KeyboardAvoidingView, ScrollView, Image } from 'react-native'
import React, {useState, useEffect, useContext} from 'react'
import { Appbar, TextInput, Button, Text, Divider, ActivityIndicator, MD2Colors } from 'react-native-paper'
import DropDown from "react-native-paper-dropdown"
import { Context } from '../context/Context'
import { collection, addDoc, doc, updateDoc } from 'firebase/firestore'
import { validateEmail, getJobs, getExtras, validateSocial, validatePhoneNumber } from '../util'
import { db } from '../firebase/firebase'

//form to add or edit jobs

const ManageJobsScreen = ({navigation, route}) => {

  const { user, setJobs } = useContext(Context)

  const setDropDownFunc = (type, value) => {
    console.log(`type: ${type}, value: ${value}`)
    switch (type) {
      case 'gender':
        setGender(value)
        break;
      default:
        break;
    }
    setValidationError({...validationError, [type]: false})
  }


  //Job state
  const [job, setJob] = useState({
    uid: user ? user.uid : null,
    email: user ? user.email : null,
    id: editJob ? route.params.selectedJob.id : null,
    companyID: user.ID,

  })

  //other state
  const [errorMsg, setErrorMsg] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  //validation state
  const [validationError, setValidationError] = useState({

    //job
    companyName: false,
    companySocialMedia: false,
    pointOfContactFirstName: false,
    pointOfContactLastName: false,
    pointOfContactEmail: false,
    pointOfContactPhoneNumber: false
  })

  useEffect(() => {
    console.log('getting into useEffect on ManageJobsScreen')
    
  }, [])

  const validateJob = () => {
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
    return true
  }

  const addJob = async() => {
    console.log('getting into addJob')
    try {
      let isValid = validateJob()
      if(!isValid){
          return
      }
      
      console.log('job validated successfully')

      setIsLoading(true)

      const jobObj = {
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

      console.log('jobObj to be saved', jobObj)

      if(editJob){
        const jobRef = doc(db, 'jobs', jobObj.id)
        await updateDoc(jobRef, jobObj)
      }
      else{
        const docRef = await addDoc(collection(db, 'jobs'), jobObj)
        const jobRef = doc(db, 'jobs', docRef.id)
        await updateDoc(jobRef, {
          id: docRef.id
        })
      }
      
      setIsLoading(false)

      Alert.alert(
        `Job has been ${editJob ? 'edited' : 'created'}.`,
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



  return (
    <>
    <Appbar.Header>
        <Appbar.Content title={editJob ? "Edit Job" : "Create Job"} />
    </Appbar.Header>
    {isLoading ?
    <View style={styles.activityIndicatorContainer}>
      <ActivityIndicator animating={isLoading} color={MD2Colors.purple400} size={'large'} />
    </View>
    :
    <View style={styles.mainContainer}>

      {/* header */}
      <View style={styles.headerContainer}>
        <Text variant={"headlineLarge"} style={styles.headingText}>{user ? user.email : 'Welcome'}</Text>
      </View>

      <View style={styles.contentContainer}>
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

              <Divider bold style={{marginBottom: 10}} />
              </ScrollView>
          </KeyboardAvoidingView>
      </View>


      {/* footer  */}
      <View style={styles.footerContainer}>
          <View style={styles.submitContainer}>
            <Button style={{marginRight: 10}} width={150} mode="contained" onPress={() => navigation.navigate('Home', {isExtra: false, loggedIn: true})}>
                Go back
            </Button>
            <Button mode="contained" width={150} onPress={addJob}>
                {editJob ? 'Edit' : 'Create'}
            </Button>
          </View>
      </View>

    </View>
    }
    </>
  )
}

export default ManageJobsScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
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