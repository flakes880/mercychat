"use client";

import { useState, useEffect } from "react";
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
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { signup } from './actions'
import { SpinIcon } from "@/components/icon";

const FormSchema = z.object({
  name: z.string().min(3, { message: "Your password must be atleast 3 character long" }),
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(8, { message: "Your password must be atleast 8 character long" }),
});

export default function Register() {
  const [authenticating, setAuthenticating] = useState(false);
  const [isLoadingPage, setIsLoadingPage] = useState(true);

  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });


  async function onSubmit(data, event) { 
    event.preventDefault();
    
    setAuthenticating(true);
    const error = await signup(data);

    if(error) {
      setAuthenticating(false); 

      toast({
        title: "User registration is unsuccessful",
        description: (
          <strong> { error } </strong>
        ),
      });
    }
  }
    
  useEffect(() => {
    setIsLoadingPage(false)
  }, [])

  return (
    <main className="flex items-center justify-center h-screen">
      <Card className="w-[80%] max-w-[400px] shadow-md">
        <CardHeader>
          <CardTitle className="text-center">Register</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Johnson Ibrahim" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="mt-2">
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="mail@gmail.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem  className="mt-2">
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="password" 
                        type="password" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button 
                type="submit" 
                className="mt-4 w-full"
                disabled={isLoadingPage}
              >
                { authenticating ? 
                  <>
                    <SpinIcon />
                    {" Processing"}
                  </>
                : "Register"  }
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </main>
  );
}
