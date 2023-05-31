import { useState } from 'react'
import { getContacts } from '../../ls-service/ls-service'
import s from './Header.module.css'

export default function Header({
  setUserChatId,
  setIdInstance,
  setApiToken,
  setCurrentChat,
}) {
  const [phoneNumber, setPhoneNumber] = useState('')

  const onExitButtonClick = () => {
    setIdInstance('')
    setApiToken('')
    localStorage.removeItem('id')
    localStorage.removeItem('token')
    setUserChatId('')
    getContacts().forEach((contact) => localStorage.removeItem(contact.chatId))
    localStorage.removeItem('contacts')
  }

  const onPnoneNumbetInputChange = (e) => {
    setPhoneNumber(e.target.value)
  }

  const onStartChatButtonClick = () => {
    setUserChatId(`${phoneNumber}@c.us`)
    setCurrentChat(`${phoneNumber}@c.us`)
    setPhoneNumber('')
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
