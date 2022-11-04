import AsyncStorage from '@react-native-async-storage/async-storage'
import { Alert } from 'react-native';
import {collection, getDocs, query, where} from 'firebase/firestore'
import { db } from './firebase/firebase';
import { getAuth, onAuthStateChanged } from "firebase/auth";

export function validateEmail(email) {
    var re = /\S+@\S+\.\S+/;
    return re.test(email);
}

export function validateSocial(url) {
    var re = /^(ftp|http|https):\/\/[^ "]+$/;
    return re.test(url);
}

export function validatePhoneNumber(phoneNumber) {
    var re = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;
    return re.test(phoneNumber);
}

  //not currently used
export function checkPwd(str) {
    if (str.length < 6) {
        return("too_short");
    } else if (str.length > 50) {
        return("too_long");
    } else if (str.search(/\d/) == -1) {
        return("no_num");
    } else if (str.search(/[a-zA-Z]/) == -1) {
        return("no_letter");
    } else if (str.search(/[^a-zA-Z0-9\!\@\#\$\%\^\&\*\(\)\_\+]/) != -1) {
        return("bad_char");
    }
    return("ok");
}

export const setAsyncStorage = async (tag, userForAsync) => {
    console.log(`tag => ${tag}, userForAsync => ${userForAsync}`)
    try {
        await AsyncStorage.setItem(tag, userForAsync)
      } catch(e) {
        console.log('setAsyncStorage error', e)
      }
}

export const getAsyncStorage = async (tag) => {
    try {
        const jsonValue = await AsyncStorage.getItem(tag)
        console.log('return in getAsyncStorage', jsonValue != null ? JSON.parse(jsonValue) : null)
        return jsonValue != null ? JSON.parse(jsonValue) : null
    } catch(e) {
        console.log('getAsyncStorage error', e)
    }
      
}

export const getExtras = async () => {
    let temp = [];
    try{
        let snapshot = await getDocs(collection(db, 'extras'))
        snapshot.forEach((doc) => {
            temp.push(doc.data())
        })
    }
    catch(error){
        Alert.alert(error)
    }
    return temp
}

export const getJobs = async () => {
    let temp = [];
    try{
        let snapshot = await getDocs(collection(db, 'jobs'))
        if(snapshot){
            snapshot.forEach((doc) => {
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
    return temp
}

export const getUserStatus = async () => {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
        if (user) {
            console.log('user', user)
            return user.uid;
        } else {
            return false
        }
    });
}

export const getUserFromDB = async (uid) => {
    console.log('uid', uid)
    let userFromDB
    const q = query(collection(db, 'extras'), where('uid', '==', uid))
    const querySnapshot = await getDocs(q)
    querySnapshot.forEach((doc) => {
        userFromDB = doc.data()
    });
    console.log('userFromDB', userFromDB)

    if(userFromDB){
        let returnedJobs = await getJobs()
        return {user: userFromDB, jobs: returnedJobs}
    }
    else{
        //user is company
        let companyFromDB;
        const q = query(collection(db, 'companies'), where('uid', '==', uid));
        const snapshot = await getDocs(q);
        snapshot.forEach((doc) => {
            companyFromDB = doc.data();
        });
        console.log('companyFromDB', companyFromDB);

        if(companyFromDB){
            let returnedExtras = await getExtras()
            return {user: companyFromDB, extras: returnedExtras}
        }
        else{
            // likely no company or extra found for this email.  add functionality to create profile if get here.
            Alert.alert('Something went wrong')
            return
        }
    }
}

