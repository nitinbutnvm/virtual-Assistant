import Card from "../components/Card"
import image1 from "../assets/image1.png/"
import image2 from "../assets/image2.jpg"
import image3 from "../assets/image4.png"
import image4 from "../assets/image5.png"
import image5 from "../assets/image7.jpeg"
import image6 from "../assets/authBg.png"
import image7 from "../assets/imagezoe.jpg"
import {RiImageAddLine} from "react-icons/ri"
import { useContext, useRef,  } from "react"
import { userDataContext } from "../context/UserContext"
import { useNavigate } from "react-router-dom"
import { MdKeyboardBackspace } from "react-icons/md"

function Customize() {
  const{serverUrl, userData, setUserData, 
   backendImage, setBackendImage, frontendImage, setFrontendImage,
  selectedImage, setSelectedImage} = useContext(userDataContext)
  
  const inputImage=useRef()
  const navigate=useNavigate()

  const handleImage=(e)=>{
    const file=e.target.files[0];
    setBackendImage(file)
    setFrontendImage(URL.createObjectURL(file))
  }    



  
  return (
    <div className="w-full h-[100vh] bg-gradient-to-t
     from-[black] to-[#030353] 
     flex justify-center 
     items-center flex-col p-[20px] ">
      <MdKeyboardBackspace className="absolute top-[30px] 
      left-[30px] w-[25px] h-[25px] cursor-pointer text-white 
      " onClick={()=>navigate("/")} />

<h1 className="text-white lg:text-[30px]
 text-[20px] mb-[40px] text-center ">
  Select Your <span className="text-blue-200
  ">
 Assistant Image
    </span>
</h1>

<div className="w-full max-w-[900px]
 flex justify-center items-center flex-wrap gap-[15px] ">
  
<Card image={image6} />
<Card image={image7} />
<Card image={image1} />
<Card image={image3} />
<Card image={image2} />
<Card image={image4} />
<Card image={image5} />

<div className={`w-[60px] h-[120px] lg:w-[150px] lg:h-[250px]
     bg-[#020220] border-2 border-[#0000ff66] 
     rounded-2xl overflow-hidden hover:border-4 hover:border-white  
     hover:shadow-2xl hover:shadow-blue-950
     cursor-pointer flex items-center justify-center
     ${selectedImage=="input" ? "border-4 border-white shadow-2xl shadow-blue-950" : "null"}`}
     onClick={()=>{
      inputImage.current.click()
      setSelectedImage("input")
     }} >
{!frontendImage && <RiImageAddLine className="text-white
 w-[30px] h-[25px] " />}
{frontendImage && <img src={frontendImage} className=" h-full object-cover  " />}
</div>

<input type="file" accept="image/*" 
ref={inputImage} hidden onChange={handleImage} />

</div>
{selectedImage && 
<button className='min-w-[150px] h-[60px] mt-[30px] bg-white 
rounded-full font-semibold text-black text-[19px] cursor-pointer'
onClick={()=>navigate("/customize2")} >
  Next
</button>}

    </div>
  )
}

export default Customize