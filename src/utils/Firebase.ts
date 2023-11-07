// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app"
import { getAnalytics } from "firebase/analytics"
import { getFirestore } from "firebase/firestore"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyAdD6SixauyIY3R7_tdFqoXqkRQHLYqbh8",
    authDomain: "saveplans-2a7da.firebaseapp.com",
    databaseURL: "https://saveplans-2a7da-default-rtdb.firebaseio.com",
    projectId: "saveplans-2a7da",
    storageBucket: "saveplans-2a7da.appspot.com",
    messagingSenderId: "862207276267",
    appId: "1:862207276267:web:28f969d46372afee707aae",
    measurementId: "G-NG9LF3EJ9T",
}

// Initialize Firebase
export const app = initializeApp(firebaseConfig)
const analytics = getAnalytics(app)

export const firestoreDB = getFirestore(app)
