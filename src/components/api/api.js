import { useEffect, useState } from 'react'
import whatsAppClient from '@green-api/whatsapp-api-client'

const Auth = (id, token, setID, setToken) => {
  const [isLoading, setIsLoading] = useState(false)
  const [isError, setIsError] = useState('')
  useEffect(() => {
    ;(async () => {
      if (!id || !token) {
        return
      }
      setIsError('')
      setIsLoading(true)
      try {
        const data = await fetch(
          `https://api.green-api.com/waInstance${id}/getStateInstance/${token}`
        )
        const response = await data.json()
        if (response.stateInstance === 'authorized') {
          setID(id)
          setToken(token)
          localStorage.setItem('id', id)
          localStorage.setItem('token', token)
          setIsLoading(false)
        } else {
          setIsError(response.stateInstance)
          setIsLoading(false)
        }
      } catch (error) {
        console.error(error.message)
        setIsLoading(false)
        setIsError('Неверные данные')
      }
    })()
  }, [id, token])
  return { isLoading, isError }
}

const StartListenNotification = (idInstance, apiToken) => {
  const [message, setMessage] = useState('')
  const [messageId, setMessageId] = useState('')
  const [chatId, setChatId] = useState('')

  useEffect(() => {
    if (idInstance === '' || apiToken === '') {
      return {}
    }

    const restAPI = whatsAppClient.restAPI({
      idInstance,
      apiTokenInstance: apiToken,
    })

    ;(async () => {
      try {
        await restAPI.webhookService.startReceivingNotifications()
        restAPI.webhookService.onReceivingMessageText((body) => {
          setChatId(body.senderData.chatId)
          setMessage(body.messageData.textMessageData.textMessage)
          setMessageId(body.idMessage)
        })
      } catch (error) {
        console.error(error)
      }
    })()

    return () => {
      restAPI.webhookService.stopReceivingNotifications()
      setChatId('')
      setMessage('')
      setMessageId('')
    }
  }, [idInstance, apiToken])

  return { message, messageId, chatId }
}

const SendMessage = (idInstance, apiToken, chatId, message) => {
  ;(async () => {
    const restAPI = whatsAppClient.restAPI({
      idInstance,
      apiTokenInstance: apiToken,
    })
    try {
      const response = await restAPI.message.sendMessage(chatId, null, message)
      console.log(response.idMessage)
    } catch (error) {
      console.error(error)
    }
  })()
}

export { Auth, StartListenNotification, SendMessage }
