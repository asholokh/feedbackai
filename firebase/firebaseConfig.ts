import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "",
    authDomain: "feedbackai-230ef.firebaseapp.com",
    projectId: "feedbackai-230ef",
    storageBucket: "feedbackai-230ef.firebasestorage.app",
    messagingSenderId: "552972462322",
    appId: "1:552972462322:web:135c3ec01e762b4173886b",
    measurementId: "G-WPL94PQCJ9"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);