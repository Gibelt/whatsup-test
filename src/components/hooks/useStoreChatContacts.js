import { useEffect, useState } from 'react'
import _ from 'lodash'
import { storeContacts, getContacts } from '../../ls-service/ls-service'

export default function useStoreChatContacts(idIn, idOut, name = '') {
  const [contacts, setContacts] = useState(getContacts() || [])

  useEffect(() => {
    storeContacts(contacts)
  }, [contacts])

  useEffect(() => {
    if (!idIn) {
      return
    }
    setContacts((old) =>
      _.unionBy(
        [
          ...old,
          {
            chatId: idIn,
            chatName: name,
          },
        ],
        'chatId'
      )
    )
  }, [idIn])

  useEffect(() => {
    if (!idOut) {
      return
    }
    setContacts((old) =>
      _.unionBy(
        [
          ...old,
          {
            chatId: idOut,
            chatName: name,
          },
        ],
        'chatId'
      )
    )
  }, [idOut])

  return { contacts }
}
