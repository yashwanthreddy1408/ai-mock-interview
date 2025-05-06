import { Link } from 'react-router-dom'

const LogoContainer = () => {
  return (
    <Link to={"/"}>
        <h2 className='min-w-10 min-h-10 flex items-center text-2xl font-semibold'>Mock<span className='text-blue-500'>AI</span></h2>
    </Link>
  )
}

export default LogoContainer