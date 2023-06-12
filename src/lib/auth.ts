import { getLocalStorage, removeLocalStorage, setLocalStorage } from "./utils"

const TokenKey = 'Admin-Token'

export function getToken() {
  return getLocalStorage(TokenKey)
}

export function setToken(token: string) {
  return setLocalStorage(TokenKey, token)
}

export function removeToken() {
  return removeLocalStorage(TokenKey)
}