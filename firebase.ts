
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { initializeFirestore, persistentLocalCache, persistentMultipleTabManager } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyC10bf-hDV8RWtwPrf0D0-ADh3uu1uhOmk",
  authDomain: "jobmandu-np.firebaseapp.com",
  projectId: "jobmandu-np",
  storageBucket: "jobmandu-np.firebasestorage.app",
  messagingSenderId: "465307869201",
  appId: "1:465307869201:web:d88832b1ad49679d7151b0",
  measurementId: "G-P1Y3R28XWP"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

// अफलाइन र ढिलो इन्टरनेटमा पनि चल्ने गरी क्यास सेटिङ
export const db = initializeFirestore(app, {
  localCache: persistentLocalCache({ 
    tabManager: persistentMultipleTabManager() 
  })
});

export const googleProvider = new GoogleAuthProvider();
