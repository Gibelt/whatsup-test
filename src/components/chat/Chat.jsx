import { useState, useEffect, useRef } from 'react'
import useStoreMessagesHistory from '../hooks/useStoreMessagesHistory'
import { sendMessage } from '../../api/api'
import s from './Chat.module.css'

export default function Chat({
  message,
  messageId,
  chatId,
  idInstance,
  apiToken,
  currentChat,
}) {
  const [textValue, setTextValue] = useState('')
  const [messageOut, setMessageOut] = useState('')
  const [isDisabled, setIsDisabled] = useState(true)
  const divRef = useRef(null)
  const textInput = useRef(null)
  const { history } = useStoreMessagesHistory(
    messageOut,
    message,
    messageId,
    chatId,
    currentChat
  )

  const onInputChange = (e) => {
    setTextValue(e.target.value)
  }

  const onSendButtonClick = () => {
    setMessageOut(textValue)
    setTextValue('')
    sendMessage(idInstance, apiToken, currentChat, textValue)
  }

  const onEnterKeyPress = (e) => {
    if (!e.shiftKey && e.keyCode === 13) {
      onSendButtonClick()
    }
  }

  useEffect(() => {
    setTextValue('')
    divRef.current.scrollIntoView()
    textInput.current.focus()
  }, [currentChat, history])

  useEffect(() => {
    if (!currentChat || !textValue) {
      setIsDisabled(true)
    } else {
      setIsDisabled(false)
    }
  }, [textValue])

  const list =
    history.map(item => (
      <p key={item.id} className={s[item.type]}>
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
        <input
          className={s.input}
          onChange={onInputChange}
          value={textValue}
          ref={textInput}
          onKeyDown={onEnterKeyPress}
        />
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
