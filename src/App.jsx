import { useState, useEffect } from 'react'
import { receiveMessage } from './api/api'
import ContactsList from './components/contactsList/ContactsList'
import Chat from './components/chat/Chat'
import Login from './components/login/Login'
import Header from './components/header/Header'
import s from './App.module.css'

function App() {
  const [currentChat, setCurrentChat] = useState('')
  const [idInstance, setIdInstance] = useState(localStorage.getItem('id') || '')
  const [apiToken, setApiToken] = useState(localStorage.getItem('token') || '')
  const [history, setHistory] = useState(
    JSON.parse(localStorage.getItem('history')) || {}
  )

  let isRequestPending = false

  function handleReceiveMessage() {
    if (!isRequestPending) {
      isRequestPending = true
      receiveMessage('ReceiveNotification', idInstance, apiToken)
        .then((data) => {
          if (!data) {
            isRequestPending = false
            return
          }
          setHistory((oldValue) => {
            if (Object.keys(oldValue).includes(data.senderId)) {
              return {
                ...oldValue,
                [data.senderId]: [
                  ...oldValue[data.senderId],
                  {
                    type: 'in',
                    text: data.textMessage,
                    id: crypto.randomUUID(),
                  },
                ],
              }
            }
            return {
              ...oldValue,
              [data.senderId]: [
                {
                  type: 'in',
                  text: data.textMessage,
                  id: crypto.randomUUID(),
                },
              ],
            }
          })
          // setMessage(data.textMessage)
          // setChatIdIn(data.senderId)
          // setMessageId(data.messId)
        })
        .catch((error) => {
          isRequestPending = false
          console.error('Ошибка при получении сообщения:', error)
        })
        .finally(() => {
          isRequestPending = false
        })
    }
  }

  useEffect(() => {
    let intervalId
    if (idInstance !== '' || apiToken !== '') {
      intervalId = setInterval(handleReceiveMessage, 5000)
    }

    return () => {
      clearInterval(intervalId)
    }
  }, [idInstance, apiToken])

  useEffect(() => {
    localStorage.setItem('history', JSON.stringify(history))
  }, [history])

  return (
    <div className={s.app}>
      <div className={s.wrapper}>
        {idInstance === '' || apiToken === '' ? (
          <Login setID={setIdInstance} setToken={setApiToken} />
        ) : (
          <div className={s.container}>
            <Header
              setIdInstance={setIdInstance}
              setApiToken={setApiToken}
              setCurrentChat={setCurrentChat}
              history={history}
              setHistory={setHistory}
            />
            <div className={s.content}>
              <ContactsList
                setCurrentChat={setCurrentChat}
                currentChat={currentChat}
                contacts={Object.keys(history)}
              />
              <Chat
                history={history[currentChat] || []}
                setHistory={setHistory}
                currentChat={currentChat}
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
