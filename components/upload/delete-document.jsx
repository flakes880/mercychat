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

export default function DeleteDocuments({ 
  document, 
  supabase,
  trainingData,
  setTrainingData 
}) {
  const [ alertStatus, setAlertStatus ] = useState(false);
  const [ isDeleting, setIsDeleting ] = useState(false);

  const openDialog = () => {
    setAlertStatus(true);
  }

  const closeDialog = () => {
    setAlertStatus(false);
  }

  const onDelete = async () => {
    setIsDeleting(true);

    const tableToDeleteFrom = document.type === "document" ? "documents" : "questions";

    const { error } = await supabase
      .from(tableToDeleteFrom)
      .delete()
      .eq('id', document.id)

    setIsDeleting(false);
    setAlertStatus(false);

    if(error) {
      toast({
        variant: "destructive",
        description:
          "There was an error deleting the training data. Please try again.",
      }); 
      return ;
    } 

    const newTrainingData = trainingData.filter((data) => {
      if(data.id !== document.id){
        return data;
      }
    })

    setTrainingData(newTrainingData)

    toast({
      description:
        "Your training data has been deleted successfully.",
    });

    return ;
  }

  return (
    <AlertDialog open={alertStatus}>
      <AlertDialogTrigger asChild>
        <Button 
          variant={"destructive"} 
          className="h-6 py-0 px-2"
          onClick={openDialog}
        >
          Delete
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the documennt
            and remove the data from the servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel 
            onClick={closeDialog}
            disabled={isDeleting}
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction 
            variant={"destructive"}
            onClick={onDelete}
            disabled={isDeleting}
          >
            { isDeleting ? 
              <>
                <SpinIcon />
                {" Deleting"}
              </>
            : "Delete"  }
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
