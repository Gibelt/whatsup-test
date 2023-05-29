import { useEffect, useState } from 'react'
import {
  storeMessagesByChatId,
  getMessagesByChatId,
  storeBackgroundMessagesByChatId,
  getBackgroundMessagesByChatId,
  removeBackgroundMessagesByChatId,
} from '../ls-service/ls-service'

export default function useStoreMessagesHistory(
  messageOut,
  message,
  messageId,
  chatId,
  currentChat
) {
  const [history, setHistory] = useState(getMessagesByChatId(currentChat))
  const [backgroundHistory, setBackgroundHistory] = useState([])

  useEffect(() => {
    if (currentChat && history.length !== 0) {
      storeMessagesByChatId(currentChat, history)
    }
  }, [history])

  useEffect(() => {
    setHistory([...history, { text: messageOut, type: 'out' }])
  }, [messageOut])

  useEffect(() => {
    if (message !== '' && chatId !== currentChat) {
      storeBackgroundMessagesByChatId(chatId, backgroundHistory)
    }
  }, [backgroundHistory])

  useEffect(() => {
    if (getMessagesByChatId(currentChat)) {
      setHistory(getMessagesByChatId(currentChat))
      if (getBackgroundMessagesByChatId(currentChat)) {
        const back = getBackgroundMessagesByChatId(currentChat)
        setHistory((old) => [...old, ...back])
        removeBackgroundMessagesByChatId(currentChat)
        setBackgroundHistory([])
      }
    }
  }, [currentChat])

  useEffect(() => {
    if (message !== '' && chatId !== currentChat) {
      setBackgroundHistory([
        ...backgroundHistory,
        { text: message, type: 'in' },
      ])
      if (getBackgroundMessagesByChatId(chatId)) {
        const back = getBackgroundMessagesByChatId(chatId)
        setBackgroundHistory([...back, { text: message, type: 'in' }])
      }
    }

    if (message !== '' && chatId === currentChat) {
      setHistory([...history, { text: message, type: 'in' }])
    }
  }, [messageId])

  return { history }
}
