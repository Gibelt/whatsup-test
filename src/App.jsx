import { useEffect, useState } from 'react'
import ContactsList from './components/contactsList/ContactsList'
import Chat from './components/chat/Chat'
import s from './App.module.css'

const API_URL = 'https://api.green-api.com'
const idInstance = '1101822412'
const apiTokenInstance = 'bb34a807e25144949d7de8d43cc10c33e19698bdc4d24bc8bf'

function App() {
  const [contacts, setContacts] = useState([])
  const [message, setMessage] = useState('')
  const [chatID, setChatID] = useState('')

  useEffect(() => {
   const interval = setInterval(() => fetch(
      `${API_URL}/waInstance${idInstance}/ReceiveNotification/${apiTokenInstance}`
    )
      .then((resp) => resp.json())
      .then((data) => {
        setChatID(data.body.senderData.chatId)
        setContacts([...contacts, data.body.senderData.chatName])
        setMessage(data.body.messageData.textMessageData.textMessage)
        fetch(`${API_URL}/waInstance${idInstance}/deleteNotification/${apiTokenInstance}/${data.receiptId}`, {
          method: 'DELETE'
        })
      }).catch(e => {console.log('error', e.message)}), 5000)
      return () => {
        clearInterval(interval)
      }
  }
  , [])
  return (
    <div className={s.app}>
      <div className={s.wrapper}>
        <ContactsList contacts={contacts} />
        <Chat message={message} chatID={chatID} />
      </div>
    </div>
  )
}

export default App
