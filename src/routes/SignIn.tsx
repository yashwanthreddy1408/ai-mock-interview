import { SignIn } from "@clerk/clerk-react"

const SignInPage = () => {
  return (
    <div>
      <SignIn path="/signin" signUpUrl="/signup" />
    </div>
  )
}

export default SignInPage