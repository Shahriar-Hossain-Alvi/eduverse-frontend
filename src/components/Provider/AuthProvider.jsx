import { createContext, useEffect, useState } from "react";
import PropTypes from 'prop-types';
import { createUserWithEmailAndPassword, getAuth, onAuthStateChanged, signInWithEmailAndPassword, signInWithPopup, signOut, updateProfile } from "firebase/auth";
import { GoogleAuthProvider } from "firebase/auth";
import app from "../firebase/firebase.config";
import axios from "axios";
import useAxiosPublic from "../Hooks/useAxiosPublic";


const auth = getAuth(app);
// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext(null);
const googleProvider = new GoogleAuthProvider();


const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const axiosPublic = useAxiosPublic();

    const createUser = (email, password) => {
        setLoading(true);
        return createUserWithEmailAndPassword(auth, email, password);
    }

    const signInUser = (email, password) => {
        setLoading(true);
        return signInWithEmailAndPassword(auth, email, password);
    }

    const googleSignIn = () => {
        setLoading(true);
        return signInWithPopup(auth, googleProvider);
    }

    const logout = () => {
        setLoading(true);
        return signOut(auth);
    }

    const updateUserProfile = (name, photo) => {
        return updateProfile(auth.currentUser, {
            displayName: name,
            photoURL: photo
        })
    }

    //save user
    const saveUser = async userInfo => {
        const data = await axios.post(
            'http://localhost:5000/users',
            userInfo
        )
        return data;
    }


    //observer
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, currentUser => {
            setUser(currentUser);
            console.log(currentUser);
            if (currentUser) {
                //get token from backend and store it in the local storage
                const userEmail = { email: currentUser?.email };
                axiosPublic.post("/jwt", userEmail)
                    .then(async (res) => {
                        if (res.data.token) {
                            localStorage.setItem("access-token", res.data.token);
                            setLoading(false);
                        }
                    })
            }
            else {
                localStorage.removeItem("access-token");
                setLoading(false);
            }
        });
        return () => unsubscribe();

    }, [axiosPublic, user]);


    const authInfo = {
        createUser,
        user,
        loading,
        googleSignIn,
        signInUser,
        logout,
        updateUserProfile,
        setLoading,
        saveUser
    }

    return (
        <AuthContext.Provider value={authInfo}>
            {children}
        </AuthContext.Provider>
    );
};

AuthProvider.propTypes = {
    children: PropTypes.node
}

export default AuthProvider;