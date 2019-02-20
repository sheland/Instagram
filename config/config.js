import firebase from 'firebase'

const config = {
   apiKey: "AIzaSyBqVB11GqpLwEeQt0XsF_0DUy0z3CEyV-I",
   authDomain: "photo-feed-990cc.firebaseapp.com",
   databaseURL: "https://photo-feed-990cc.firebaseio.com",
   projectId: "photo-feed-990cc",
   storageBucket: "photo-feed-990cc.appspot.com",
   messagingSenderId: "392139565231"
 };
 firebase.initializeApp(config);

 //connect each parts of firebase features to variables for us to use throughout our application
 export const f = firebase;
 export const database = firebase.database();
 export const auth = firebase.auth();
 export const storage = firebase.storage();
