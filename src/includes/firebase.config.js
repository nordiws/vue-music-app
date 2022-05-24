import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/storage';

const firebaseConfig = {
  apiKey: 'AIzaSyDu3SPpOXkMWVL4Dn_sLWbvsNv0NQCbjCI',
  authDomain: 'music-app-51216.firebaseapp.com',
  projectId: 'music-app-51216',
  storageBucket: 'music-app-51216.appspot.com',
  messagingSenderId: '1055396803182',
  appId: '1:1055396803182:web:17c8fa5534dfe2fa756c7f',
  measurementId: 'G-Q72ZMH8GH0',
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const db = firebase.firestore();
const storage = firebase.storage();

db.enablePersistence().catch((error) => console.log(`Firebase persistance error: ${error}`));
const userCollection = db.collection('users');
const songsCollection = db.collection('songs');
const commentsCollection = db.collection('comments');

export {
  auth,
  db,
  storage,
  userCollection,
  songsCollection,
  commentsCollection,
};
