/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import s from './ContactsList.module.css'

export default function ContactsList({
  contacts,
  setCurrentChat,
  currentChat,
}) {
  const list = contacts.map((contact) => (
    <div
      key={contact.chatId}
      className={
        currentChat === contact.chatId
          ? `${s.contact} ${s.active}`
          : `${s.contact}`
      }
      onClick={() => setCurrentChat(contact.chatId)}
    >
      <p className={s.contact_title}>{contact.chatId.split('@')[0]}</p>
    </div>
  ))

  return <div className={s.content}>{list}</div>
}
