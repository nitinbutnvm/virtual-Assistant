import { useContext } from "react"
import { userDataContext } from "../context/UserContext"
import { useState } from "react"
import axios from "axios"
import { MdKeyboardBackspace,  } from "react-icons/md"
import { useNavigate } from "react-router-dom"


function Customize2() {
    const {userData, backendImage,selectedImage,serverUrl, setUserData}=
    useContext(userDataContext)

    const [assistantName, setAssistantName]=
    useState(userData?.assistantName || "" )
    const navigate= useNavigate()

    const [loading, setLoading]=useState(false)

    const handleUpdateAssistant=()=>{
      setLoading(true)
    try {
        let formData=new FormData()
        formData.append("assistantName", assistantName)
        if(backendImage){
            formData.append("assistantImage", backendImage)
         } else{
            formData.append("imageUrl", selectedImage)
         }
        const result = axios.post(`${serverUrl}/api/user/update`
        , formData, {
            withCredentials: true}  )
            setLoading(false)
            console.log(result.data);
            setUserData(result.data)
            navigate("/")

    } catch (error) {
        setLoading(false)
        console.log(error);
        
    }
    
    }

  return (
    <div className="w-full h-[100vh] bg-gradient-to-t
     from-[black] to-[#030353] 
     flex justify-center 
     items-center flex-col p-[20px] relative ">
      <MdKeyboardBackspace className="absolute top-[30px] 
      left-[30px] w-[25px] h-[25px] cursor-pointer text-white 
      " onClick={()=>navigate("/customize")} />

<h1 className="text-white lg:text-[30px]
 text-[20px] mb-[40px] text-center ">
Enter Your <span className="text-blue-200"> 
Assistant Name
</span>
</h1>
 <input type="text" placeholder='eg: zoe'
  className='w-full max-w-[600px] h-[60px] outline-none
 border-2 border-white bg-transparent
  text-white placeholder-gray-300 px-[20px] py-[10px] 
  rounded-full text-[18px]' 
  required onChange={(e)=>setAssistantName(e.target.value)} 
  value={assistantName}/>

{assistantName && 
<button className='min-w-[300px] h-[60px] mt-[30px] bg-white 
rounded-full font-semibold text-black text-[19px] cursor-pointer'
  disabled={loading}
onClick={()=>{
     handleUpdateAssistant()
    }
     }  >
{!loading?" Now, Create Your Assistant":"loading..."}
</button>}
  
    </div>
  )
}

export default Customize2