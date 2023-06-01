const createUrl = (idInstance, apiTokenInstance, action) =>
  `https://api.green-api.com/waInstance${idInstance}/${action}/${apiTokenInstance}`

async function auth(id, token) {
  let isLoading
  let isError
  if (!id || !token) {
    return null
  }
  try {
    const data = await fetch(createUrl(id, token, 'getStateInstance'))
    const response = await data.json()
    if (response.stateInstance === 'authorized') {
      isLoading = false
      return { isLoading, id, token }
    }
    isError = response.stateInstance
    isLoading = false
    return { isLoading, isError }
  } catch (error) {
    console.error(error.message)
    isLoading = false
    isError = 'Неверные данные'
    return { isLoading, isError }
  }
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
    const response = await fetch(createUrl(id, apiToken, action))
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

const sendMessage = (idInstance, apiToken, chatId, message) => {
  ;(async () => {
    try {
      const response = await fetch(
        createUrl(idInstance, apiToken, 'SendMessage'),
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            chatId,
            message,
          }),
        }
      )
      if (!response.ok) {
        throw new Error('Ошибка отправки')
      }
    } catch (error) {
      console.error('Ошибка отправки:', error)
    }
  })()
}

export { auth, receiveMessage, sendMessage }
