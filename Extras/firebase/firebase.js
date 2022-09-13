import * as firebase from "firebase";
import 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDZrC_2aC9rwqG1GwFXNmzpL_rjvFYcZI4",
  authDomain: "extras-54574.firebaseapp.com",
  projectId: "extras-54574",
  storageBucket: "extras-54574.appspot.com",
  messagingSenderId: "250226240613",
  appId: "1:250226240613:web:65c7fa3a7606177797aa8c"
};

let app
if(firebase.apps.length === 0){
    app = firebase.initializeApp(firebaseConfig);
}  
else {
    app = firebase.app()
}

const auth = firebase.auth()
const db = firebase.firestore()

export {auth, db};
