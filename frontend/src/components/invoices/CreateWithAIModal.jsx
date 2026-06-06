import { useState, useRef, useEffect } from "react";
import { Sparkles, Mic, MicOff, Type, X } from "lucide-react";
import Button from "../ui/Button";
import TextareaField from "../ui/TextareaField";
import axiosInstance from "../../utils/axiosinstance";
import { API_PATHS } from "../../utils/apiPaths";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;
const isSpeechSupported = !!SpeechRecognition;

const MODES = { TEXT: "text", SPEECH: "speech" };

const CreateWithAIModal = ({ isOpen, onClose }) => {
  const navigate = useNavigate();

  const [mode, setMode] = useState(MODES.TEXT);
  const [text, setText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [interimText, setInterimText] = useState("");

  // Refs so event handlers always have the latest values
  const recognitionRef = useRef(null);
  const isListeningRef = useRef(false); // tracks USER intent (did they click stop?)
  const transcriptRef = useRef(""); // latest committed transcript

  // Keep transcriptRef in sync with state
  useEffect(() => {
    transcriptRef.current = transcript;
  }, [transcript]);

  // Stop when modal closes
  useEffect(() => {
    if (!isOpen) hardStop();
  }, [isOpen]);

  // Cleanup on unmount
  useEffect(() => {
    return () => hardStop();
  }, []);

  // ── Recognition ─────────────────────────────────────────

  const createRecognition = () => {
    if (!isSpeechSupported) return null;

    const recognition = new SpeechRecognition();
    recognition.continuous = true; // don't stop on short pauses
    recognition.interimResults = true; // show words as they're spoken
    recognition.lang = "en-US";
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setIsListening(true);
      isListeningRef.current = true;
    };

    recognition.onresult = (event) => {
      let interim = "";
      let final = transcriptRef.current;

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) {
          final += result[0].transcript + " ";
        } else {
          interim += result[0].transcript;
        }
      }

      transcriptRef.current = final;
      setTranscript(final);
      setInterimText(interim);
    };

    recognition.onerror = (event) => {
      // These are expected during auto-restart — ignore them
      if (event.error === "no-speech" || event.error === "aborted") return;
      toast.error(`Microphone error: ${event.error}`);
      hardStop();
    };

    recognition.onend = () => {
      setInterimText("");
      // Auto-restart if user hasn't clicked stop
      if (isListeningRef.current) {
        try {
          const next = createRecognition();
          recognitionRef.current = next;
          next?.start();
        } catch {
          // already started — ignore
        }
      } else {
        setIsListening(false);
      }
    };

    return recognition;
  };

  // Fully stop — sets intent flag so onEnd doesn't restart
  const hardStop = () => {
    isListeningRef.current = false;
    recognitionRef.current?.stop();
    recognitionRef.current = null;
    setIsListening(false);
    setInterimText("");
  };

  const startListening = () => {
    if (!isSpeechSupported) {
      toast.error(
        "Speech recognition isn't supported in your browser. Please use Chrome.",
      );
      return;
    }
    isListeningRef.current = true;
    const recognition = createRecognition();
    recognitionRef.current = recognition;
    try {
      recognition.start();
    } catch {
      toast.error("Could not access microphone. Please try again.");
      hardStop();
    }
  };

  const toggleListening = () => {
    isListening ? hardStop() : startListening();
  };

  const clearSpeech = () => {
    hardStop();
    setTranscript("");
    transcriptRef.current = "";
    setInterimText("");
  };

  // ── Generate ─────────────────────────────────────────────

  const activeText = mode === MODES.TEXT ? text : transcript;

  const handleGenerate = async () => {
    if (!activeText.trim()) {
      toast.error(
        mode === MODES.TEXT
          ? "Please enter some text to generate an invoice."
          : "Please record some speech first.",
      );
      return;
    }

    setIsLoading(true);
    try {
      const response = await axiosInstance.post(
        API_PATHS.AI.PARSE_INVOICE_TEXT,
        { text: activeText },
      );
      toast.success("Invoice generated successfully!");
      onClose();
      navigate("/invoices/new", { state: { aiData: response.data } });
    } catch (error) {
      console.error("Error generating invoice:", error);
      toast.error("Failed to generate invoice. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleModeSwitch = (newMode) => {
    hardStop();
    setMode(newMode);
  };

  // ── Render ───────────────────────────────────────────────

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4">
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-black/30 transition-opacity"
          onClick={onClose}
        />

        {/* Modal */}
        <div className="bg-white rounded-xl shadow-xl max-w-lg w-full p-6 relative text-left z-10">
          {/* Header */}
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-lg font-semibold flex items-center gap-2 text-slate-900">
              <Sparkles className="w-5 h-5 text-blue-600" />
              Create Invoice with AI
            </h3>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Mode Switcher */}
          <div className="flex gap-2 mb-5 p-1 bg-slate-100 rounded-lg w-fit">
            <button
              onClick={() => handleModeSwitch(MODES.TEXT)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                mode === MODES.TEXT
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              <Type className="w-4 h-4" />
              Type
            </button>
            <button
              onClick={() => handleModeSwitch(MODES.SPEECH)}
              disabled={!isSpeechSupported}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all disabled:opacity-40 disabled:cursor-not-allowed ${
                mode === MODES.SPEECH
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              <Mic className="w-4 h-4" />
              Speak
              {!isSpeechSupported && (
                <span className="text-xs text-slate-400 ml-1">
                  (not supported)
                </span>
              )}
            </button>
          </div>

          {/* Description */}
          <p className="text-sm text-slate-500 mb-4">
            {mode === MODES.TEXT
              ? "Describe your invoice in plain text — client name, items, quantities, and prices. The AI will extract and fill the form for you."
              : "Click the microphone and speak naturally. Pause as long as you need — recording continues until you click stop."}
          </p>

          {/* TEXT MODE */}
          {mode === MODES.TEXT && (
            <TextareaField
              name="invoiceText"
              label="Invoice details"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="e.g. 'Invoice for ClientCorp: 2 hours of web development at $50/hour, 3 hours of design at $40/hour'"
              rows={7}
            />
          )}

          {/* SPEECH MODE */}
          {mode === MODES.SPEECH && (
            <div className="space-y-3">
              {/* Mic button */}
              <div className="flex flex-col items-center justify-center py-4 gap-3">
                <button
                  onClick={toggleListening}
                  className={`w-16 h-16 rounded-full flex items-center justify-center transition-all shadow-md ${
                    isListening
                      ? "bg-red-500 hover:bg-red-600 animate-pulse"
                      : "bg-blue-600 hover:bg-blue-700"
                  }`}
                >
                  {isListening ? (
                    <MicOff className="w-7 h-7 text-white" />
                  ) : (
                    <Mic className="w-7 h-7 text-white" />
                  )}
                </button>

                <p className="text-sm text-slate-500">
                  {isListening ? (
                    <span className="text-red-500 font-medium">
                      Recording — click to stop
                    </span>
                  ) : transcript ? (
                    "Click to continue recording"
                  ) : (
                    "Click the mic to start speaking"
                  )}
                </p>

                {/* Animated dots while recording */}
                {isListening && (
                  <div className="flex items-center gap-1.5">
                    {[0, 150, 300].map((delay) => (
                      <span
                        key={delay}
                        className="w-1.5 h-1.5 bg-red-500 rounded-full animate-bounce"
                        style={{ animationDelay: `${delay}ms` }}
                      />
                    ))}
                    <span className="text-xs text-red-500 ml-1">Live</span>
                  </div>
                )}
              </div>

              {/* Transcript display */}
              <div className="min-h-[120px] max-h-[200px] overflow-y-auto p-3 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 leading-relaxed">
                {transcript || interimText ? (
                  <>
                    <span>{transcript}</span>
                    {interimText && (
                      <span className="text-slate-400 italic">
                        {interimText}
                      </span>
                    )}
                  </>
                ) : (
                  <span className="text-slate-400 italic">
                    Your speech will appear here...
                  </span>
                )}
              </div>

              {/* Word count + clear */}
              {transcript && (
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-400">
                    {transcript.trim().split(/\s+/).filter(Boolean).length}{" "}
                    words recorded
                  </span>
                  <button
                    onClick={clearSpeech}
                    className="text-xs text-slate-400 hover:text-red-500 transition-colors"
                  >
                    Clear
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-3 mt-6">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm text-slate-600 hover:text-slate-900 transition-colors"
            >
              Cancel
            </button>
            <Button
              onClick={handleGenerate}
              disabled={isLoading || !activeText.trim()}
            >
              {isLoading ? "Generating..." : "Generate Invoice"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateWithAIModal;
