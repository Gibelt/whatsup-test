import whatsAppClient from '@green-api/whatsapp-api-client'
import { useEffect, useState } from 'react'
import ContactsList from './components/contactsList/ContactsList'
import Chat from './components/chat/Chat'
import Login from './components/login/Login'
import s from './App.module.css'

function App() {
  const [contacts, setContacts] = useState(
    JSON.parse(localStorage.getItem('contacts')) || []
  )
  const [message, setMessage] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [chatId, setChatId] = useState('')
  const [idInstance, setIdInstance] = useState(localStorage.getItem('id') || '')
  const [apiToken, setApiToken] = useState(localStorage.getItem('token') || '')

  const onExitButtonClick = () => {
    setIdInstance('')
    setApiToken('')
    localStorage.removeItem('id')
    localStorage.removeItem('token')
  }

  const onPnoneNumbetInputChange = (e) => {
    setPhoneNumber(e.target.value)
  }

  const onStartChatButtonClick = () => {
    setChatId(`${phoneNumber}@c.us`)
    setContacts((old) =>
      [
        ...old,
        {
          chatId: `${phoneNumber}@c.us`,
          chatName: '',
        },
      ].reduce((o, i) => {
        if (!o.find((v) => v.chatId === i.chatId)) {
          o.push(i)
        }
        return o
      }, [])
    )
  }

  useEffect(() => {
    localStorage.setItem('contacts', JSON.stringify(contacts))
  }, [contacts])

  useEffect(() => {
    if (idInstance === '' || apiToken === '') {
      return
    }
    ;(async () => {
      const restAPI = whatsAppClient.restAPI({
        idInstance,
        apiTokenInstance: apiToken,
      })

      try {
        await restAPI.webhookService.startReceivingNotifications()
        restAPI.webhookService.onReceivingMessageText((body) => {
          setChatId(body.senderData.chatId)
          setMessage(body.messageData.textMessageData.textMessage)
          setContacts((old) =>
            [
              ...old,
              {
                chatId: body.senderData.chatId,
                chatName: body.senderData.chatName,
              },
            ].reduce((o, i) => {
              if (!o.find((v) => v.chatId === i.chatId)) {
                o.push(i)
              }
              return o
            }, [])
          )
        })
      } catch (error) {
        console.error(error)
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
                <button type="button" onClick={onStartChatButtonClick}>
                  Начать
                </button>
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
              <ContactsList contacts={contacts} setChatId={setChatId} />
              <Chat
                message={message}
                chatID={chatId}
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
