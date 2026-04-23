"use client"

import { useAtomValue, useSetAtom } from "jotai";
import { LoaderIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { organizationIdAtom } from "../../atoms/widget-atoms";


import { errorMessageAtom, loadingMessageAtom , screenAtom, contactSessionIdAtomFamily } from "../../atoms/widget-atoms";
import { WidgetHeader } from "../components/widget-header";
import { useAction, useMutation } from "convex/react";
import { api } from "@workspace/backend/_generated/api";

type InitStep = "org" |"session" | "settings" | "vapi" | "done";

export const WidgetLoadingScreen = ({ organizationId }: { organizationId: string | null }) => {
    const [step, setStep] = useState<InitStep>("org");
    const [sessionValid,setSessionValid] = useState(false);


    const setOrganizationId = useSetAtom(organizationIdAtom);
    const setErrorMessage = useSetAtom(errorMessageAtom);
    const setLoadingMessage = useSetAtom(loadingMessageAtom);
    const loadingMessage = useAtomValue(loadingMessageAtom);
    const setScreen = useSetAtom(screenAtom);

    const contactSessionId = useAtomValue(contactSessionIdAtomFamily(organizationId || ""));

    const validateOrganization = useAction(api.public.organization.validate);
    useEffect(()=>{
        if(step !== "org"){
            return;
        }

        setLoadingMessage("Finding Organization ID...");
       


        if(!organizationId){
            setErrorMessage("Organization ID is required");
            setScreen("error");
            return;
        }
        
        setLoadingMessage("Varifying organization... ")

        validateOrganization({ organizationId})
            .then((result)=>{
                if(result.valid){
                    setOrganizationId(organizationId);
                    setStep("session");
                }
                else{
                    setErrorMessage(result.reason || "Invalid organization");
                    setScreen("error");
                }
            })
            .catch(()=>{
                setErrorMessage("Failed to varify organization");
                setScreen("error");
            })
        
    }, [step, organizationId, setErrorMessage, setScreen, setStep, setOrganizationId, setLoadingMessage, validateOrganization])
    


    const validateContactSession = useMutation(api.public.contactSessions.validate);
    useEffect(() =>{
        if(step !== "session"){
            return;
        }

        setLoadingMessage("Finding Contact Session ID...");

        if(!contactSessionId){
            setSessionValid(false);
            setStep("done")
            return;
        }

        setLoadingMessage("Varifying session... ")

        validateContactSession({
            contactSessionId:contactSessionId,
        })
            .then((result)=>{
                setSessionValid(result.valid)
                setStep("done")
            })
            .catch(()=>{
                setErrorMessage("Failed to varify session");
                setStep("done");
            })
        

       
    },[step, contactSessionId, validateContactSession, setSessionValid, setStep, setErrorMessage, setLoadingMessage])

    useEffect(()=>{
        if(step !== "done"){
            return;
        }

        const hasValidSession = sessionValid && !!contactSessionId;
        setScreen(hasValidSession? "selection": "auth")

        
    }, [step, sessionValid, contactSessionId, setScreen]) 






    return (
        <>
           
           {/* Header */}
           <WidgetHeader>
                <div className="flex flex-col justify-between gap-y-2 px-2 py-6">
                    <p className="text-3xl font-semibold">Hi there! 👋</p>
                    <p className="text-sm font-medium">
                        let&apos;s get you started
                    </p>
                </div>
            </WidgetHeader>
            <div className="flex flex-1 flex-col items-center justify-center gap-y-4 p-4 text-muted-foreground">
                <LoaderIcon className="animate-spin" size={40}/>
                <p className="text-sm">
                    {loadingMessage || "loading..."}
                </p>
            </div>
           
        </>
    );
};

