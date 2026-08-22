import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Nav from './Nav'
import MessageList from './MessageList'
import ChatInput from './ChatInput'
import { getMessages } from '../features/getMessages'
import { setArtifacts, setMessages } from '../redux/messageSlice'

const ChatArea = () => {
  const dispatch = useDispatch()
  const { selectedConversation } = useSelector((state: any) => state.conversation)

  useEffect(() => {
    if (selectedConversation?._id) {
      const fetchMessages = async () => {
        if (selectedConversation.title == "New Chat") return;
        const data = await getMessages(selectedConversation._id)
        if (data) {
          dispatch(setMessages(data))
          const latestArtifactMessage = [...data].reverse().find((msg: any) => msg.artifacts && msg.artifacts.length > 0)
          dispatch(setArtifacts(latestArtifactMessage?.artifacts || []))
        }
      }
      fetchMessages()
    } else {
      dispatch(setMessages([]))
      dispatch(setArtifacts([]))
    }
  }, [selectedConversation?._id, dispatch])

  return (
    <div className='flex-1 flex flex-col min-w-0'>
      <Nav/>
      <MessageList/>
      <ChatInput/>
    </div>
  )
}

export default ChatArea