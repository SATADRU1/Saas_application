import { ArrowRightIcon, CheckIcon, ArrowUpIcon, Loader2Icon } from "lucide-react";
import { cn } from "@workspace/ui/lib/utils";



interface ConversationStatusIconProps {
    status: "unresolved" | "escalated" | "resolved"
    className?:string;
}

const statusConfig ={
    resolved: {
        icon: CheckIcon,
        bg: "bg-[#3FB62F]"
    },
    unresolved: {
        icon: ArrowRightIcon,
        bg: "bg-destructive"
    },
    escalated: {
        icon: ArrowUpIcon,
        bg: "bg-yellow-500"
    }

} as const;

export const ConversationStatusIcon = ({ status, className }: ConversationStatusIconProps) => {
    const config = statusConfig[status];
    const Icon = config.icon
    return (
        <div className={cn("flex items-center rounded-full size-5 justify-center", config.bg, className)}>
            <Icon className="size-3 stroke-3 text-white" />
        </div> 
    )
}
