"use client";

import { Loader2, LogOut } from "lucide-react";
import { signOut } from "next-auth/react";
import React from "react";
import { toast } from "react-hot-toast";
import Button from "../ui/Button";

type TSignOutButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {};

const SignOutButton: React.FC<TSignOutButtonProps> = ({ ...props }) => {
  const [isSigninOut, setIsSigninOut] = React.useState<boolean>(false);

  const handleLogout = async () => {
    try {
      setIsSigninOut(true);
      await signOut();
    } catch (error) {
      toast.error("There was an error logging out");
    } finally {
      setIsSigninOut(false);
    }
  };

  return (
    <Button {...props} variant="ghost" onClick={handleLogout}>
      {isSigninOut ? (
        <Loader2 className="animate-spin w-4 h-4" />
      ) : (
        <LogOut className="w-4 h-4" />
      )}
    </Button>
  );
};

export default SignOutButton;
