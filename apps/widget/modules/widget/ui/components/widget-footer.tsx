import { Button } from "@workspace/ui/components/button";
import { HomeIcon, InboxIcon } from "lucide-react";
import { cn } from "@workspace/ui/lib/utils";
import { useSetAtom, useAtomValue } from "jotai";
import { screenAtom } from "../../atoms/widget-atoms";









export const WidgetFooter = () => {
  


  const setScreen = useSetAtom(screenAtom);
  const screen = useAtomValue(screenAtom);

  return (
    <footer className="flex items-center justify-between bg-background border-t">
      <Button
        className="h-14 flex-1 rounded-none"
        variant="ghost"
        size="icon"
        onClick={() => {setScreen("selection")}}
      >
        <HomeIcon
          className={cn(
            "size-5",
            screen === "selection" && "text-primary"
          )}
        />
      </Button>
      <Button
        className="h-14 flex-1 rounded-none"
        variant="ghost"
        size="icon"
        onClick={() => {setScreen("inbox")}}  
      >
        <InboxIcon
          className={cn(
            "size-5",
            screen === "inbox" && "text-primary"
          )}
        />
      </Button>
    </footer>
  );
};

