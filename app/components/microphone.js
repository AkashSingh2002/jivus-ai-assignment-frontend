"use client";
import React, { useContext } from "react";
import AudioTranscription from "./audioTranscription";
import { AppContext } from "./appContext";

const Microphone = () => {
  const {showTranscription, setShowTranscription} = useContext(AppContext);

  return (
    <div className="bg-blue-50 text-gray-900 min-h-screen flex flex-col">
      {/* Main content section */}
      <main className="flex-grow text-center m-16 p-10">
        {!showTranscription ? (
          <>
          <h1 className="text-4xl font-semibold mb-4">Welcome to MyApp</h1>
            <p>
              Ready to explore? Click the button below to begin your journey
              with MyApp. It's easy and quick.
            </p>
            <button
              onClick={() => setShowTranscription(true)}
              type="button"
              className="text-blue-700 hover:text-white border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 mt-8 dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:hover:bg-blue-500 dark:focus:ring-blue-800"
            >
              Get Started
            </button>
          </>
        ) : (
          <AudioTranscription />
        )}
      </main>
    </div>
  );
};


export default Microphone;
