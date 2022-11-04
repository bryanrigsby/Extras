import {StyleSheet, Text, View, Alert } from 'react-native'
import React, {useState, useContext, useEffect} from 'react'
import {db} from '../firebase/firebase'
import {collection, getDocs, query, where} from 'firebase/firestore'
import {getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword} from 'firebase/auth'
import { useNavigation } from '@react-navigation/native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Appbar, TextInput, Button, ActivityIndicator, MD2Colors } from 'react-native-paper'
import { Context } from '../context/Context'
import { validateEmail, getExtras, getJobs, getUserFromDB, setAsyncStorage } from '../util'

const LoginScreen = ({navigation, routes}) => {

    const { extras, setExtras, jobs, setJobs } = useContext(Context)
    const auth = getAuth()
 
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [errorMsg, setErrorMsg] = useState('')
    const [hidePassword, setHidePassword] = useState(true)
    const [isLoading, setIsLoading] = useState(false)

    const [validationError, setValidationError] = useState({
        email: false,
        password: false,
    })

    
      

    const validateForm = () => {
        if(!email || email.trim() === ''){
            setValidationError({...validationError, email: true})
            setErrorMsg('Email is required')
            return false
        }
        if(!validateEmail(email)){
            setValidationError({...validationError, email: true})
            setErrorMsg('Email is invalid')
            return false
        }
        if(!password || password.trim() === '' || password.length < 8){
            setValidationError({...validationError, password: true})
            setErrorMsg('Password must be at least 8 characters')
            return false
        }
        return true
    }



    const handleSignUp = () => {
        let isValid = validateForm()
        if(!isValid){
            return
        }
        setIsLoading(true)
        createUserWithEmailAndPassword(auth, email, password)
        .then(async userCredentials => {
            const signedUpUser = userCredentials.user;
            console.log('Registered with: ', signedUpUser.email)
            navigation.navigate("Profile", {userEmail: signedUpUser.email, userUID: signedUpUser.uid})
        })
        .catch(error => {
            setErrorMsg('Please try again')            
        })
    }

    const handleLogin = async () => {
        let isValid = validateForm()
        if(!isValid){
            return
        }
        setIsLoading(true)
        signInWithEmailAndPassword(auth, email, password)
        .then(async userCredentials => {
            const loggedInUser = userCredentials.user;
            console.log('Logged in with: ', loggedInUser)
            let result = await getUserFromDB(loggedInUser.uid)
            console.log('result', result)
            let isExtra = !!(result.user.firstName)
            const userForAsync = JSON.stringify({uid: loggedInUser.uid, isExtra: isExtra});
            await setAsyncStorage('@user', userForAsync)
            //set state of jobs or extra and pass isExtra based on return
            if(!isExtra){
                setExtras(result.extras)
                navigation.navigate('Home')
            }
            else{
                setJobs(result.jobs)
                navigation.navigate('Home')
            }
        })
        .catch(error => {
            console.log('error in catch', error)
            setIsLoading(false)
            setErrorMsg('User not found')
            Alert.alert(`Username or password not found`, '', [
                { text: 'Try again', onPress: ()=>{}},
                { text: 'Register', onPress: handleSignUp }
            ])
        })
    }

    const handleSetExtras = async () => {
        let returnedExtras = await getExtras()
        setExtras(returnedExtras)
    }

    const handleSetJobs = async () => {
        let returnedJobs = await getJobs()
        setJobs(returnedJobs)
    }

    const handleSkip = () => {
        Alert.alert(`What are you looking for?`, '', [
            { text: 'Extra', onPress: async ()=> {setIsLoading(true), await handleSetExtras(), setIsLoading(false), navigation.navigate('Home', {isExtra: false})}},
            { text: 'Job', onPress: async () => {setIsLoading(true), await handleSetJobs(), setIsLoading(false), navigation.navigate('Home', {isExtra: true})} }
        ])
    }



    return (
        <>
            <Appbar.Header>
                    <Appbar.Content title="Login" />
            </Appbar.Header>
            {isLoading ?
            <ActivityIndicator style={styles.container} animating={isLoading} color={MD2Colors.purple400} size={'large'} />
            :
            <View style={styles.container}>
                    <View style={styles.inputContainer}>
                        <TextInput
                            label="Email"
                            value={email}
                            onChangeText={text => {setEmail(text),setValidationError({...validationError, email: false, invalidEmail: false})}}
                            style={{marginBottom: 10}}
                        />
                        <Text style={validationError.email ? styles.errorText : {display: 'none'}}>{errorMsg}</Text>
                        <TextInput
                            label="Password"
                            value={password}
                            onChangeText={text => {setPassword(text),setValidationError({...validationError, password: false})}}
                            secureTextEntry={hidePassword}
                            right={<TextInput.Icon icon={hidePassword ? "eye" : "eye-off"} onPress={() => setHidePassword(!hidePassword)} />}
                            style={{marginBottom: 10}}
                        />
                        <Text style={validationError.password ? styles.errorText : {display: 'none'}}>{errorMsg}</Text>
                    </View>

                    <View style={styles.buttonContainer}>
                        <Button style={{marginRight: 10}} mode="contained" onPress={handleLogin}>
                            Login
                        </Button>
                        <Button mode="contained" onPress={handleSkip}>
                            Skip
                        </Button>
                    </View>

            </View>
            }
        </>
    )
}

export default LoginScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    inputContainer: {
        width: '80%',
    },
    input: {
        marginBottom: 5
    },
    buttonContainer: {
        flexDirection: 'row',
        marginTop: 20,
    },
    errorContainer: {
        width: '80%',
        marginTop: 10,
    },
    errorText: {
        textAlign: 'center',
        color: 'red',
        width: '100%',
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 10,
    }
})