import Vapi from "@vapi-ai/web";
import { useEffect, useState } from "react";

interface TranscriptMessage {
    role: "user" | "assistant";
    content: string;
}

export const useVapi = () => {
    const [vapi, setVapi] = useState<Vapi | null>(null);
    const [isConnected, setIsConnected] = useState(false);
    const [isConnecting, setIsConnecting] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [transcript, setTranscript] = useState<TranscriptMessage[]>([]);


    useEffect(() => {
        //only for testing otherwise customer will use his own api key
        const vapiInstance = new Vapi("c8a2b4a4-1950-4ea6-a684-1703b3164da7");


        setVapi(vapiInstance);

        vapiInstance.on("call-start", () => {
            setIsConnected(true);
            setIsConnecting(false);
            setTranscript([]);
        });

        vapiInstance.on("call-end", () => {
            setIsConnected(false);
            setIsConnecting(false);
            setIsSpeaking(false);
        });

        vapiInstance.on("speech-start", () => {
            setIsSpeaking(true);
        });

        vapiInstance.on("speech-end", () => {
            setIsSpeaking(false);
        });

        vapiInstance.on("error", (error) => {
            console.error("Vapi error:", error);
            setIsConnecting(false);
        });

        vapiInstance.on("message", (message) => {
            if (message.type === "transcript" && message.transcriptType === "final") {
                setTranscript((prev) => [
                    ...prev,
                    {
                        role: message.role === "user" ? "user" : "assistant",
                        content: message.transcript,
                    },
                ]);
            }
        });

        return () => {
            vapiInstance?.stop();
        };
    }, []);

    const startCall = () => {
        setIsConnecting(true);

        if (vapi) {
             //only for testing otherwise customer will use his own assitent id
            vapi.start("d6863823-e14a-44e2-ade4-fd6bbc940d8c");
        }
    };

    const stopCall = () => {
        if (vapi) {
            vapi.stop();
        }
    };

    return {
        startCall,
        stopCall,
        isConnected,
        isConnecting,
        isSpeaking,
        transcript,
    };
}
