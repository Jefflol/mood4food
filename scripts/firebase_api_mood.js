// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
var firebaseConfig = {
    apiKey: "AIzaSyBJ5nLpyV68LUM4xbT1RGwMBcYf5rs6ymo",
    authDomain: "mood4food-a276a.firebaseapp.com",
    databaseURL: "https://mood4food-a276a.firebaseio.com",
    projectId: "mood4food-a276a",
    storageBucket: "mood4food-a276a.appspot.com",
    messagingSenderId: "874144676555",
    appId: "1:874144676555:web:c8acd832296b23df2ef94e"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const db = firebase.firestore();