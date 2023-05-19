import ContactItem from "../contactItem/ContactItem"
import s from './ContactsList.module.css'

export default function ContactsList({contacts}) {
    const list = contacts.map(name => <ContactItem key={name.toString()} title={name} />)
    return (
        <div className={s.content}>
            {list}
            <ContactItem title='Андрей' />
            <ContactItem title='Виктор' />
            <ContactItem title='Сергей' />
            <ContactItem title='Игорь' />
            <ContactItem title='Михаил' />
        </div>
    )
}