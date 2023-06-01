import { useState } from 'react'
import { auth } from '../../api/api'
import s from './Login.module.css'

export default function Login({ setID, setToken }) {
  const [idValue, setIdValue] = useState('')
  const [tokenValue, setTokenValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isError, setIsError] = useState('')

  const onIdInputChange = (e) => {
    setIdValue(e.target.value)
  }

  const onApiTokenInputChange = (e) => {
    setTokenValue(e.target.value)
  }

  const onEnterButtonClick = () => {
    setIsLoading(true)
    setIsError('')
    auth(idValue, tokenValue)
      .then((resp) => {
        if (resp.id && resp.token) {
          setID(resp.id)
          setToken(resp.token)
          localStorage.setItem('id', resp.id)
          localStorage.setItem('token', resp.token)
        }

        setIsError(resp.isError)
        setIsLoading(resp.isLoading)
      })
      .catch((error) => console.error('Ошибка', error.message))
  }

  return (
    <div className={s.content}>
      <h3 className={s.title}>Вход</h3>
      <div className={s.input_id}>
        <label htmlFor="idInstance">
          IdInstance:
          <input
            className={s.input}
            type="text"
            name="idInstance"
            onChange={onIdInputChange}
            value={idValue}
          />
        </label>
      </div>
      <div className={s.input_token}>
        <label htmlFor="apiToken">
          ApiTokenInstance:
          <input
            className={s.input}
            type="text"
            name="apiToken"
            onChange={onApiTokenInputChange}
            value={tokenValue}
          />
        </label>
      </div>
      <button
        type="button"
        className={s.enter_button}
        onClick={onEnterButtonClick}
      >
        Войти
      </button>
      <div className={s.status_content}>
        {isError && <p className={s.error_text}>{isError}</p>}
        {isLoading && <p className={s.loading_text}>Загрузка</p>}
      </div>
    </div>
  )
}
