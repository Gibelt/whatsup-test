import { useState } from 'react'
import s from './Login.module.css'

export default function Login({setID, setToken}) {
    const [idValue, setIdValue] = useState('')
    const [tokenValue, setTokenValue] = useState('')

    const onIdInputChange = (e) => {
        setIdValue(e.target.value)
    }

    const onITokenInputChange = (e) => {
        setTokenValue(e.target.value)
    }

    const onEnterButtonClick = () => {
        setID(idValue)
        setToken(tokenValue)
    }

  return (
    <div className={s.content}>
      <h3>Вход</h3>
      <div className={s.input_id}>
        <label htmlFor="idInstance">
          IdInstance:
          <input type='number' name="idInstance" onChange={onIdInputChange} value={idValue} />
        </label>
      </div>
      <div className={s.input_token}>
        <label htmlFor="apiToken">
          ApiTokenInstance:
          <input type='text' name="apiToken" onChange={onITokenInputChange} value={tokenValue} />
        </label>
      </div>
      <button type='button' onClick={onEnterButtonClick}>Войти</button>
    </div>
  )
}
