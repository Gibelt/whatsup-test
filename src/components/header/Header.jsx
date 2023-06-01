import { useState } from 'react'
import s from './Header.module.css'

export default function Header({
  setIdInstance,
  setApiToken,
  setCurrentChat,
  setHistory,
}) {
  const [phoneNumber, setPhoneNumber] = useState('')

  const onExitButtonClick = () => {
    setIdInstance('')
    setApiToken('')
    localStorage.removeItem('id')
    localStorage.removeItem('token')
    setHistory({})
    localStorage.removeItem('history')
  }

  const onPnoneNumbetInputChange = (e) => {
    setPhoneNumber(e.target.value)
  }

  const onStartChatButtonClick = () => {
    setCurrentChat(`${phoneNumber}@c.us`)
    setPhoneNumber('')
    setHistory((oldValue) => {
      if (Object.keys(oldValue).includes(`${phoneNumber}@c.us`)) {
        return {
          ...oldValue,
          [`${phoneNumber}@c.us`]: [...oldValue[`${phoneNumber}@c.us`]],
        }
      }
      return {
        ...oldValue,
        [`${phoneNumber}@c.us`]: [],
      }
    })
  }

  return (
    <div className={s.header}>
      <div className={s.phone_input_content}>
        <label htmlFor="phone-number" className={s.input_label}>
          Введите номер чтобы начать чат:
          <input
            className={s.phone_input}
            type="number"
            name="phone-number"
            value={phoneNumber}
            onChange={onPnoneNumbetInputChange}
          />
        </label>
        <button
          type="button"
          className={s.start_button}
          onClick={onStartChatButtonClick}
        >
          Начать
        </button>
      </div>
      <button
        type="button"
        className={s.exit_button}
        onClick={onExitButtonClick}
      >
        Выйти
      </button>
    </div>
  )
}
