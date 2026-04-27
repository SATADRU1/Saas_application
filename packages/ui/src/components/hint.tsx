"use client"

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@workspace/ui/components/tooltip";
import { ReactNode } from "react";

interface HintProps {
    children: ReactNode;
    description: string;
    side?: "top" | "bottom" | "left" | "right";
    align?: "start" | "center" | "end";
}

export const Hint = ({ children, description, side="top", align="center" }: HintProps) => {
    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    {children}
                </TooltipTrigger>
                <TooltipContent side={side} align={align}>
                    <p className="font-semibold text-sm">
                        {description}
                    </p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    )
}