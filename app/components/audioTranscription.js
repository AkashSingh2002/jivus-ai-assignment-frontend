"use client"
import React ,{ useState, useRef, useEffect } from "react";
import axios from "axios";

const audioTranscription = () => {

  const [isRecording, setIsRecording] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [audioURL, setAudioURL] = useState(null);
  const [transcription, setTranscription] = useState("No transcription available yet.");
  const mediaRecorderRef = useRef(null);
  const audioChunks = useRef([]);

  // Handle recording toggle
  const handleToggleRecording = async () => {
    if (!isRecording) {
      // Start recording
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaRecorderRef.current = new MediaRecorder(stream);
        audioChunks.current = [];

        mediaRecorderRef.current.ondataavailable = (event) => {
          if (event.data.size > 0) {
            audioChunks.current.push(event.data);
          }
        };

        mediaRecorderRef.current.onstop = () => {
          const blob = new Blob(audioChunks.current, { type: "audio/webm" });
          const url = URL.createObjectURL(blob);
          setAudioURL(url);
          handleTranscription(blob); // Call transcription function
        };

        mediaRecorderRef.current.start();
        setIsRecording(true);
      } catch (error) {
        console.error("Error accessing microphone:", error);
      }
    } else {
      // Stop recording
      mediaRecorderRef.current?.stop();
      setIsRecording(false);
    }
  };

// Handle transcription using Textgram API
const handleTranscription = async (audioBlob) => {
  const formData = new FormData();
  formData.append("audio", audioBlob);

  try {
    const response = await axios.post("https://api.deepgram.ai/v1/transcribe", formData, {
      headers: {
        "Authorization": `API_KEY`, // Replace with your Textgram API key
        "Content-Type": "multipart/form-data",
      },
    });

    if (response.data && response.data.transcription) {
      setTranscription(response.data.transcription);
    } else {
      setTranscription("Failed to retrieve transcription.");
    }
  } catch (error) {
    console.error("Error with transcription API:", error);
    setTranscription("An error occurred while transcribing.");
  }
};

  useEffect(() => {
    let timer;
    if (isRecording) {
      timer = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      clearInterval(timer);
      setSeconds(0); // Reset timer when recording stops
    }
    return () => clearInterval(timer);
  }, [isRecording]);

  // Format time in MM:SS
  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Audio Transcription</h2>
      <p>This is the audio transcription section. Start using the microphone!</p>

      <div className="flex flex-col justify-center items-center mb-6">
        <button onClick={handleToggleRecording} className="w-16 mt-8 h-16">
          {!isRecording ? (
            <svg
              viewBox="0 0 256 256"
              xmlns="http://www.w3.org/2000/svg"
              className="w-full h-full text-gray-900"
            >
              <rect fill="none" height="256" width="256" />
              <path d="M128,176a48,48,0,0,0,48-48V64a48,48,0,0,0-96,0v64A48,48,0,0,0,128,176Z" />
              <path d="M200.4,128.1a8,8,0,0,0-8.8,7,64,64,0,0,1-127.2,0,8,8,0,0,0-8.8-7,7.9,7.9,0,0,0-7.1,8.8A79.7,79.7,0,0,0,120,207.3V232a8,8,0,0,0,16,0V207.3a79.7,79.7,0,0,0,71.5-70.4A7.9,7.9,0,0,0,200.4,128.1Z" />
            </svg>

          ) : (<>
            <div className="flex flex-col justify-center items-center">
              <div className="text-2xl text-red-600 font-bold mb-2">
                {formatTime(seconds)}
              </div>
              <div className="w-8 h-8 bg-red-500 rounded-full animate-pulse"></div>
              <span className="ml-2 text-red-600 font-semibold">Recording...</span>
            </div>

          </>
          )}
        </button>

        <p className="mt-8 text-lg font-medium text-gray-700">
          {!isRecording ? <button onClick={handleToggleRecording} type="button" class="text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Start Recording</button>
            : <button onClick={handleToggleRecording} type="button" class="text-white bg-red-700 hover:bg-red-800 focus:outline-none focus:ring-4 focus:ring-red-300 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2 mt-4 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900">Stop Recording</button>
          }
        </p>
      </div>

      {audioURL && (
        <div className="mt-4">
          <h3 className="text-lg font-medium">Recorded Audio:</h3>
          <audio controls src={audioURL}></audio>
        </div>
      )}

      <div className="mt-4">
        <h3 className="text-lg font-medium">Transcription:</h3>
        <p className="text-gray-700">{transcription}</p>
      </div>

    </div>
  );
};


export default audioTranscription;