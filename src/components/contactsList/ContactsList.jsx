import ContactItem from "../contactItem/ContactItem"
import s from './ContactsList.module.css'

export default function ContactsList() {
    return (
        <div className={s.content}>
            <ContactItem title='Андрей' />
            <ContactItem title='Виктор' />
            <ContactItem title='Сергей' />
            <ContactItem title='Игорь' />
            <ContactItem title='Михаил' />
        </div>
    )
}