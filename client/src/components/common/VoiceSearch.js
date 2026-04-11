import React, { useState, useEffect } from 'react';
import { Mic, MicOff, Sparkles, X } from 'lucide-react';

export default function VoiceSearch({ onSearch }) {
    const [isListening, setIsListening] = useState(false);
    const [transcript, setTranscript] = useState("");
    const [supported, setSupported] = useState(true);

    useEffect(() => {
        if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
            setSupported(false);
        }
    }, []);

    const startListening = () => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) return;

        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-US';

        recognition.onstart = () => {
            setIsListening(true);
            setTranscript("Listening...");
        };

        recognition.onresult = (event) => {
            const current = event.resultIndex;
            const text = event.results[current][0].transcript;
            setTranscript(text);
            onSearch(text);
            setTimeout(() => {
                setIsListening(false);
                setTranscript("");
            }, 2000);
        };

        recognition.onerror = (event) => {
            console.error("Speech recognition error", event.error);
            setIsListening(false);
            setTranscript("Error. Try again.");
            setTimeout(() => setTranscript(""), 2000);
        };

        recognition.onend = () => {
            setIsListening(false);
        };

        recognition.start();
    };

    if (!supported) return null;

    return (
        <div className="relative flex items-center">
            <button
                onClick={startListening}
                className={`p-2.5 rounded-lg border transition-all flex items-center justify-center gap-2 ${
                    isListening 
                    ? "bg-red-500 border-red-500 text-white animate-pulse" 
                    : "bg-white dark:bg-gray-900 border-gray-100 dark:border-gray-800 text-gray-400 hover:text-primary-600 shadow-sm"
                }`}
                title="Search with Voice"
            >
                {isListening ? <Mic className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                {isListening && <span className="text-[10px] font-black uppercase tracking-widest">Listening...</span>}
            </button>

            {transcript && isListening && (
                <div className="absolute top-14 left-0 right-0 z-[1000] w-64 bg-gray-900 dark:bg-white text-white dark:text-black p-4 rounded-2xl shadow-2xl animate-in fade-in slide-in-from-top-2 duration-300">
                    <div className="flex items-center gap-2 mb-2">
                        <Sparkles className="w-3.5 h-3.5 text-orange-400" />
                        <span className="text-[10px] font-black uppercase tracking-widest opacity-50">Voice Input</span>
                    </div>
                    <p className="text-sm font-bold italic">"{transcript}"</p>
                </div>
            )}
        </div>
    );
}
