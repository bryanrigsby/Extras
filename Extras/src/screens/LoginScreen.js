import {StyleSheet, Text, View, Alert } from 'react-native'
import React, {useState, useContext} from 'react'
import {getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword} from 'firebase/auth'
import { Appbar, TextInput, Button, ActivityIndicator, MD2Colors } from 'react-native-paper'
import { Context } from '../context/Context'
import { validateEmail, getExtras, getJobs, getUserFromDB } from '../util'

const LoginScreen = ({navigation, route}) => {

    const { user, setUser } = useContext(Context)
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
            console.log('userCredentials', userCredentials)
            navigation.navigate("Profile", {loggedIn: true, editProfile: false, newUser: {uid: userCredentials.user.uid, email: userCredentials.user.email}})
        })
        .catch(error => {
            setIsLoading(false) 
            setErrorMsg('Email already in use')
            Alert.alert(`Email already in use`, '', [
                { text: 'Try again', onPress: ()=>{}},
                { text: 'Login', onPress: handleLogin }
            ])    
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
            if(!user){
                setUser(result.user)
            }
            console.log('result', result)
            let isExtra = !!result.user.firstName
            console.log('isExtra in login', isExtra)
            navigation.navigate('Home', {isExtra: isExtra, loggedIn: true})
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

    const handleSkip = () => {
        Alert.alert(`What are you looking for?`, '', [
            { text: 'Extra', onPress: async ()=> {navigation.navigate('Home', {isExtra: false, loggedIn: false})}},
            { text: 'Job', onPress: async () => {navigation.navigate('Home', {isExtra: true, loggedIn: false})} }
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
                        <Button style={{marginRight: 10}} mode="contained" onPress={handleSignUp}>
                            Register
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