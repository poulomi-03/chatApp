// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { getAuth } from "firebase/auth";
import { getFirestore, doc, setDoc, collection, query, where, getDocs } from "firebase/firestore";
import { toast } from "react-toastify";

const firebaseConfig = {
  apiKey: "AIzaSyAkFgbQYo14f9lKZCz2WkOHhrsGO2ZPCyQ",
  authDomain: "chatapp-gs-abb5a.firebaseapp.com",
  projectId: "chatapp-gs-abb5a",
  storageBucket: "chatapp-gs-abb5a.appspot.com",
  messagingSenderId: "391916403613",
  appId: "1:391916403613:web:f8b7ceaed75a16d1798d74",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const signup = async (username, email, password) => {
  try {
    const res = await createUserWithEmailAndPassword(auth, email, password);
    const user = res.user;
    await setDoc(doc(db, "users", user.uid), {
      id: user.uid,
      username: username.toLowerCase(),
      email,
      name: "",
      avatar: "",
      bio: "Hey , I am using the chat app",
      lastSeen: Date.now(),
    });
    console.log("User document written to Firestore");
    await setDoc(doc(db, "chats", user.uid), {
      chatData: [],
    });
    console.log("Chat document written to Firestore");
    toast.success("User signed up successfully!");
  } catch (error) {
    console.error(error);
    // toast.error(error.code);
    toast.error(error.code.split("/")[1].split("-").join(" "));
  }
};

const login = async (email, password) => {
  try {
    await signInWithEmailAndPassword(auth, email, password);
  } catch (error) {
    console.error(error);
    toast.error(error.code.split("/")[1].split("-").join(" "));
  }
};

const logout = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error(error);
    toast.error(error.code.split("/")[1].split("-").join(" "));
  }
};

const resetPass=async(email)=>{
  if(!email){
    toast.error("Enter your email");
    return null;
  }
  try {
    const userRef=collection(db,'users');
    const q=query(userRef,where("email","==",email));
    const querySnap=await getDocs(q);
    if(!querySnap.empty){
      await sendPasswordResetEmail(auth,email);
      toast.success("Reset email sent");
    }
    else{
      toast.error("Email doesn't exists");
    }
  } catch (error) {
    console.log(error);
    toast.error(error.message);
  }
}


export { signup, login, logout, auth, db,resetPass };
