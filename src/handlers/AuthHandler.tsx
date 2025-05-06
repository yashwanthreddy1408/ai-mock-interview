import { db } from "@/config/firebase.config";
import LoaderPage from "@/routes/LoaderPage";
import { User } from "@/types";
import { useAuth, useUser } from "@clerk/clerk-react";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";



const AuthHandler = () => {

    const { isSignedIn } = useAuth();
    const { user } = useUser();

    const pathName = useLocation().pathname
    const navigate = useNavigate();


    const [loading, setLoading] = useState(false);

    useEffect(() => {

        const storeUserData = async() => {

            // check if user is signed in or not
            // if yes then check if user data is already stored in firebase or not
            // if no then store the user data into firebase
            if(isSignedIn && user) {
                setLoading(true);
    
                try {
                    
                    const userSnap = await getDoc(doc(db, "Users", user.id));
                    if(!userSnap.exists()) {
                        const userData : User = {
                            id: user.id,
                            name: user.fullName || user.firstName || "Anonymous",
                            email: user.primaryEmailAddress?.emailAddress || "N/A",
                            imageUrl : user.imageUrl,
                            createdAt: serverTimestamp(),
                            updatedAt: serverTimestamp()
                        }

                        await setDoc(doc(db, "Users", user.id), userData);
                    }


                } catch (error) {
                    console.log('error on storing the user data : ', error)
                } finally {
                    setLoading(false);
                }
    
            }
        };

        storeUserData();

    }, [isSignedIn, user, pathName, navigate]);

    if(loading) {
        return <LoaderPage />
    }

  return null;
}

export default AuthHandler