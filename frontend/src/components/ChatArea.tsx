import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Nav from './Nav'
import MessageList from './MessageList'
import ChatInput from './ChatInput'
import { getMessages } from '../features/getMessages'
import { setMessages } from '../redux/messageSlice'

const ChatArea = () => {
  const dispatch = useDispatch()
  const { selectedConversation } = useSelector((state: any) => state.conversation)

  useEffect(() => {
    if (selectedConversation?._id) {
      const fetchMessages = async () => {
        if(selectedConversation.title=="New Chat")return;
        const data = await getMessages(selectedConversation._id)
        if (data) {
          dispatch(setMessages(data))
        }
      }
      fetchMessages()
    }
  }, [selectedConversation?._id, dispatch])

  return (
    <div className='flex-1 flex flex-col '>
      <Nav/>
      <MessageList/>
      <ChatInput/>
    </div>
  )
}

export default ChatArea