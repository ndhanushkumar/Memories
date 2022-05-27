import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getAuth} from "firebase/auth";
import { getFirestore } from "firebase/firestore/lite";


const firebaseConfig = {
  apiKey: "AIzaSyDhLss12BUYP6AGNJHwY9qsuu7U5eW2Ls4",
  authDomain: "instagram-reactjs-clon.firebaseapp.com",
  projectId: "instagram-reactjs-clon",
  storageBucket: "instagram-reactjs-clon.appspot.com",
  messagingSenderId: "6465173877",
  appId: "1:6465173877:web:79604c29c73cbb983c3b3c"
};
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

  export{db,auth,storage,app};