import { useContext } from "react"
import { userDataContext } from "../context/UserContext"

function Card({image}) {
    const{serverUrl, userData, setUserData, 
   backendImage, setBackendImage, frontendImage, setFrontendImage,
  selectedImage, setSelectedImage} = useContext(userDataContext)
  
  return (
    <div className={`w-[60px] h-[120px] lg:w-[150px] lg:h-[250px]
 bg-[#020220] border-2 border-[#0000ff66] 
rounded-2xl overflow-hidden hover:border-4 hover:border-[#ffffff]  
hover:shadow-2xl hover:shadow-blue-950
 cursor-pointer ${selectedImage==image ? "border-4 border-[#ffffff] shadow-2xl shadow-blue-950" : ""}`} 
onClick={()=>{
  setBackendImage(null)
  setFrontendImage(null)
  setSelectedImage(image)}}  >
<img src={image} className=" h-full object-cover  " />
    </div>
  )
}

export default Card