import { useEffect, useState } from 'react'
import ContactsList from './components/contactsList/ContactsList'
import Chat from './components/chat/Chat'
import Login from './components/login/Login'
import s from './App.module.css'

const API_URL = 'https://api.green-api.com'

function App() {
  const [contacts, setContacts] = useState([])
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
    let interval = ''
    if (idInstance !== '' && apiToken !== '') {
      interval = setInterval(
        () =>
          fetch(
            `${API_URL}/waInstance${idInstance}/ReceiveNotification/${apiToken}`
          )
            .then((resp) => resp.json())
            .then((data) => {
              if (data.body.messageData.typeMessage === 'textMessage') {
                setContacts([...contacts, data.body.senderData.chatName])
                setMessage(data.body.messageData.textMessageData.textMessage)
              } else {
                setContacts([...contacts, data.body.senderData.chatName])
                setMessage(data.body.messageData.typeMessage)
              }
              return data
            })
            .then((data) => {
              fetch(
                `${API_URL}/waInstance${idInstance}/deleteNotification/${apiToken}/${data.receiptId}`,
                {
                  method: 'DELETE',
                }
              )
            })
            .catch((e) => {
              console.log(e.message)
            }),
        5000
      )
    }
    return () => {
      clearInterval(interval)
    }
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
