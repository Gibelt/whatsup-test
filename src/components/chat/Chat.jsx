/* eslint-disable react/no-array-index-key */
import { useState, useEffect, useRef } from 'react'
import {
  storeMessagesByChatId,
  getMessagesByChatId,
  storeBackgroundMessagesByChatId,
  getBackgroundMessagesByChatId,
  removeBackgroundMessagesByChatId
} from '../api/api'
import s from './Chat.module.css'

const API_URL = 'https://api.green-api.com'

export default function Chat({
  message,
  messageId,
  chatID,
  idInstance,
  apiToken,
  currentChat,
}) {
  const [history, setHistory] = useState(getMessagesByChatId(currentChat))
  const [backgroundHistory, setBackgroundHistory] = useState([])
  const [textValue, setTextValue] = useState('')
  const [isDisabled, setIsDisabled] = useState(true)
  const divRef = useRef(null)

  const onInputChange = (e) => {
    setTextValue(e.target.value)
  }

  const onSendButtonClick = () => {
    setHistory([...history, { text: textValue, type: 'out' }])
    setTextValue('')
    fetch(`${API_URL}/waInstance${idInstance}/SendMessage/${apiToken}`, {
      method: 'POST',
      body: JSON.stringify({
        chatId: currentChat,
        message: textValue,
      }),
    })
      .then((resp) => resp.json())
      .then((data) => {
        console.log(data)
      })
      .catch((e) => console.error(e.message))
  }

  useEffect(() => {
    if (message !== '' && chatID !== currentChat) {
      storeBackgroundMessagesByChatId(chatID, backgroundHistory)
    }
  }, [backgroundHistory])

  useEffect(() => {
    divRef.current.scrollIntoView()
    if (currentChat && history.length !== 0) {
      storeMessagesByChatId(currentChat, history)
    }
  }, [history])

  useEffect(() => {
    setTextValue('')
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
    if (!currentChat || !textValue) {
      setIsDisabled(true)
    } else {
      setIsDisabled(false)
    }
  }, [textValue])

  useEffect(() => {
    if (message !== '' && chatID !== currentChat) {
      setBackgroundHistory([...backgroundHistory, { text: message, type: 'in' }])
      if (getBackgroundMessagesByChatId(chatID)) {
        const back = getBackgroundMessagesByChatId(chatID)
        setBackgroundHistory([...back, { text: message, type: 'in' }])
      }
    }
    if (message !== '' && chatID === currentChat) {
      setHistory([...history, { text: message, type: 'in' }])
    }
  }, [messageId])

  const list =
    history.map((item, index) => (
      <p key={index} className={s[item.type]}>
        {item.text}
      </p>
    )) || []

  return (
    <div className={s.container}>
      <div className={s.messages}>
        {list}
        <div ref={divRef} />
      </div>
      <div className={s.input_content}>
        <input className={s.input} onChange={onInputChange} value={textValue} />
        <button
          className={s.button}
          type="button"
          onClick={onSendButtonClick}
          disabled={isDisabled}
        >
          Отправить
        </button>
      </div>
    </div>
  )
}
