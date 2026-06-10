"use client";

import { UserButton, SignInButton, Show } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { ClapperboardIcon, UserCircleIcon } from "lucide-react";

export const AuthButton = () => {
  return (
    <>
      <Show when="signed-out">
        <SignInButton mode="modal">
          <Button
            variant="outline"
            className="px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-500 border-blue-500/20 rounded-full shadow-none"
          >
            <UserCircleIcon />
            登录
          </Button>
        </SignInButton>
      </Show>
      <Show when="signed-in">
        <UserButton>
          <UserButton.MenuItems>
            <UserButton.Link
              label="工作室"
              href="/studio"
              labelIcon={<ClapperboardIcon className="size-4" />}
            />
            <UserButton.Action label="manageAccount" />
          </UserButton.MenuItems>
        </UserButton>
      </Show>
    </>
  );
};
