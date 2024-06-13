/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import Link from "next/link"
import { 
  BotIcon,
  FileIcon,
  HelpingHandIcon
} from "@/components/icon"
import { Navbar } from "@/components/homepage"
import { Suspense } from 'react'

export default function Homepage() {
  return (
    <div className="flex min-h-[100dvh] flex-col">
      <Suspense>
        <Navbar />
      </Suspense>
      <main className="flex-1">
        <section className="flex h-[calc(100dvh-4rem)] items-center justify-center px-6 lg:px-12">
          <div className="mx-auto flex max-w-5xl flex-col items-center space-y-8 text-center">
            <div className="space-y-4">
              <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
                Streamline Your IBLT University Inquiries with MercyChat
              </h1>
              <p className="max-w-[600px] mx-auto text-[#FF6B00] md:text-xl dark:text-[#FF6B00]">
                Our cutting-edge chatbot is your go-to solution for all your IBLT University-related questions and administrative tasks. 
                Get instant answers and personalized assistance at your fingertips.
              </p>
            </div>
            <Link
              className="inline-flex h-10 items-center justify-center rounded-md bg-[#FF6B00] px-8 text-sm font-medium text-gray-50 shadow transition-colors hover:bg-[#FF8533] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#FF6B00] disabled:pointer-events-none disabled:opacity-50 dark:bg-[#FF6B00] dark:text-gray-900 dark:hover:bg-[#FF8533] dark:focus-visible:ring-[#FF6B00]"
              href="/chat"
            >
              Start Chatting
            </Link>
          </div>
        </section>
        <section className="bg-[#FFF5ED] py-12 dark:bg-[#1F1F1F]">
          <div className="container mx-auto px-6 lg:px-12">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              <div className="rounded-md bg-white p-6 shadow-sm dark:bg-[#2F2F2F]">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <h3 className="text-lg font-medium">Instant Answers</h3>
                    <p className="text-[#FF6B00] dark:text-[#FF6B00]">
                      Get quick responses to your IBLT University-related questions.
                    </p>
                  </div>
                  <BotIcon className="h-12 w-12 text-[#FF6B00] dark:text-[#FF6B00]" />
                </div>
              </div>
              <div className="rounded-md bg-white p-6 shadow-sm dark:bg-[#2F2F2F]">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <h3 className="text-lg font-medium">Personalized Assistance</h3>
                    <p className="text-[#FF6B00] dark:text-[#FF6B00]">
                      Get tailored support for your specific IBLT University-related needs.
                    </p>
                  </div>
                  <HelpingHandIcon className="h-12 w-12 text-[#FF6B00] dark:text-[#FF6B00]" />
                </div>
              </div>
              <div className="rounded-md bg-white p-6 shadow-sm dark:bg-[#2F2F2F]">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <h3 className="text-lg font-medium">Trained Data</h3>
                    <p className="text-[#FF6B00] dark:text-[#FF6B00]">
                      The chatbot is trained on the knowledgebase of IBLT University.
                    </p>
                  </div>
                  <FileIcon className="h-12 w-12 text-[#FF6B00] dark:text-[#FF6B00]" />
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="py-12 md:py-24 lg:py-32">
          <div className="container mx-auto px-6 lg:px-12">
            <div className="mx-auto max-w-4xl text-center">
              <div className="space-y-4">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Streamline Your IBLT University Inquiries
                </h2>
                <p className="text-[#FF6B00] md:text-xl dark:text-[#FF6B00]">
                  Our chatbot is designed to be your trusted companion for all your IBLT University-related needs. 
                  With instant answers, personalized assistance, and the ability to answer questions about administrative operations and 
                  provide tailored responses, so that you can focus on your studies.
                </p>
              </div>
              <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
                <Link
                  className="inline-flex h-10 items-center justify-center rounded-md bg-[#FF6B00] px-8 text-sm font-medium text-gray-50 shadow transition-colors hover:bg-[#FF8533] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#FF6B00] disabled:pointer-events-none disabled:opacity-50 dark:bg-[#FF6B00] dark:text-gray-900 dark:hover:bg-[#FF8533] dark:focus-visible:ring-[#FF6B00]"
                  href="/chat"
                >
                  Start Chatting
                </Link>
                <Link
                  className="inline-flex h-10 items-center justify-center rounded-md border border-[#FF6B00] bg-white px-8 text-sm font-medium shadow-sm transition-colors hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#FF6B00] disabled:pointer-events-none disabled:opacity-50 dark:border-[#FF6B00] dark:bg-gray-950 dark:hover:bg-[#FF8533] dark:hover:text-gray-50 dark:focus-visible:ring-[#FF6B00]"
                  href="/upload"
                >
                  Train Chatbot
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="bg-gray-900 py-6 text-gray-50 dark:bg-gray-950">
        <div className="container mx-auto flex flex-col items-center justify-between gap-4 px-6 lg:flex-row lg:px-12">
          <div className="flex items-center space-x-2">
            <BotIcon className="h-6 w-6" />
            <span className="text-sm font-medium">MercyChat</span>
          </div>
          <p className="text-sm">© 2024 MercyChat. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
