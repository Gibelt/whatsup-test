import { useState } from 'react'
import { startListenNotification } from './api/api'
import ContactsList from './components/contactsList/ContactsList'
import Chat from './components/chat/Chat'
import Login from './components/login/Login'
import Header from './components/header/Header'
import s from './App.module.css'

function App() {
  const [currentChat, setCurrentChat] = useState('')
  const [idInstance, setIdInstance] = useState(localStorage.getItem('id') || '')
  const [apiToken, setApiToken] = useState(localStorage.getItem('token') || '')
  const [userChatId, setUserChatId] = useState('')
  const { message, messageId, chatId } = startListenNotification(
    idInstance,
    apiToken
  )

  return (
    <div className={s.app}>
      <div className={s.wrapper}>
        {idInstance === '' || apiToken === '' ? (
          <Login setID={setIdInstance} setToken={setApiToken} />
        ) : (
          <div className={s.container}>
            <Header
              setUserChatId={setUserChatId}
              setIdInstance={setIdInstance}
              setApiToken={setApiToken}
              setCurrentChat={setCurrentChat}
            />
            <div className={s.content}>
              <ContactsList
                userChatId={userChatId}
                chatId={chatId}
                setCurrentChat={setCurrentChat}
                currentChat={currentChat}
              />
              <Chat
                currentChat={currentChat}
                message={message}
                messageId={messageId}
                chatId={chatId}
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
