import AsyncStorage from '@react-native-async-storage/async-storage'
import { Alert } from 'react-native';
import {collection, getDocs} from 'firebase/firestore'
import { db } from './firebase/firebase';

export function validateEmail(email) {
    var re = /\S+@\S+\.\S+/;
    return re.test(email);
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

export const setAsyncStorage = async (userForAsync) => {
    try {
        await AsyncStorage.setItem('@user', userForAsync)
      } catch(e) {
        console.log(e)
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

