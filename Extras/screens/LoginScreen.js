import { SafeAreaView, KeyboardAvoidingView, StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native'
import React, {useEffect, useState} from 'react'
import {auth, db} from '../firebase/firebase'
import { useNavigation } from '@react-navigation/native'
import AsyncStorage from '@react-native-async-storage/async-storage';

const LoginScreen = () => {

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [errorMsg, setErrorMsg] = useState('')

    const navigation = useNavigation()

    useEffect(() => {
        // const unsubscribe = auth.onAuthStateChanged(user => {
        //     if(user){
        //         naviagation.replace("Home")
        //     }
        // })

        getExtras()
 
        // return unsubscribe
    }, [])

    const getExtras = async () => {
        db.collection("extras").get().then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                console.log(`doc.id: ${doc.id} => doc.data: ${doc.data()}`)
            })
        })
    }

    const handleSignUp = () => {
        auth
        .createUserWithEmailAndPassword(email, password)
        .then(userCredentials => {
            const user = userCredentials.user;
            console.log('Registered with: ', user)
            navigation.navigate("Register", {userEmail: user.email, userUID: user.uid})
        })
        .catch(error => {
            setErrorMsg(error.message)            
        })
    }

    const handleLogin = () => {
        auth
        .signInWithEmailAndPassword(email, password)
        .then(userCredentials => {
            const user = userCredentials.user;
            console.log('Logged in with: ', user.email)
            navigation.navigate("Home")
        })
        .catch(error => {
            setErrorMsg(error.message)
        })
    }

    return (
            <KeyboardAvoidingView
                style={styles.container}
                behavior="padding"
            >
                <View style={styles.inputContainer}>
                    <TextInput 
                        placeholder='Email'
                        value={email}
                        onChangeText={text => setEmail(text) }
                        style={styles.input}
                    />
                    <TextInput 
                        placeholder='Password'
                        value={password}
                        onChangeText={text => setPassword(text)}
                        style={styles.input}
                        secureTextEntry
                    />
                </View>

                <View style={styles.buttonContainer}>
                    <TouchableOpacity
                        onPress={handleLogin}
                        style={styles.button}
                    >
                        <Text style={styles.buttonText}>Login</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={handleSignUp}
                        style={[styles.button, styles.buttonOutline]}
                    >
                        <Text style={styles.buttonOutlineText}>Register</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.errorContainer}>
                    <Text style={styles.errorText}>{errorMsg}</Text>
                </View>
            </KeyboardAvoidingView>
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
        backgroundColor: 'white',
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderRadius: 10,
        marginTop: 5,
    },
    buttonContainer: {
        width: '60%',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 40,
    },
    button: {
        backgroundColor: '#0782f9',
        width: '100%',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
    },
    buttonText: {
        color: 'white',
        fontWeight: '700',
        fontSize: 16,
    },
    buttonOutline: {
        backgroundColor: 'white',
        marginTop: 5,
        borderColor: '#0782f9',
        borderWidth: 2,
    },
    buttonOutlineText:{
        color: '#0782f9',
        fontWeight: '700',
        fontSize: 16,
    },
    errorContainer: {
        width: '80%',
        marginTop: 10,
    },
    errorText: {
        color: 'red',
        width: '100%',
        fontSize: 16,
        fontWeight: 'bold',
    }
})