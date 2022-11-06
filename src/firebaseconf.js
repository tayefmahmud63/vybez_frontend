import { initializeApp } from "firebase/app";
import {getAuth} from 'firebase/auth'
import {getStorage} from 'firebase/storage'
const firebaseConfig = {
  apiKey: "AIzaSyBAjcuveCY5bkikDNEWf7naQciNV5M3x0g",
  authDomain: "vibez-d769b.firebaseapp.com",
  databaseURL: "https://vibez-d769b-default-rtdb.firebaseio.com",
  projectId: "vibez-d769b",
  storageBucket: "vibez-d769b.appspot.com",
  messagingSenderId: "607638068572",
  appId: "1:607638068572:web:611957bed3f18abd3c7599"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app)
const storage = getStorage(app)

export default app
export {auth,storage}