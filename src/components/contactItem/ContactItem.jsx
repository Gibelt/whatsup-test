import s from './ContactItem.module.css'

export default function ContactItem ({title}) {
    return (
        <div className={s.item}>
            <p className={s.title}>{title}</p>
        </div>
    )
}