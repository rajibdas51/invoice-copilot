import { useState, useRef, useEffect } from "react";
import { Sparkles, Mic, MicOff, Type, X } from "lucide-react";
import Button from "../ui/Button";
import TextareaField from "../ui/TextareaField";
import axiosInstance from "../../utils/axiosinstance";
import { API_PATHS } from "../../utils/apiPaths";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

// Check browser support once at module level
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

  const recognitionRef = useRef(null);

  // Cleanup on unmount or close
  useEffect(() => {
    return () => stopListening();
  }, []);

  useEffect(() => {
    if (!isOpen) stopListening();
  }, [isOpen]);

  // ── Speech Recognition ────────────────────────────────────

  const startListening = () => {
    if (!isSpeechSupported) {
      toast.error(
        "Speech recognition is not supported in your browser. Try Chrome.",
      );
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onstart = () => setIsListening(true);

    recognition.onresult = (event) => {
      let interim = "";
      let final = transcript; // build on existing transcript

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) {
          final += result[0].transcript + " ";
        } else {
          interim += result[0].transcript;
        }
      }

      setTranscript(final);
      setInterimText(interim);
    };

    recognition.onerror = (event) => {
      if (event.error !== "aborted") {
        toast.error(`Microphone error: ${event.error}`);
      }
      setIsListening(false);
      setInterimText("");
    };

    recognition.onend = () => {
      setIsListening(false);
      setInterimText("");
    };

    recognitionRef.current = recognition;
    recognition.start();
  };

  const stopListening = () => {
    recognitionRef.current?.stop();
    recognitionRef.current = null;
    setIsListening(false);
    setInterimText("");
  };

  const toggleListening = () => {
    isListening ? stopListening() : startListening();
  };

  const clearSpeech = () => {
    stopListening();
    setTranscript("");
    setInterimText("");
  };

  // The text we actually send to AI — either typed or spoken
  const activeText = mode === MODES.TEXT ? text : transcript;

  // ── Generate Invoice ──────────────────────────────────────

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
    stopListening();
    setMode(newMode);
  };

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
                <span className="text-xs text-slate-400">(not supported)</span>
              )}
            </button>
          </div>

          {/* Description */}
          <p className="text-sm text-slate-500 mb-4">
            {mode === MODES.TEXT
              ? "Describe your invoice in plain text — client name, items, quantities, and prices. The AI will extract and fill the form for you."
              : "Click the microphone and speak your invoice details. The AI will extract and fill the form for you."}
          </p>

          {/* ── TEXT MODE ── */}
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

          {/* ── SPEECH MODE ── */}
          {mode === MODES.SPEECH && (
            <div className="space-y-3">
              {/* Mic Button */}
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
                      Listening... click to stop
                    </span>
                  ) : transcript ? (
                    "Click to continue recording"
                  ) : (
                    "Click the mic to start speaking"
                  )}
                </p>
              </div>

              {/* Transcript Display */}
              <div className="relative min-h-[120px] max-h-[180px] overflow-y-auto p-3 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 leading-relaxed">
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

              {/* Clear button */}
              {transcript && (
                <button
                  onClick={clearSpeech}
                  className="text-xs text-slate-400 hover:text-red-500 transition-colors"
                >
                  Clear transcript
                </button>
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
