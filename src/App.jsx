import ContactsList from './components/contactsList/ContactsList'
import Chat from './components/chat/Chat'
import s from './App.module.css'

function App() {
  return (
    <div className={s.app}>
      <div className={s.wrapper}>
        <ContactsList />
        <Chat />
      </div>
    </div>
  )
}

export default App
