"use client";

import { WidgetView } from "@/modules/widget/ui/widget-view/widget-view";
import { use } from "react";

interface props {
  searchParams: Promise<{
    organizationId: string;
  }>
}


const page = ({searchParams}:props) => {
  const {organizationId} = use(searchParams);



  return (
    <WidgetView organizationId={organizationId}/>
  )
}

export default page;
