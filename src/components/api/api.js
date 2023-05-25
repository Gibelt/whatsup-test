export const storeContacts = (contacts) => {
  localStorage.setItem('contacts', JSON.stringify(contacts))
}
export const getContacts = () => JSON.parse(localStorage.getItem('contacts'))

export const storeMessagesByChatId = (chatId, messages) => {
  localStorage.setItem(chatId, JSON.stringify(messages))
}

export const getMessagesByChatId = (chatId) => JSON.parse(localStorage.getItem(chatId))

