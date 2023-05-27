export const storeContacts = (contacts) =>
  localStorage.setItem('contacts', JSON.stringify(contacts))

export const getContacts = () => JSON.parse(localStorage.getItem('contacts'))

export const storeMessagesByChatId = (chatId, messages) =>
  localStorage.setItem(chatId, JSON.stringify(messages))

export const storeBackgroundMessagesByChatId = (chatId, messages) =>
  localStorage.setItem(`back/${chatId}`, JSON.stringify(messages))

export const getBackgroundMessagesByChatId = (chatId) =>
  JSON.parse(localStorage.getItem(`back/${chatId}`)) || []

export const getMessagesByChatId = (chatId) =>
  JSON.parse(localStorage.getItem(chatId)) || []

export const removeBackgroundMessagesByChatId = (chatId) =>
  localStorage.removeItem(`back/${chatId}`)
