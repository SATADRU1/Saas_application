"use client";


import { SignInButton, UserButton, OrganizationSwitcher} from "@clerk/nextjs";
import { useQuery, useMutation} from "convex/react";
import { api } from "@workspace/backend/_generated/api";
import { Button } from "@workspace/ui/components/button";


export default function Page() {




  const users = useQuery(api.user.getMany);
  const addUser = useMutation(api.user.add);
  

  return (
    <>
    
        <div className="flex flex-col items-center justify-center min-h-svh">
        <p>apps/web</p>
        <OrganizationSwitcher hidePersonal/>
        <UserButton />
        <Button onClick={() => addUser({})}>Add User</Button>
        <div className="max-w-sm w-full mx-auto">
            {JSON.stringify(users, null, 2)}
        </div> 
        </div>

        <p>Must be signed in!</p>
        <SignInButton>
          Sign in!
        </SignInButton>

    </>
  )
}
