"use client";

import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useState } from "react";
import { SpinIcon } from "@/components/icon";
import { toast } from "@/components/ui/use-toast";

export default function MakeAdmin({ user, supabase }) {
  const [ alertStatus, setAlertStatus ] = useState(false);
  const [ isModifyingRole, setIsModifyingRole ] = useState(false);
  const [ role, setRole ] = useState(user.role);

  const openDialog = () => {
    setAlertStatus(true);
  }

  const closeDialog = () => {
    setAlertStatus(false);
  }

  const onModifyRole = async () => {
    setIsModifyingRole(true);

    const newRole = role === "admin" ? "subscriber" : "admin";
    const { error } = await supabase
      .from("profile")
      .update({ 
        role: newRole
      })
      .eq('user_id', user.user_id)

    setRole(newRole)
    setIsModifyingRole(false);
    setAlertStatus(false);

    if(error) {
      toast({
        variant: "destructive",
        description:
          "There was an error modifying user role. Please try again.",
      }); 
      return ;
    } 

    toast({
      description:
        "Users role has been modified successfully.",
    });

    return ;
  }


  const adminButtonText = role === "admin" ? "Remove Admin" : "Make Admin";

  return (
    <AlertDialog open={alertStatus}>
      <AlertDialogTrigger asChild>
        <Button 
          className="h-6 py-0 px-2"
          onClick={openDialog}
        >
          {adminButtonText}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            { role === "admin" 
              ? "If you proceed, the user will no longer have access to your training data and can not add to your training data."
              : "If you proceed, the user will have access to your training data and can also add to your training data."
            }
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel 
            onClick={closeDialog}
            disabled={isModifyingRole}
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction 
            variant={"destructive"}
            onClick={onModifyRole}
            disabled={isModifyingRole}
          >
            { isModifyingRole ? 
              <>
                <SpinIcon />
                {" Processing"}
              </>
            : adminButtonText  }
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
