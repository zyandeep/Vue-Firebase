import * as firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCfUIPm3RpfkXeiSAzBjcYnDxTfNvLu7DI",
  authDomain: "fir-test-7e6b5.firebaseapp.com",
  databaseURL: "https://fir-test-7e6b5.firebaseio.com",
  projectId: "fir-test-7e6b5",
  storageBucket: "fir-test-7e6b5.appspot.com",
  messagingSenderId: "444520296501",
  appId: "1:444520296501:web:d11be3ce39cf1833b0c17c",
  measurementId: "G-DQHJECSZHD"
};

// If Firebase SDK not initialise, then initialise it 
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export default {
  db: () => {
    return firebase.firestore();
  },
  auth: () => {
    return firebase.auth();
  }
}
