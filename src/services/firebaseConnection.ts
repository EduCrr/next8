import firebase from "firebase/app";
import "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyA3kB0FWGDTBwjf8HaUWlH9XSbccC6IYe0",
  authDomain: "board-228f7.firebaseapp.com",
  projectId: "board-228f7",
  storageBucket: "board-228f7.appspot.com",
  messagingSenderId: "419667728996",
  appId: "1:419667728996:web:daa038de1ac584fe7b1d71",
  measurementId: "G-XR7CN02228",
};

// Initialize Firebase
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export default firebase;
