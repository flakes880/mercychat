import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react";
import { createClient } from "@/supabase/utils/clients";
import { toast } from "@/components/ui/use-toast";

export default function NewClient({
  setIsOpenNewClient,  
  setClientInfo
}) {
  const supabase = createClient();
  const [isLoading, setIsLoading] = useState(false);

  const clientsSchema = z.object({
    name: z.string().min(1, {
      message: "Your name is required.",
    }),
    email: z.string().email({ message: "Invalid email address" }),
  });

  const defaultValues = {
    name: "",
    email: ""
  }

  const form = useForm({
    resolver: zodResolver(clientsSchema),
    defaultValues,
    mode: "onChange",
  });


  async function onSubmit (data, event) {
    event.preventDefault();
    setIsLoading(true);

    setClientInfo(JSON.stringify(data))
    localStorage.setItem('clientInfo', JSON.stringify(data));

    const { error } = await supabase
    .from('visitors')
    .upsert({ ...data })
    .select()

    if(
      error && 
      error.message !== `duplicate key value violates unique constraint "visitors_email_key"`
    ) {
      setIsLoading(false);
      toast({
        variant: "destructive",
        description:
          "There was an saving your data. Please try again.",
      }); 
      return ;
    } 
    
    setIsOpenNewClient(false);

    setIsLoading(false);
  }

  return (
    <div className="absolute top-0 left-0 bg-gray-100/90 w-full rounded-lg h-full flex items-center justify-center px-5">
      <Card className="p-7 md:w-[75%] sm:w-[80%] w-[90%] mx-auto">
        <p className="text-sm mb-3 font-medium">
          Before you continue we would love to know you.
        </p>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 w-full">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Address</FormLabel>
                  <FormControl>
                    <Input placeholder="johndoe@gmail.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="h-8 w-full">
              {isLoading && (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />{" "}
                </>
              )}
              Send & Continue
            </Button>
          </form>
        </Form>
      </Card>
    </div>
  );
}
