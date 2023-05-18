import s from './Chat.module.css'

export default function Chat() {
  return (
    <div className={s.container}>
      <div className={s.messages}>
        <p className={s.in}>Привет</p>
        <p className={s.out}>Зравствуй</p>
      </div>
      <div className={s.input_content}>
        <input className={s.input} />
        <button className={s.button} type='button'>Отправить</button>
      </div>
    </div>
  )
}
