"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
  FormLabel
} from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";
import { Textarea } from "@/components/ui/textarea"
import OverlayLoader from "@/components/loader/overlay";

const FormSchema = z.object({
  question: z.string().min(10, { message: "Question must be aleast 10 characters." }),
  answer: z.string().min(30, { message: "Answer must be aleast 30 characters." })
});

export default function UploadQA() {
  const [uploading, setUploading] = useState(false);

  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      question: "",
      answer: "",
    },
  });

  async function onSubmit(data, event) { 
    event.preventDefault();
    setUploading(true)

    await fetch("/api/embed/qa", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body:JSON.stringify({
        ...data
      }), 
    })
      .then((response) => response.json())
      .then((data) => {
        setUploading(false);
        if(!data.status) {
          toast({
            variant: "destructive",
            description:
              "There was an error uploading the training data. Please try again.",
          });
          return;
        }

        form.reset();
        
        toast({
          description:
            "Your training data has been uploaded successfully.",
        });
      })
    return ;
  }

  return (
    <Card className="shadow-md px-4 relative">
      <CardHeader>
        <CardTitle className="text-center">Upload your Question and Answer</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="">
            <FormField
              control={form.control}
              name="question"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Question</FormLabel>
                  <FormControl>
                    <Textarea 
                      className={"min-h-[50px]"}
                      placeholder="How can I apply for admission to the school?" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="answer"
              render={({ field }) => (
                <FormItem  className="mt-2">
                  <FormLabel>Answer</FormLabel>
                  <FormControl>
                    <Textarea 
                      rows={"5"}
                      placeholder="To apply for admission, please visit our school's website and navigate to the Admissions section. You'll find detailed instructions and the online application form there" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="mt-4 w-full">
              { "Upload Data" }
            </Button>
          </form>
        </Form>
      </CardContent>

      { uploading && (
        <OverlayLoader>
          <p className="text-base text-gray-700 font-bold mb-1 mt-3 text-center">
            Uploading your training data to the database.
          </p>
          <p className="text-sm text-gray-700 font-semibold text-center">
            It is almost done. This might also take up to a minute.
          </p>
        </OverlayLoader>
      )}
    </Card>
  );
}
