import {StyleSheet, Text, View } from 'react-native'
import React, {useState} from 'react'
import {auth} from '../firebase/firebase'
import { useNavigation } from '@react-navigation/native'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Appbar, TextInput, Button } from 'react-native-paper';

const LoginScreen = () => {

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [errorMsg, setErrorMsg] = useState('')
    const [hidePassword, setHidePassword] = useState(true)

    const navigation = useNavigation()

    // useEffect(() => {
    //     getExtras()
    // }, [])

    // const getExtras = async () => {
    //     db.collection("extras").get().then((querySnapshot) => {
    //         querySnapshot.forEach((doc) => {
    //             console.log(`doc.id: ${doc.id} => doc.data: ${doc.data()}`)
    //         })
    //     })
    // }

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
            // navigation.navigate("Home")   uncomment when done setting up registration
            navigation.navigate("Register", {userEmail: user.email, userUID: user.uid})
        })
        .catch(error => {
            setErrorMsg(error.message)
        })
    }

    return (
        <>
            <Appbar.Header>
                    <Appbar.Content title="Extras" />
                </Appbar.Header>
            <View style={styles.container}>
                <View style={styles.inputContainer}>
                    <TextInput
                        label="Email"
                        value={email}
                        onChangeText={text => setEmail(text)}
                        style={{marginBottom: 10}}
                    />
                    <TextInput
                        label="Password"
                        value={password}
                        onChangeText={text => setPassword(text)}
                        secureTextEntry={hidePassword}
                        right={<TextInput.Icon icon={hidePassword ? "eye" : "eye-off"} onPress={() => setHidePassword(!hidePassword)} />}
                    />
                </View>

                <View style={styles.buttonContainer}>
                    <Button style={{marginRight: 10}} mode="contained" onPress={handleLogin}>
                        Login
                    </Button>
                    <Button mode="contained" onPress={handleSignUp}>
                        Register
                    </Button>
                </View>

                <View style={styles.errorContainer}>
                    <Text style={styles.errorText}>{errorMsg}</Text>
                </View>
            </View>
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
        color: 'red',
        width: '100%',
        fontSize: 16,
        fontWeight: 'bold',
    }
})