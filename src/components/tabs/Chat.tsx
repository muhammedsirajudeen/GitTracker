"use client"

import {  useEffect, useRef, useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Send, Bot, User, Clock, Github, MessageSquare, PlusIcon, X } from "lucide-react"
import useSWR from "swr"
import { fetcher } from "../RepositoryListing"
import { useParams } from "next/navigation"
import { Chat, Conversation } from "@/models/Conversation"
import { toast } from "@/hooks/use-toast"
import axios, { AxiosError } from "axios"
import { HttpStatus } from "@/lib/HttpStatus"
import { flushSync } from "react-dom"
import { produce } from "immer"
import ConversationDelete from "../delete/ConversationDelete"
// import { ClipLoader } from "react-spinners"


export default function ChatComponent() {
  const {id}=useParams()
  const {data,isLoading}=useSWR(`/api/conversation`,fetcher,  {
    revalidateIfStale: true,  // Always revalidate if data is stale
    revalidateOnFocus: false, // Optional: prevent refetch on focus
    revalidateOnReconnect: false, // Optional: prevent refetch on network reconnect
    dedupingInterval: 0 // No deduplication — always trigger a request
  })
  const renderRef=useRef(0)
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [conversation,setConversation]=useState<Conversation>()
  const [conversationId,setConversationId]=useState("")
  const [ailoading,setAiloading]=useState(false)
  const inputRef=useRef<HTMLInputElement>(null)
  const chatRef=useRef<HTMLDivElement>(null)
  const [deletedialog,setDeletedialog]=useState<boolean>(false)
  console.log(data)
  useEffect(()=>{
    if(data && renderRef.current===0 ){
      setConversations(data.conversations.toReversed())
      
      if(data.conversations.length>0){
        setConversation(data.conversations[data.conversations.length-1])
        setMessages(data.conversations[data.conversations.length-1].chats)
        setTimeout(()=>{
            if(chatRef.current){
            chatRef.current.scrollTop=chatRef.current.scrollHeight
            }
          })
      }
      renderRef.current++
    }
  },[data])

  const [messages, setMessages] = useState<Chat[]>([])
  // const [isLoading, setIsLoading] = useState(false)

  const handleSendMessage = async () => {
    const inputMessage=inputRef.current?.value ?? ""
    console.log(inputMessage)
    flushSync(()=>{
      setAiloading(true)
    })
    if(chatRef.current){
      chatRef.current.scrollTop=chatRef.current.scrollHeight
    }
    if (inputMessage.trim() === "") {
      toast({description:"Please enter a message",className:"bg-orange-500 text-white"})
      return
    }
    /*
    TODO:
      @muhammedsirajudeen 
      we have to first first check whether there is any existing conversation is there is no existing conversation
      we have to create the conversation first
      let's do that

    */
   if(conversations.length===0){
    try {      
      const response=await axios.post(`/api/chat/${id}`,{
          conversationTitle:inputMessage.split(' ').slice(0,2).join(' '),
          repositoryId:id,
          chats:[
            {
              from:"user",
              message:inputMessage,
              date:new Date()
            }
          ],

        } as Conversation,
        {
          withCredentials: true
        })
        if(response.status===HttpStatus.CREATED){
          console.log(response.data)
          setConversations([...conversations,response.data.conversation])
          setMessages(response.data.conversation.chats)
        }
    } catch (error) {
      const clientError=error as Error
      console.log(clientError.message)
      toast({description:"new conversation failed please try again",className:"bg-red-500 text-white"})
    }  
   }
   else{
    try {
      const response=await axios.put(`/api/chat/${id}`,{
        conversationId:conversation?._id,
        chat:{
          from:"user",
          message:inputMessage,
          date:new Date()
        }
      },
    {
      withCredentials:true
    })
    if(response.status===HttpStatus.OK){
      console.log(response.data)
      setConversation(response.data.conversation)
      flushSync(()=>{
        setMessages(response.data.conversation.chats)
      })
      if(chatRef.current){
        chatRef.current.scrollTop=chatRef.current.scrollHeight
      }

    }
    } catch (error) {
      const clientError=error as Error
      console.log(clientError.message)
      toast({description:"failed to chat with the model",className:"bg-red-500 text-white"})
    }
   }
   setAiloading(false)
   if(inputRef.current){
    inputRef.current.value=""
   }
  }
  async function newConversationHandler(){
    try {
      const response=await axios.post(`/api/conversation/${id}`,{
        conversationTitle:"New Conversation",
        repositoryId:id,
        chats:[],

      },
      {
        withCredentials: true
      })
      toast({description:'conversation created',className:'bg-green-500 text-white'})
      setConversations(produce((conversationDraft)=>{
        conversationDraft.unshift(response.data.conversation)
      }))
      setConversation(response.data.conversation)
      setMessages([])
    } catch (error) {
      const clientError=error as AxiosError
      if(clientError.status===HttpStatus.UNAUTHORIZED){
        toast({description:'please try logging in again',className:'bg-red-500 text-white'})
      }else{
        toast({description:'please try again',className:'bg-red-500 text-white'})
      }
    }
  }
  async function deleteHandler(id:string){
    setConversationId(id)
    setDeletedialog(true)
    
  }
  return (
    <div className="flex w-full items-center justify-center">
        <Card className="w-3/4 min-h-[60vh] mt-4 ">
        <div className="flex h-[60vh]">
            <div className="w-1/4 border-r overflow-auto">
            <div className="flex items-center justify-evenly">
              <h2 className="text-lg font-semibold p-4 border-b">Conversation History</h2>
              <PlusIcon onClick={newConversationHandler} />
            </div>
            {conversations.map((Iconversation) => (
                <div
                key={Iconversation._id}
                className={`p-4 border-b cursor-pointer hover:bg-black  ${Iconversation._id=== conversation?._id ? "bg-black" : ""}`}
                onClick={()=>{
                  console.log(Iconversation)
                  setConversation(Iconversation)
                  setMessages(Iconversation.chats)
                }}
                >
                <div className="flex w-full justify-between" >
                <h3 className="font-medium truncate">{Iconversation.conversationTitle}</h3>
                <div className="flex items-center text-xs text-gray-400 mt-1">
                    <Clock className="w-3 h-3 mr-1" />
                    {Iconversation.date.toLocaleString?.()}
                </div>
                <X onClick={(e)=>{
                  e.stopPropagation()
                  deleteHandler(Iconversation._id)
                  }}  />
                </div>
                </div>
            ))}
            </div>
            <div className="w-3/4 flex flex-col">
            <div ref={chatRef} className="flex-grow  overflow-auto p-4">
                <div className="space-y-4">
                  {/* {
                    isLoading &&
                    <div className="flex w-full h-full mt-52 items-center justify-center">
                      <ClipLoader size={40} color="white"/>
                    </div>
                  } */}
                  {
                    messages.length===0 && !ailoading && !isLoading &&
                    <Card className="w-full max-w-md mx-auto mt-12">
                    <CardHeader>
                      <CardTitle className="text-2xl font-bold text-center">Welcome to Repo Chat</CardTitle>
                      <CardDescription className="text-center">
                        Your AI assistant for GitHub repositories
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col items-center space-y-4">
                      <Github className="w-16 h-16 text-gray-400" />
                      <MessageSquare className="w-12 h-12 text-gray-300" />
                      <p className="text-center text-gray-500">
                        No messages yet. Start a conversation about your GitHub repository!
                      </p>
                    </CardContent>
                    <CardFooter>
                      <Button className="w-full">
                        Start Chatting
                      </Button>
                    </CardFooter>
                  </Card>
                  }
                {messages.map((message) => (
                    <div key={message._id} className={`flex ${message.from === "user" ? "justify-end" : "justify-start"}`}>
                    <div
                        className={`max-w-[70%] p-3 rounded-lg ${
                        message.from === "user" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-800"
                        }`}
                    >
                        <div className="flex items-center mb-1">
                        {message.from === "user" ? <User className="w-4 h-4 mr-2" /> : <Bot className="w-4 h-4 mr-2" />}
                        <span className="font-semibold">{message.from === "user" ? "You" : "AI"}</span>
                        </div>
                        {message.message}
                    </div>
                    </div>
                ))}
                {ailoading && (
                    <div className="flex justify-start">
                    <div className="max-w-[70%] p-3 rounded-lg bg-gray-200 text-gray-800">
                        <div className="flex items-center">
                        <Bot className="w-4 h-4 mr-2" />
                        <span className="font-semibold">AI</span>
                        </div>
                        Thinking...
                    </div>
                    </div>
                )}
                </div>
            </div>
            <div className="p-4 border-t">
                <div className="flex space-x-2">
                <Input
                    ref={inputRef}
                    type="text"
                    placeholder="Type your message..."
                    onKeyPress={(e) => {
                    if (e.key === "Enter") {
                        handleSendMessage()
                    }
                    }}
                />
                <Button onClick={handleSendMessage} disabled={isLoading}>
                    <Send className="w-4 h-4 mr-2" />
                    Send
                </Button>
                </div>
            </div>
            </div>
        </div>
        </Card>
        <ConversationDelete setMessages={setMessages} setConversations={setConversations} conversationId={conversationId} isOpen={deletedialog} setIsOpen={setDeletedialog} />
    </div>
  )
}

