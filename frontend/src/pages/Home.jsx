import { useContext, useEffect, useRef, useState } from "react"
import { userDataContext } from "../context/UserContext"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import { CgMenuRight } from 'react-icons/cg'
import { RxCross1 } from 'react-icons/rx'
import aiImg from "../assets/ai.gif"
import userImg from "../assets/user.gif"

function Home() {
  const { userData, serverUrl, setUserData, getGeminiResponse } = useContext(userDataContext)
  const navigate = useNavigate()

  const [listening, setListening] = useState(false)
  const [userText, setUserText] = useState("")
  const [aiText, setAiText] = useState("")
  const [ham, setHam] = useState(false)

  const isSpeakingRef = useRef(false)
  const isRecognizingRef = useRef(false)
  const recognitionRef = useRef(null)
  const synth = window.speechSynthesis


  const handleLogOut = async () => {
    try {
      const result = await axios.get(`${serverUrl}/api/auth/logout`, {
        withCredentials: true
      })
      console.log(result.data)
      setUserData(null)
      navigate("/signin")
    } catch (error) {
      console.log(error)
      setUserData(null)
    }
  }


  const startRecognition = () => {
    if (!isSpeakingRef.current && isRecognizingRef.current) {
      try {
        recognitionRef.current?.start()
        console.log("Recognition requested to start")
      } catch (error) {
        if (error.name !== "InvalidStateError") {
          console.error("Start error", error)
        }
      }
    }
  }


  const speak = (text) => {
    const utterence = new SpeechSynthesisUtterance(text)
    utterence.lang = 'hi-IN'

    const voices = window.speechSynthesis.getVoices()
    const hindiVoice = voices.find(v => v.lang === 'hi-IN')
    if (hindiVoice) utterence.voice = hindiVoice

    isSpeakingRef.current = true
    utterence.onend = () => {
      setAiText("")
      isSpeakingRef.current = false
      setTimeout(() => startRecognition(), 800)
    }
    synth.cancel()
    synth.speak(utterence)
  }


  const handleCommand = (data) => {
    const { type, userInput, response } = data
    speak(response)

    if (type === 'google_search')
      window.open(`https://www.google.com/search?q=${encodeURIComponent(userInput)}`, '_blank')

    if (type === 'youtube_play' || type === 'youtube_search')
      window.open(`https://www.youtube.com/results?search_query=${encodeURIComponent(userInput)}`, '_blank')

    if (type === 'calculator_open')
      window.open(`https://www.online-calculator.com/full-screen-calculator/`, '_blank')

    if (type === 'instagram_open')
      window.open(`https://www.instagram.com/`, '_blank')

    if (type === 'facebook_open')
      window.open(`https://www.facebook.com/`, '_blank')

    if (type === 'weather_show')
      window.open(`https://www.weather.com/`, '_blank')
  }


  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    const recognition = new SpeechRecognition()
    recognition.continuous = true
    recognition.lang = "en-US"
    recognition.interimResults = false

    recognitionRef.current = recognition
    let isMounted = true

    const startTimeout = setTimeout(() => {
      if (isMounted && !isSpeakingRef.current && !isRecognizingRef.current) {
        try {
          recognition.start()
          console.log("Recognition requested to start")
        } catch (e) {
          if (e.name !== "InvalidStateError") console.error(e)
        }
      }
    }, 1000)

    recognition.onstart = () => {
      isRecognizingRef.current = true
      setListening(true)
    }

    recognition.onend = () => {
      isRecognizingRef.current = false
      setListening(false)
      if (isMounted && !isSpeakingRef.current) {
        setTimeout(() => {
          if (isMounted) {
            try {
              recognition.start()
              console.log("Recognition restarted")
            } catch (e) {
              if (e.name !== "InvalidStateError") console.error(e)
            }
          }
        }, 1000)
      }
    }

    recognition.onerror = (event) => {
      console.warn("Recognition error", event.error)
      isRecognizingRef.current = false
      setListening(false)
      if (event.error !== "aborted" && isMounted && !isSpeakingRef.current) {
        setTimeout(() => {
          if (isMounted) {
            try {
              recognition.start()
              console.log("Recognition restarted after error")
            } catch (e) {
              if (e.name !== "InvalidStateError") console.error(e)
            }
          }
        }, 1000)
      }
    }

    recognition.onresult = async (e) => {
      const transcript = e.results[e.results.length - 1][0].transcript.trim()
      if (transcript.toLowerCase().includes(userData.assistantName.toLowerCase())) {
        setAiText("")
        setUserText(transcript)
        recognition.stop()
        isRecognizingRef.current = false
        setListening(false)
        const data = await getGeminiResponse(transcript)
        if (data) handleCommand(data)
        setAiText(data.response)
        setUserText("")
      }
    }

    const greeting = new SpeechSynthesisUtterance(`Hello ${userData.name}, 
      what can i help you with?`);
    greeting.lang = 'hi-IN';
    window.speechSynthesis.speak(greeting)



    return () => {
      recognition.stop()
      clearTimeout(startTimeout)
      recognition.stop()
      setListening(false)
      isRecognizingRef.current = false
    }
  }, [])



  return (
    <div className="w-full h-[100vh] bg-gradient-to-t
     from-[black] to-[#02023d] 
     flex justify-center overflow-hidden
     items-center flex-col gap-[15px]">

      <CgMenuRight className="lg:hidden 
 text-white absolute top-[20px] right-[20px] 
 w-[25px] h-[25px] "
        onClick={() => setHam(true)} />

      <div className={`absolute lg:hidden top-0 w-full h-full 
     bg-[#00000053] backdrop-blur-lg p-[20px] flex
     flex-col gap-[20px] items-start ${ham ? "translate-x-0" :
          "translate-x-full"} transition-transform  `}  >

        <RxCross1 className=" text-white absolute
         top-[20px] right-[20px]  w-[25px] h-[25px] "
          onClick={() => setHam(false)} />

        <button className='min-w-[150px] h-[60px]  bg-white 
rounded-full font-semibold text-black  text-[19px] cursor-pointer top-[20px] 
right-[20px]' onClick={handleLogOut} >
          Log Out
        </button>

        <button className='min-w-[150px] h-[60px]  bg-white 
rounded-full font-semibold text-black  text-[19px]   
top-[100px] right-[20px] px-[20px] py-[10px] cursor-pointer'
          onClick={() => navigate("/customize")}>
          Customize Your Assistant
        </button>

        <div className="w-full h-[2px] bg-gray-400 "></div>
        <h1 className="text-white font-semibold 
text-[19px] ">History</h1>

        <div className="w-full h-[400px] overflow-y-auto 
 flex flex-col gap-[20px] ">
          {userData.history?.map((his) => (
            <span className="text-gray-200 text-x[12px] truncate
    " >{his}</span>
          ))}

        </div>

      </div>

      <button className='min-w-[150px] h-[60px] mt-[30px] bg-white 
rounded-full font-semibold text-black  hidden lg:block text-[19px] cursor-pointer absolute top-[20px] 
right-[20px]' onClick={handleLogOut} >
        Log Out
      </button>

      <button className='min-w-[150px] h-[60px] mt-[30px] bg-white 
rounded-full font-semibold text-black  hidden lg:block text-[19px] absolute  
top-[100px] right-[20px] px-[20px] py-[10px] cursor-pointer'
        onClick={() => navigate("/customize")}>
        Customize Your Assistant
      </button>

      <div className=" w-[300px] h-[400px] flex justify-center 
items-center overflow-hidden rounded-4xl shadow-lg ">
        <img src={userData?.assistantImage} className="h-full 
  object-cover" />
      </div>
      <h1 className="text-white text-[20px] font-semibold">
        I Am, {userData?.assistantName} Your AI Assistant
      </h1>

      {!aiText && <img src={userImg} alt="" className="
    w-[200px]" />}
      {aiText && <img src={aiImg} alt="" className="
    w-[200px]" />}

      <h1 className="text-white text-[10px] 
    font-light text-wrap ">{userText ? userText : aiText ? aiText : null}</h1>

    </div>
  )
}


export default Home