import { useContext, useState } from 'react';
import bg from '../assets/authBg.png'
import {IoEye, IoEyeOff} from 'react-icons/io5'
import { useNavigate } from 'react-router-dom';
import { userDataContext } from '../context/UserContext';
import axios from 'axios';

function SignUp() {

const [showPassword, setShowPassword] = useState(false);
const {serverUrl, userData, setUserData}=useContext(userDataContext)
const navigate= useNavigate()
const [name, setName] = useState('');
const [email, setEmail] = useState('');
const [password, setPassword] = useState('');
const [err, setErr] = useState('');
const [loading, setLoading] = useState(false);

  
const handleSignUp=async(e)=>{
  e.preventDefault();
  setErr('')
  setLoading(true)
  navigate('/customize')
  try {
    let result=await axios.post(`${serverUrl}/api/auth/signup`,{
      name,email,password
    }, {withCredentials:true
    })
    setUserData(result.data);
    setLoading(false)
  } catch (error) {
    console.log(error);
    setUserData(null);
    setLoading(false)
    setErr(error.response.data.message) 
  }
}

  return (

    <div className='w-[full] h-[100vh] bg-cover flex justify-center
     items-center' style={{backgroundImage:`url(${bg})`}} >

<form className='w-[90%] h-[700px] max-w-[600px] bg-[#00000069] backdrop-blur
shadow-lg shadow-black flex flex-col
 justify-center items-center gap-[20px] px-[20px] '
 onSubmit={handleSignUp} >

<h1 className='text-white text-[30px] font-semibold mb-[30px]'>Register to 
  <span className='text-cyan-400'> Virtual Assistant</span>
</h1>

 <input type="text" placeholder='Enter Your Name' className='w-full h-[60px] outline-none
 border-2 border-white bg-transparent
  text-white placeholder-gray-300 px-[20px] py-[10px] 
  rounded-full text-[18px]  '
  required onChange={(e)=>setName(e.target.value)
  }value={name } />

 <input type="email" placeholder='Enter Your Email' className='w-full h-[60px] outline-none
 border-2 border-white bg-transparent
  text-white placeholder-gray-300 px-[20px] py-[10px] 
  rounded-full text-[18px]' 
  required onChange={(e)=>setEmail(e.target.value)
  }value={email }  />

  <div
   className='w-full h-[60px] border-2 border-white bg-transparent
  text-white rounded-full text-[18px] relative'>
    <input type={showPassword?"text":"password"} placeholder='Enter Your Password'
     className='w-full h-full placeholder-gray-300 px-[20px] py-[10px] 
  rounded-full bg-transparent outline-none ' 
  required onChange={(e)=>setPassword(e.target.value)
  }value={password }/>

  {!showPassword && <IoEye className='absolute top-[18px] right-[30px]
  w-[25px] h-[25px] text-white cursor-pointer' onClick={()=> setShowPassword(true)}/> }
  { showPassword && <IoEyeOff className='absolute top-[18px] right-[30px]
  w-[25px] h-[25px] text-white cursor-pointer' onClick={()=> setShowPassword(false)}/> }
  </div>

{err.length>0 && <p className='text-red-500 text-[17px]  '>
  *{err}
  </p>}

<button className='min-w-[150px] h-[60px] mt-[30px] bg-white 
rounded-full font-semibold text-black text-[19px]'
disabled={loading}>{loading ?"loading...":"Sign Up"}</button>

<p className='text-white text-[18px]  '>
  Already have an account ?
  <span className='text-blue-400 cursor-pointer' 
  onClick={()=> navigate('/signin')}> Sign in</span>
  </p>

</form>
    </div>
  )
}

export default SignUp