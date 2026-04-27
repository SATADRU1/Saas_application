import { Doc } from "@workspace/backend/_generated/dataModel";
import { Hint } from "@workspace/ui/components/hint";
import { Button } from "@workspace/ui/components/button";
import { ArrowUpIcon, CheckIcon } from "lucide-react";


export const ConversationStatusButton = ({
    status,
    onClick,
    disabled,
}:{
    status: Doc<"conversations">["status"], 
    onClick: () => void,
    disabled?: boolean,
}) => {
    if (status === "resolved") {
        return (
            <Hint description="Mark as unresolved">
                <Button disabled={disabled} onClick={onClick} size="sm" variant="tertiary">
                    <CheckIcon />
                    Resolved
                </Button>
            </Hint>
        )
    }

    if (status === "escalated") {
        return (
            <Hint description="Mark as resolved">
                <Button disabled={disabled} onClick={onClick} size="sm" variant="warning">
                    <ArrowUpIcon />
                        Escalated
                </Button>
            </Hint>
        )
    }

   
        return (
            <Hint description="Mark as escalated">
                <Button disabled={disabled} onClick={onClick} size="sm" variant="destructive">
                    <ArrowUpIcon />
                        Unresolved
                </Button>
            </Hint>
        )
    
    
    
}