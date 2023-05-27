import whatsAppClient from '@green-api/whatsapp-api-client'
import { useEffect, useState } from 'react'
import _ from 'lodash'
import { storeContacts, getContacts } from './components/api/api'
import ContactsList from './components/contactsList/ContactsList'
import Chat from './components/chat/Chat'
import Login from './components/login/Login'
import s from './App.module.css'

function App() {
  const [contacts, setContacts] = useState(getContacts() || [])
  const [message, setMessage] = useState('')
  const [messageId, setMessageId] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [currentChat, setCurrentChat] = useState('')
  const [chatId, setChatId] = useState('')
  const [idInstance, setIdInstance] = useState(localStorage.getItem('id') || '')
  const [apiToken, setApiToken] = useState(localStorage.getItem('token') || '')

  const setAndFilterContacts = (id, name = '') => {
    setContacts((old) =>
      _.unionBy(
        [
          ...old,
          {
            chatId: id.includes('@') ? id : `${id}@c.us`,
            chatName: name,
          },
        ],
        'chatId'
      )
    )
  }

  const onExitButtonClick = () => {
    setIdInstance('')
    setApiToken('')
    localStorage.removeItem('id')
    localStorage.removeItem('token')
    getContacts().map((contact) => localStorage.removeItem(contact.chatId))
    localStorage.removeItem('contacts')
    setContacts([])
    setChatId('')
    setMessage('')
    setMessageId('')
  }

  const onPnoneNumbetInputChange = (e) => {
    setPhoneNumber(e.target.value)
  }

  const onStartChatButtonClick = () => {
    setChatId(`${phoneNumber}@c.us`)
    setAndFilterContacts(phoneNumber)
    setCurrentChat(`${phoneNumber}@c.us`)
    setPhoneNumber('')
  }

  useEffect(() => {
    storeContacts(contacts)
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
          console.log(body)
          setChatId(body.senderData.chatId)
          setMessage(body.messageData.textMessageData.textMessage)
          setMessageId(body.idMessage)
          setAndFilterContacts(body.senderData.chatId, body.senderData.chatName)
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
            <div className={s.content}>
              <ContactsList
                contacts={contacts}
                setCurrentChat={setCurrentChat}
                currentChat={currentChat}
              />
              <Chat
                currentChat={currentChat}
                setMessage={setMessage}
                message={message}
                messageId={messageId}
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
