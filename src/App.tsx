import { BrowserRouter, Route, Routes } from "react-router-dom"


import PublicLayout from "./layouts/PublicLayout"
import Home from "./routes/Home"


import AuthLayout from "./layouts/AuthLayout"
import SignInPage from "./routes/SignIn"
import SignUpPage from "./routes/SignUp"
import ProtectedRoutes from "./layouts/ProtectedRoutes"
import MainLayout from "./layouts/MainLayout"
import Dashboard from "./routes/Dashboard"
import Generate from "./routes/Generate"
import CreateEditPage from "./routes/CreateEditPage"
import MockLoadPage from "./routes/MockLoadPage"
import { MockInterviewPage } from "./routes/MockInterviewPage"
import { Feedback } from "./routes/Feedback"
// import { Button } from "./components/ui/button"

const App = () => {
  return (
    <BrowserRouter>
      <Routes>

        {/* public routes */}
        <Route element={<PublicLayout />}>
          <Route index element={<Home />} />
        </Route>



        {/* auth layout */}
        <Route element={<AuthLayout />}>
          <Route path="/signin/*" element={<SignInPage />} />
          <Route path="/signup/*" element={<SignUpPage />} />
        </Route>
  

        {/* protected routes */}
        <Route element={<ProtectedRoutes><MainLayout /></ProtectedRoutes>}>
          <Route element={<Generate />} path="/generate">
            <Route element={<Dashboard />} index />
            <Route path=":interviewId" element={<CreateEditPage />} />
            <Route path="interview/:interviewId" element={<MockLoadPage />} />
            <Route
              path="interview/:interviewId/start"
              element={<MockInterviewPage />}
            />
            <Route path="feedback/:interviewId" element={<Feedback />} />
          </Route>
        </Route>

      </Routes>
    </BrowserRouter>
  )
}

export default App