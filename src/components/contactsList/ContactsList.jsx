/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import s from './ContactsList.module.css'

export default function ContactsList({ contacts, setChatId }) {
  const list = contacts.map((item) => (
    <div
      key={item.chatId}
      className={s.item}
      onClick={() => setChatId(item.chatId)}
    >
      <p className={s.title}>{item.chatId.split('@')[0]}</p>
    </div>
  ))
  return <div className={s.content}>{list}</div>
}
