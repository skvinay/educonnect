import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  AlertCircle,
  Bot,
  GraduationCap,
  Loader2,
  LogOut,
  Mic,
  MicOff,
  Send,
  Sparkles,
  User,
  Volume2,
  VolumeX,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import { GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";

import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { auth } from "@/lib/firebase";
import { useAuth } from "@/service/AuthContent";
import {
  chatWithCareerAI,
  type ChatMessage,
} from "@/services/aiCareerChatService";

type UiMessage = {
  role: "user" | "assistant";
  text: string;
};

interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionResultList {
  readonly length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
  readonly length: number;
  item(index: number): SpeechRecognitionAlternative;
  [index: number]: SpeechRecognitionAlternative;
  isFinal: boolean;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  onstart: (() => void) | null;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: { error?: string }) => void) | null;
  onend: (() => void) | null;
}

declare global {
  interface Window {
    webkitSpeechRecognition?: new () => SpeechRecognition;
    SpeechRecognition?: new () => SpeechRecognition;
  }
}

const starterMessage =
  "Hi! I’m Vidya, your AI career counsellor. Tell me your interests, favorite subjects, or career confusion, and I’ll guide you with the best options.";

const quickPrompts = [
  "I like Biology. What careers should I explore?",
  "Tell me the best options after 10th in India",
  "I enjoy computers and problem solving",
  "Compare Science, Commerce, and Arts for me",
];

const preferredVoiceHints = [
  "female",
  "woman",
  "google search",
  "neerja",
  "veena",
  "samantha",
  "karen",
  "moira",
  "zira",
  "en-in",
];

type ChatReply = {
  text: string;
  audio: string;
};

