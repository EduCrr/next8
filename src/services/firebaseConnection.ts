import firebase from "firebase/app";
import "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCGhFs4csNjept5WwC_gpv_i7s45zMLjek",
  authDomain: "board-51477.firebaseapp.com",
  projectId: "board-51477",
  storageBucket: "board-51477.appspot.com",
  messagingSenderId: "460926458575",
  appId: "1:460926458575:web:d82350655931970eadb5ba",
  measurementId: "G-YG2KD2TMV7",
};

// Initialize Firebase
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export default firebase;
