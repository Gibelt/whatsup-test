import { useState, useEffect, useRef } from 'react'
import { sendMessage } from '../../api/api'
import s from './Chat.module.css'

export default function Chat({
  idInstance,
  apiToken,
  currentChat,
  history,
  setHistory,
}) {
  const [textValue, setTextValue] = useState('')
  const [isDisabled, setIsDisabled] = useState(true)
  const divRef = useRef(null)
  const textInput = useRef(null)

  const onInputChange = (e) => {
    setTextValue(e.target.value)
  }

  const onSendButtonClick = () => {
    setHistory((oldValue) => {
      if (Object.keys(oldValue).includes(currentChat)) {
        return {
          ...oldValue,
          [currentChat]: [
            ...oldValue[currentChat],
            {
              type: 'out',
              text: textValue,
              id: crypto.randomUUID(),
            },
          ],
        }
      }
      return {
        ...oldValue,
        [currentChat]: [
          {
            type: 'out',
            text: textValue,
            id: crypto.randomUUID(),
          },
        ],
      }
    })
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
    history.map((item) => (
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