const AIChat = () => {
  const { user, loading } = useAuth() as { user: any; loading: boolean };
  const navigate = useNavigate();
  const [messages, setMessages] = useState<UiMessage[]>([
    { role: "assistant", text: starterMessage },
  ]);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([
    { role: "model", parts: [{ text: starterMessage }] },
  ]);
  const [input, setInput] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  const [error, setError] = useState("");
  const [liveTranscript, setLiveTranscript] = useState("");
  const [micStatus, setMicStatus] = useState<
    "idle" | "starting" | "recording" | "stopping"
  >("idle");
  const scrollRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const transcriptRef = useRef("");
  const audioContextRef = useRef<AudioContext | null>(null);

  const createRecognition = () => {
    const RecognitionClass =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!RecognitionClass) {
      setSpeechSupported(false);
      return null;
    }

    const recognition = new RecognitionClass();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-IN";

    recognition.onstart = () => {
      setIsRecording(true);
      setMicStatus("recording");
      setError("");
    };

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let combinedTranscript = "";

      for (let i = 0; i < event.results.length; i += 1) {
        combinedTranscript += event.results[i][0]?.transcript ?? "";
      }

      transcriptRef.current = combinedTranscript.trim();
      setLiveTranscript(transcriptRef.current);
      setInput(transcriptRef.current);
    };

    recognition.onerror = (event: { error?: string }) => {
      if (event.error !== "aborted") {
        setError(
          event.error
            ? `Voice input failed: ${event.error}. Please try again.`
            : "Voice input failed. Please try again or type your message."
        );
      }
      setIsRecording(false);
      setMicStatus("idle");
    };

    recognition.onend = () => {
      setIsRecording(false);
      setMicStatus("idle");
    };

    return recognition;
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isThinking]);

  useEffect(() => {
    const recognition = createRecognition();
    if (!recognition) {
      setSpeechSupported(false);
      return;
    }

    setSpeechSupported(true);
    recognitionRef.current = recognition;

    return () => {
      recognition.stop();
      recognitionRef.current = null;
      window.speechSynthesis?.cancel();
    };
  }, []);

  const lastAssistantMessage = useMemo(
    () =>
      [...messages].reverse().find((message) => message.role === "assistant")
        ?.text ?? starterMessage,
    [messages]
  );

  const handleLogin = async () => {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
  };

  const handleLogout = async () => {
    window.speechSynthesis?.cancel();
    recognitionRef.current?.stop();
    await signOut(auth);
  };

  const speakText = (text: string) => {
    if (
      isMuted ||
      typeof window === "undefined" ||
      !("speechSynthesis" in window)
    ) {
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(
      text.replace(/[#*_`>-]/g, " ")
    );
    utterance.lang = "en-IN";

    const availableVoices = window.speechSynthesis.getVoices();
    const rankedVoice =
      availableVoices.find((voice) => {
        const haystack = `${voice.name} ${voice.lang}`.toLowerCase();
        return (
          (voice.lang.toLowerCase().includes("en-in") ||
            voice.lang.toLowerCase().includes("en-gb") ||
            voice.lang.toLowerCase().includes("en-au") ||
            voice.lang.toLowerCase().includes("en")) &&
          preferredVoiceHints.some((hint) => haystack.includes(hint))
        );
      }) ||
      availableVoices.find((voice) =>
        voice.lang.toLowerCase().includes("en-in")
      ) ||
      availableVoices.find((voice) =>
        voice.lang.toLowerCase().includes("en-gb")
      ) ||
      availableVoices.find((voice) =>
        voice.lang.toLowerCase().startsWith("en")
      );

    if (rankedVoice) {
      utterance.voice = rankedVoice;
      utterance.lang = rankedVoice.lang;
    }

    utterance.rate = 0.92;
    utterance.pitch = 1.08;
    utterance.volume = 1;
    window.speechSynthesis.speak(utterance);
  };

  const playGeminiAudio = async (base64Audio: string, fallbackText: string) => {
    if (!base64Audio || isMuted) return;

    try {
      const pcmData = Uint8Array.from(atob(base64Audio), (c) =>
        c.charCodeAt(0)
      );

      const sampleRate = 24000;
      const numChannels = 1;
      const bitsPerSample = 16;
      const byteRate = (sampleRate * numChannels * bitsPerSample) / 8;
      const blockAlign = (numChannels * bitsPerSample) / 8;
      const dataSize = pcmData.byteLength;
      const wavBuffer = new ArrayBuffer(44 + dataSize);
      const view = new DataView(wavBuffer);

      const writeStr = (offset: number, str: string) =>
        [...str].forEach((c, i) => view.setUint8(offset + i, c.charCodeAt(0)));

      writeStr(0, "RIFF");
      view.setUint32(4, 36 + dataSize, true);
      writeStr(8, "WAVE");
      writeStr(12, "fmt ");
      view.setUint32(16, 16, true);
      view.setUint16(20, 1, true);
      view.setUint16(22, numChannels, true);
      view.setUint32(24, sampleRate, true);
      view.setUint32(28, byteRate, true);
      view.setUint16(32, blockAlign, true);
      view.setUint16(34, bitsPerSample, true);
      writeStr(36, "data");
      view.setUint32(40, dataSize, true);
      new Uint8Array(wavBuffer, 44).set(pcmData);

      if (!audioContextRef.current) {
        audioContextRef.current = new AudioContext();
      }
      const ctx = audioContextRef.current;
      if (ctx.state === "suspended") await ctx.resume();

      const decoded = await ctx.decodeAudioData(wavBuffer);

      const source = ctx.createBufferSource();
      source.buffer = decoded;
      source.connect(ctx.destination);
      source.start(0);
    } catch (err) {
      console.error("Audio playback error:", err);
      speakText(fallbackText);
    }
  };

  const handleToggleMute = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);

    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }

    const ctx = audioContextRef.current;
    if (!ctx) return;

    if (nextMuted && ctx.state === "running") {
      void ctx.suspend();
    } else if (!nextMuted && ctx.state === "suspended") {
      void ctx.resume();
    }
  };

  const startRecording = () => {
    if (!speechSupported) {
      setError("Speech recognition is not supported in this browser.");
      return;
    }

    if (!user) {
      setError("Please sign in with Google to use voice interaction.");
      return;
    }

    try {
      if (isRecording || micStatus === "starting") return;

      if (!recognitionRef.current) {
        recognitionRef.current = createRecognition();
      }

      if (!recognitionRef.current) {
        setError("Speech recognition is not supported in this browser.");
        return;
      }

      transcriptRef.current = input;
      setLiveTranscript(input);
      setError("");
      setMicStatus("starting");
      recognitionRef.current.start();
    } catch {
      setIsRecording(false);
      setMicStatus("idle");
      setError("Could not start voice input. Please try again.");
    }
  };

  const stopRecording = async (shouldSend = true) => {
    if (!recognitionRef.current || !isRecording) return;

    recognitionRef.current.stop();
    setIsRecording(false);
    setMicStatus("stopping");

    const finalTranscript = transcriptRef.current.trim();
    setLiveTranscript("");

    if (shouldSend && finalTranscript) {
      setInput(finalTranscript);
      await sendMessage(finalTranscript);
      transcriptRef.current = "";
    }
  };

  const sendMessage = async (value?: string) => {
    if (!audioContextRef.current) {
      audioContextRef.current = new AudioContext();
    }
    if (audioContextRef.current.state === "suspended") {
      await audioContextRef.current.resume();
    }

    if (!user) {
      setError("Please sign in with Google to use the AI career chat.");
      return;
    }

    const text = (value ?? input).trim();
    if (!text || isThinking) return;

    const nextUserMessage: UiMessage = { role: "user", text };
    const updatedHistory: ChatMessage[] = [
      ...chatHistory,
      { role: "user" as const, parts: [{ text }] },
    ].slice(-24);

    setMessages((prev) => [...prev, nextUserMessage]);
    setChatHistory(updatedHistory);
    setInput("");
    setLiveTranscript("");
    transcriptRef.current = "";
    setError("");
    setIsThinking(true);

    try {
      const token =
        typeof user?.getIdToken === "function" ? await user.getIdToken() : "";

      const reply: ChatReply = await chatWithCareerAI(updatedHistory, token);
      setMessages((prev) => [...prev, { role: "assistant", text: reply.text }]);
      setChatHistory((prev) =>
        [
          ...prev,
          { role: "model" as const, parts: [{ text: reply.text }] },
        ].slice(-24)
      );

      if (reply.audio) {
        playGeminiAudio(reply.audio, reply.text).catch(() =>
          speakText(reply.text)
        );
      } else {
        speakText(reply.text);
      }
    } catch (err: any) {
      const message =
        err?.message || "The AI chat could not respond right now.";
      setError(message);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", text: `I hit a temporary issue: ${message}` },
      ]);
    } finally {
      setIsThinking(false);
    }
  };

  return (
    <div className="h-screen overflow-hidden bg-background">
      <Navbar />

      <main className="h-full overflow-hidden px-4 pb-6 pt-24">
        <div className="container mx-auto h-full">
          <div className="h-full overflow-hidden rounded-[32px] border border-border bg-card shadow-xl">
            <div className="flex h-full min-h-0 flex-col lg:flex-row">
              <aside className="gradient-teal relative w-full shrink-0 overflow-y-auto p-8 text-white lg:w-[360px] lg:p-10">
                <div className="flex h-full flex-col justify-between gap-8">
                  <div>
                    <div className="mb-8 flex h-20 w-20 items-center justify-center rounded-3xl bg-white/20 shadow-lg">
                      <GraduationCap className="h-10 w-10" />
                    </div>

                    <p className="mb-3 text-xs font-semibold uppercase tracking-[0.25em] text-white/70">
                      AI Career Guide
                    </p>
                    <h1 className="mb-4 text-3xl font-bold">
                      Career Compass Chat
                    </h1>
                    <p className="mb-8 text-white/85">
                      Ask about streams, entrance exams, colleges, future
                      careers, or what fits your interests best.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className="rounded-2xl border border-white/20 bg-white/10 p-4 text-sm text-white/90">
                      {loading
                        ? "Checking login..."
                        : user
                        ? `Signed in as ${user.displayName}`
                        : "Sign in to use personalized AI career guidance."}
                    </div>

                    <div className="flex items-center justify-between rounded-2xl border border-white/20 bg-white/10 p-4 text-sm text-white/90">
                      <span>
                        {isMuted ? "Voice muted" : "Voice replies on"}
                      </span>
                      <button
                        onClick={handleToggleMute}
                        className="rounded-full bg-white/15 p-2 transition hover:bg-white/25"
                        aria-label={
                          isMuted
                            ? "Unmute voice replies"
                            : "Mute voice replies"
                        }
                      >
                        {isMuted ? (
                          <VolumeX className="h-4 w-4" />
                        ) : (
                          <Volume2 className="h-4 w-4" />
                        )}
                      </button>
                    </div>

                    {user ? (
                      <Button
                        onClick={handleLogout}
                        variant="secondary"
                        className="w-full gap-2 bg-white text-secondary hover:bg-white/90"
                      >
                        <LogOut className="h-4 w-4" />
                        Sign out
                      </Button>
                    ) : (
                      <Button
                        onClick={handleLogin}
                        className="w-full gap-2 bg-white text-secondary hover:bg-white/90"
                      >
                        <Sparkles className="h-4 w-4" />
                        Sign in with Google
                      </Button>
                    )}
                  </div>
                </div>
              </aside>

              <section className="flex min-h-0 flex-1 flex-col bg-background">
                <div className="shrink-0 border-b border-border px-6 py-5 lg:px-8">
                  <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                      <h2 className="text-2xl font-bold">
                        Chat with your career guide
                      </h2>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {quickPrompts.map((prompt) => (
                        <button
                          key={prompt}
                          onClick={() => sendMessage(prompt)}
                          className="rounded-full border border-border bg-card px-4 py-2 text-sm text-muted-foreground transition hover:border-primary hover:text-primary"
                        >
                          {prompt}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {!loading && !user && (
                  <div className="mx-6 mt-6 shrink-0 rounded-[28px] border border-amber-300 bg-amber-50 p-6 lg:mx-8">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                      <div className="flex items-start gap-3">
                        <AlertCircle className="mt-0.5 h-5 w-5 text-amber-600" />
                        <div>
                          <h3 className="font-semibold text-amber-900">
                            Login required for AI Chat
                          </h3>
                          <p className="text-sm text-amber-800">
                            Just like Exams and Scholarships, only signed-in
                            users can access the AI counsellor.
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <Button onClick={handleLogin} className="gap-2">
                          <Sparkles className="h-4 w-4" />
                          Sign in with Google
                        </Button>
                        <Button variant="outline" onClick={() => navigate("/")}>
                          Back to Home
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                <div
                  ref={scrollRef}
                  className="min-h-0 flex-1 space-y-6 overflow-y-auto px-6 py-6 lg:px-8"
                >
                  <AnimatePresence initial={false}>
                    {messages.map((message, index) => (
                      <motion.div
                        key={`${message.role}-${index}`}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`flex ${
                          message.role === "user"
                            ? "justify-end"
                            : "justify-start"
                        }`}
                      >
                        <div
                          className={`max-w-3xl ${
                            message.role === "user" ? "text-right" : "text-left"
                          }`}
                        >
                          <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                            {message.role === "user" ? (
                              <>
                                <User className="h-3.5 w-3.5" /> You
                              </>
                            ) : (
                              <>
                                <Bot className="h-3.5 w-3.5" /> Vidya
                              </>
                            )}
                          </div>

                          <div
                            className={
                              message.role === "user"
                                ? "inline-block rounded-[24px] rounded-tr-none bg-primary px-5 py-4 text-left text-primary-foreground shadow-md"
                                : "rounded-[28px] rounded-tl-none border border-border bg-card px-5 py-4 text-left shadow-sm"
                            }
                          >
                            <div className="prose prose-sm max-w-none dark:prose-invert">
                              <ReactMarkdown>{message.text}</ReactMarkdown>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>

                  {isThinking && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Thinking about the best path for you...
                    </div>
                  )}

                  {error && (
                    <div className="rounded-2xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                      {error}
                    </div>
                  )}
                </div>

                <div className="shrink-0 border-t border-border bg-card px-6 py-5 lg:px-8">
                  <div className="flex flex-col gap-3 sm:flex-row">
                    <textarea
                      value={input}
                      onChange={(event) => setInput(event.target.value)}
                      onKeyDown={(event) => {
                        if (event.key === "Enter" && !event.shiftKey) {
                          event.preventDefault();
                          sendMessage();
                        }
                      }}
                      rows={2}
                      placeholder="Ask about streams, exams, colleges, careers, or your interests..."
                      className="min-h-[56px] flex-1 resize-none rounded-2xl border border-input bg-background px-4 py-3 outline-none ring-0 transition focus:border-primary"
                      disabled={!user || isThinking}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        if (isRecording) {
                          void stopRecording(true);
                        } else {
                          startRecording();
                        }
                      }}
                      disabled={!speechSupported || !user || isThinking}
                      className={`h-auto min-h-[56px] rounded-2xl px-4 ${
                        isRecording
                          ? "border-red-400 bg-red-50 text-red-600"
                          : ""
                      }`}
                    >
                      {isRecording ? (
                        <>
                          <MicOff className="mr-2 h-4 w-4" /> Stop recording
                        </>
                      ) : (
                        <>
                          <Mic className="mr-2 h-4 w-4" /> Start recording
                        </>
                      )}
                    </Button>
                    <Button
                      onClick={() => sendMessage()}
                      disabled={!user || !input.trim() || isThinking}
                      className="h-auto min-h-[56px] rounded-2xl px-6"
                    >
                      <Send className="mr-2 h-4 w-4" />
                      Send
                    </Button>
                  </div>
                  {speechSupported && user && (
                    <div className="mt-3 flex items-center gap-3 text-xs text-muted-foreground">
                      <span
                        className={`inline-flex items-center gap-2 rounded-full px-3 py-1 ${
                          isRecording
                            ? "bg-red-100 text-red-600"
                            : micStatus === "starting"
                            ? "bg-amber-100 text-amber-700"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        <span
                          className={`h-2.5 w-2.5 rounded-full ${
                            isRecording
                              ? "animate-pulse bg-red-500"
                              : micStatus === "starting"
                              ? "animate-pulse bg-amber-500"
                              : "bg-muted-foreground/60"
                          }`}
                        />
                        {isRecording
                          ? "Recording... click again to stop"
                          : micStatus === "starting"
                          ? "Starting microphone..."
                          : "Mic ready"}
                      </span>
                      {liveTranscript ? (
                        <span className="truncate">
                          Listening: {liveTranscript}
                        </span>
                      ) : null}
                    </div>
                  )}
                </div>
              </section>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AIChat;
