import { SignUp } from '@clerk/clerk-react'

const SignUpPage = () => {
  return (
    <div>
      <SignUp path='/signup' signInUrl='/signin' />
    </div>
  )
}

export default SignUpPage