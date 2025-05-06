import LoaderPage from "@/routes/LoaderPage";
import { useAuth } from "@clerk/clerk-react"
import React from "react"
import { Navigate } from "react-router-dom";

const ProtectedRoutes = ({children}: {children: React.ReactNode}) => {

    const {isLoaded, isSignedIn} = useAuth();

    if(!isLoaded) {
        return <LoaderPage />
    }

    if(!isSignedIn) {
        return <Navigate to={"/signin"} replace />
    }

  return children
}

export default ProtectedRoutes