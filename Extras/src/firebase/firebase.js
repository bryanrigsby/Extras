import {initializeApp} from 'firebase/app'
import {getFirestore} from 'firebase/firestore'
import {getAuth} from 'firebase/auth'
import {getStorage} from 'firebase/storage'

const firebaseConfig = {
  apiKey: "AIzaSyDZrC_2aC9rwqG1GwFXNmzpL_rjvFYcZI4",
  authDomain: "extras-54574.firebaseapp.com",
  projectId: "extras-54574",
  storageBucket: "extras-54574.appspot.com",
  messagingSenderId: "250226240613",
  appId: "1:250226240613:web:65c7fa3a7606177797aa8c"
};

const app = initializeApp(firebaseConfig);  
const db = getFirestore(app)
const auth = getAuth(app)
const storage = getStorage(app)

export {db, auth, storage}
