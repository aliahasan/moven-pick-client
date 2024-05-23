import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
const firebaseConfig = {
  apiKey: import.meta.env.VITE_apiKey,
  authDomain: import.meta.env.VITE_authDomain,
  projectId: import.meta.env.VITE_projectId,
  storageBucket: import.meta.env.VITE_storageBucket,
  messagingSenderId: import.meta.env.VITE_messagingSenderId,
  appId: import.meta.env.VITE_appId,
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

// const firebaseConfig = {
//   apiKey: "AIzaSyBEoMuBDSEvap3PPoVtHGxK-jDRA9WjPgU",
//   authDomain: "stay-vista-466ad.firebaseapp.com",
//   projectId: "stay-vista-466ad",
//   storageBucket: "stay-vista-466ad.appspot.com",
//   messagingSenderId: "545889033934",
//   appId: "1:545889033934:web:a4814807450d431edb7a9f",
// };
