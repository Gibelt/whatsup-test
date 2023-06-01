import s from './ContactsList.module.css'

export default function ContactsList({
  setCurrentChat,
  currentChat,
  contacts,
}) {
  const onKeyDownHandler = (e, id) => {
    if (e.keyCode === 13) {
      setCurrentChat(id)
    }
  }
  const list = contacts.map((contact) => (
    <div
      key={contact}
      className={
        currentChat === contact ? `${s.contact} ${s.active}` : `${s.contact}`
      }
      onClick={() => setCurrentChat(contact)}
      onKeyDown={() => onKeyDownHandler(contact)}
      role="presentation"
    >
      <p className={s.contact_title}>{contact.split('@')[0]}</p>
    </div>
  ))

  return <div className={s.content}>{list}</div>
}
