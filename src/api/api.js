import { useEffect, useState } from 'react'

const URL = (idInstance, apiTokenInstance, action) =>
  `https://api.green-api.com/waInstance${idInstance}/${action}/${apiTokenInstance}`

const auth = (id, token, setID, setToken) => {
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

async function deleteNotification(idInstance, apiTokenInstance, receiptId) {
  try {
    const deleteUrl = `https://api.green-api.com/waInstance${idInstance}/DeleteNotification/${apiTokenInstance}/${receiptId}`

    const response = await fetch(deleteUrl, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error('Ошибка запроса на удаление уведомления')
    }
  } catch (error) {
    console.error('Ошибка:', error)
  }
}

async function receiveMessage(action, id, apiToken) {
  let responseData
  try {
    const response = await fetch(URL(id, apiToken, action))
    if (!response.ok) {
      throw new Error('Ошибка запроса на получение уведомлений')
    }
    responseData = await response.json()
    if (
      responseData &&
      responseData.body.typeWebhook === 'incomingMessageReceived'
    ) {
      const textMessage =
        responseData.body.messageData?.textMessageData?.textMessage
      const senderId = responseData.body.senderData?.chatId
      const messId = responseData.body.idMessage

      return { textMessage, senderId, messId }
    }
  } catch (error) {
    console.error('Ошибка ReceiveMessage:', error)
  } finally {
    if (responseData) {
      const { receiptId } = responseData
      await deleteNotification(id, apiToken, receiptId)
    }
  }
  return null
}

const startListenNotification = (idInstance, apiToken) => {
  const [message, setMessage] = useState('')
  const [messageId, setMessageId] = useState('')
  const [chatId, setChatId] = useState('')

  let isRequestPending = false

  function handleReceiveMessage() {
    if (!isRequestPending) {
      isRequestPending = true
      receiveMessage('ReceiveNotification', idInstance, apiToken)
        .then((data) => {
          if (!data) {
            isRequestPending = false
            return
          }
          setMessage(data.textMessage)
          setChatId(data.senderId)
          setMessageId(data.messId)
        })
        .catch((error) => {
          isRequestPending = false
          console.error('Ошибка при получении сообщения:', error)
        })
        .finally(() => {
          isRequestPending = false
        })
    }
  }

  useEffect(() => {
    let intervalId
    if (idInstance !== '' || apiToken !== '') {
      intervalId = setInterval(handleReceiveMessage, 5000)
    }

    return () => {
      clearInterval(intervalId)
      setChatId('')
      setMessage('')
      setMessageId('')
    }
  }, [idInstance, apiToken])

  return { message, messageId, chatId }
}

const sendMessage = (idInstance, apiToken, chatId, message) => {
  ;(async () => {
    try {
      const response = await fetch(URL(idInstance, apiToken, 'SendMessage'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chatId,
          message,
        }),
      })
      if (!response.ok) {
        throw new Error('Ошибка отправки')
      }
    } catch (error) {
      console.error('Ошибка отправки:', error)
    }
  })()
}

export { auth, startListenNotification, sendMessage }
