"use client";


import { Button } from "@workspace/ui/components/button";
import { useVapi } from "@/modules/widget/hooks/use-vapi";

export default function Page() {

  const {startCall, stopCall, isConnected, isConnecting, isSpeaking, transcript} = useVapi();

  

  return (
    <div className="flex flex-col items-center justify-center min-h-svh">

     <Button onClick={() => startCall()}>
      Start call
     </Button>

     <Button onClick={() => stopCall()} variant={"destructive"}>
      Stop call
     </Button>
     <p>isConnected: {`${isConnected}`}</p>
     <p>isConnecting: {`${isConnecting}`}</p>
     <p>isSpeaking: {`${isSpeaking}`}</p>
     <p>{JSON.stringify(transcript, null, 2)}</p>
    </div>
  )
}
