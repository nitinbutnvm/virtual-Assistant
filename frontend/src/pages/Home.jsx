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
    if (hindiVoice) {
      utterence.voice= hindiVoice
    }

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
    const { type, userInput, response } = data;
    speak(response)

     let url = null;

    if (type === 'google_search')
      window.open(`https://www.google.com/search?q=${encodeURIComponent(userInput)}`, '_blank')

    if (type === 'youtube_play' || type === 'youtube_search')
      window.open(`https://www.youtube.com/results?search_query=${encodeURIComponent(userInput)}&autoplay=1`, '_blank')

    if (type === 'calculator_open')
      window.open(`https://www.online-calculator.com/full-screen-calculator/`, '_blank')

    if (type === 'instagram_open')
      window.open(`https://www.instagram.com/`, '_blank')

    if (type === 'facebook_open')
      window.open(`https://www.facebook.com/`, '_blank')

    if (type === 'weather_show')
      window.open(`https://www.weather.com/`, '_blank')

    if (url) {
    // try opening a new tab first
    const newWindow = window.open("", "_blank");
    if (newWindow) {
      newWindow.location.href = url;
    } else {
      console.warn("Popup blocked! Allow popups for this site.");
    }
  }
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
  <div className="w-full min-h-screen bg-gradient-to-t from-black to-[#02023d] 
    flex flex-col items-center justify-center gap-6 px-4 py-6 relative overflow-hidden">

    {/* Mobile hamburger */}
    <CgMenuRight
      className="lg:hidden text-white absolute top-5 right-5 w-7 h-7 cursor-pointer"
      onClick={() => setHam(true)}
    />

    {/* Mobile sidebar menu */}
    <div
  className={`absolute lg:hidden top-0 left-0 w-full h-full bg-[#00000080] 
  backdrop-blur-lg p-5 flex flex-col gap-5 items-start transform 
  ${ham ? "translate-x-0" : "translate-x-full"} transition-transform`}
>
  <RxCross1
    className="text-white absolute top-3 right-3 w-7 h-7 cursor-pointer z-50"
    onClick={() => setHam(false)}
  />

  <button
    className="w-full py-3 bg-white rounded-full font-semibold text-black text-base cursor-pointer mt-12"
    onClick={handleLogOut}
  >
    Log Out
  </button>

  <button
    className="w-full py-3 bg-white rounded-full font-semibold text-black text-base cursor-pointer"
    onClick={() => navigate("/customize")}
  >
    Customize Your Assistant
  </button>

  <div className="w-full h-[1px] bg-gray-400"></div>
  <h1 className="text-white font-semibold text-lg">History</h1>

  <div className="w-full h-[300px] overflow-y-auto flex flex-col gap-3">
    {userData.history?.map((his, i) => (
      <span key={i} className="text-gray-200 text-sm truncate">{his}</span>
    ))}
  </div>
</div>

    {/* Desktop buttons */}
    <div className="hidden lg:flex flex-col gap-4 absolute top-5 right-5">
      <button
        className="px-6 py-3 bg-white rounded-full font-semibold text-black text-lg cursor-pointer"
        onClick={handleLogOut}
      >
        Log Out
      </button>

      <button
        className="px-6 py-3 bg-white rounded-full font-semibold text-black text-lg cursor-pointer"
        onClick={() => navigate("/customize")}
      >
        Customize Your Assistant
      </button>
    </div>

    {/* Assistant Image */}
    <div className="w-48 sm:w-60 lg:w-72 h-64 sm:h-80 lg:h-96 
      flex justify-center items-center overflow-hidden rounded-2xl shadow-lg">
      <img src={userData?.assistantImage} className="w-full h-full object-cover" />
    </div>

    {/* Assistant Name */}
    <h1 className="text-white text-lg sm:text-xl lg:text-2xl font-semibold text-center">
      I Am, {userData?.assistantName} Your AI Assistant
    </h1>

    {/* Assistant or User Avatar */}
    {!aiText ? (
      <img src={userImg} alt="" className="w-32 sm:w-40" />
    ) : (
      <img src={aiImg} alt="" className="w-32 sm:w-40" />
    )}

    {/* Chat Text */}
    <h1 className="text-white text-sm sm:text-base font-light text-center max-w-[90%] break-words">
      {userText ? userText : aiText ? aiText : null}
    </h1>
  </div>
);

}


export default Home