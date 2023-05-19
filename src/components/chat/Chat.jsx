import { useState, useEffect } from 'react'
import s from './Chat.module.css'

const API_URL = 'https://api.green-api.com'
const idInstance = '1101822412'
const apiTokenInstance = 'bb34a807e25144949d7de8d43cc10c33e19698bdc4d24bc8bf'

export default function Chat({message, chatID}) {
  const [history, setHistory] = useState([])
  const [textValue, setTextValue] = useState('')

  const onInputChange = (e) => {
    setTextValue(e.target.value)
  }

  const onSendButtonClick = () => {
    setHistory([...history, {text: textValue,
      type: "out",
    }])
    setTextValue('')
    fetch(
      `${API_URL}/waInstance${idInstance}/SendMessage/${apiTokenInstance}`,
      {
        method: "POST",
        body: JSON.stringify({ 
          chatId: chatID,
          message: textValue
         })
      }
    )
      .then((resp) => resp.json())
      .then((data) => {
        console.log(data)
      }).catch(e => console.log(e.message))
  }

  useEffect(() => {
    setHistory([...history, {text: message,
      type: "in",
    }])
    return (() => {
      window.localStorage.setItem('history', history)
    })
  }, [message])

  const list = history.map(item => <p key={item.text.toString()} className={s[item.type]}>{item.text}</p>)

  return (
    <div className={s.container}>
      <div className={s.messages}>
        {list}
        <p className={s.in}>Привет</p>
        <p className={s.out}>Зравствуй</p>
      </div>
      <div className={s.input_content}>
        <input className={s.input} onChange={onInputChange} value={textValue} />
        <button className={s.button} type='button' onClick={onSendButtonClick}>Отправить</button>
      </div>
    </div>
  )
}
