import whatsAppClient from '@green-api/whatsapp-api-client'
import { useEffect, useState } from 'react'
import ContactsList from './components/contactsList/ContactsList'
import Chat from './components/chat/Chat'
import Login from './components/login/Login'
import s from './App.module.css'

function App() {
  const [message, setMessage] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [idInstance, setIdInstance] = useState('')
  const [apiToken, setApiToken] = useState('')

  const onExitButtonClick = () => {
    setIdInstance('')
    setApiToken('')
  }

  const onPnoneNumbetInputChange = (e) => {
    setPhoneNumber(e.target.value)
  }

  useEffect(() => {
    if (idInstance === '' || apiToken === '') return
    ;(async () => {

      const restAPI = whatsAppClient.restAPI({
        idInstance,
        apiTokenInstance: apiToken,
      })

      try {
        await restAPI.webhookService.startReceivingNotifications()
        restAPI.webhookService.onReceivingMessageText((body) => {
          setMessage(body.messageData.textMessageData.textMessage)
        })
      } catch (ex) {
        console.log('er', ex.toString())
      }
    })()
  }, [idInstance, apiToken])
  return (
    <div className={s.app}>
      <div className={s.wrapper}>
        {idInstance === '' || apiToken === '' ? (
          <Login setID={setIdInstance} setToken={setApiToken} />
        ) : (
          <div className={s.container}>
            <div className={s.header}>
              <div className={s.input_number}>
                <label htmlFor="phone-number">
                  Введите номер чтобы начать чат:
                  <input
                    className={s.phone_input}
                    type="number"
                    name="phone-number"
                    value={phoneNumber}
                    onChange={onPnoneNumbetInputChange}
                  />
                </label>
              </div>
              <button
                type="button"
                className="exit_button"
                onClick={onExitButtonClick}
              >
                Выйти
              </button>
            </div>
            <div className={s.content}>
              <ContactsList contacts={phoneNumber} />
              <Chat
                message={message}
                chatID={phoneNumber}
                idInstance={idInstance}
                apiToken={apiToken}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default App
