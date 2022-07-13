import 'firebase/firestore';
import { getApps, initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyBiyp4gL-UVmh2epnqEYXoIm-KINfEUGVM",
    authDomain: "sistema-2ca6f.firebaseapp.com",
    projectId: "sistema-2ca6f",
    storageBucket: "sistema-2ca6f.appspot.com",
    messagingSenderId: "363443282482",
    appId: "1:363443282482:web:dfbff35abaebd07aac522b",
    measurementId: "G-2FS0P4FXH6"
  };
  

let db = '';

if (getApps().length < 1) {
  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  // Initialize Cloud Firestore and get a reference to the service
  db = getFirestore(app);
}
  export default db;