import { useState } from 'react'
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
    ;(async () => {
      setIsError('')
      setIsLoading(true)
      try {
        const data = await fetch(
          `https://api.green-api.com/waInstance${idValue}/getStateInstance/${tokenValue}`
        )
        const response = await data.json()
        if (response.stateInstance === 'authorized') {

          setID(idValue)
          setToken(tokenValue)
          localStorage.setItem('id', idValue)
          localStorage.setItem('token', tokenValue)
          setIsLoading(false)
        } else {
          setIsError(response.stateInstance)
          setIsLoading(false)
        }
      } catch (error) {
        console.error(error.message)
        setIsLoading(false)
        setIsError('Неверные данные')
      }
    })()
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
