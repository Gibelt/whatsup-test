/* eslint-disable react/no-array-index-key */
import { useState, useEffect } from 'react'
import s from './Chat.module.css'

const API_URL = 'https://api.green-api.com'

export default function Chat({ message, chatID, idInstance, apiToken }) {
  const [history, setHistory] = useState([])
  const [textValue, setTextValue] = useState('')

  const onInputChange = (e) => {
    setTextValue(e.target.value)
  }

  const onSendButtonClick = () => {
    setHistory([...history, { text: textValue, type: 'out' }])
    setTextValue('')
    fetch(`${API_URL}/waInstance${idInstance}/SendMessage/${apiToken}`, {
      method: 'POST',
      body: JSON.stringify({
        chatId: chatID,
        message: textValue,
      }),
    })
      .then((resp) => resp.json())
      .then((data) => {
        console.log(data)
      })
      .catch((e) => console.log(e.message))
  }

  useEffect(() => {
    localStorage.setItem(chatID, JSON.stringify(history))
  }, [history])

  useEffect(() => {
    if (JSON.parse(localStorage.getItem(chatID))) {
      setHistory(JSON.parse(localStorage.getItem(chatID)))
    } else {
      setHistory([])
    }
  }, [chatID])

  useEffect(() => {
    setHistory([...history, { text: message, type: 'in' }])
  }, [message])

  const list =
    history.map((item, index) => (
      <p key={index} className={s[item.type]}>
        {item.text}
      </p>
    )) || []

  return (
    <div className={s.container}>
      <div className={s.messages}>{list}</div>
      <div className={s.input_content}>
        <input className={s.input} onChange={onInputChange} value={textValue} />
        <button className={s.button} type="button" onClick={onSendButtonClick}>
          Отправить
        </button>
      </div>
    </div>
  )
}
