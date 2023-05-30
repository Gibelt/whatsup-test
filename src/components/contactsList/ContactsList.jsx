import storeChatContacts from '../hooks/useStoreChatContacts'
import s from './ContactsList.module.css'

export default function ContactsList({
  userChatId,
  chatId,
  setCurrentChat,
  currentChat,
}) {
  const { contacts } = storeChatContacts(chatId, userChatId)
  const onKeyDownHandler = (e, id) => {
    if (e.keyCode === 13) {
      setCurrentChat(id)
    }
  }
  const list = contacts.map((contact) => (
    <div
      key={contact.chatId}
      className={
        currentChat === contact.chatId
          ? `${s.contact} ${s.active}`
          : `${s.contact}`
      }
      onClick={() => setCurrentChat(contact.chatId)}
      onKeyDown={() => onKeyDownHandler(contact.chatId)}
      role="presentation"
    >
      <p className={s.contact_title}>{contact.chatId.split('@')[0]}</p>
    </div>
  ))

  return <div className={s.content}>{list}</div>
}
