"use client"
import { createContext, useContext, useState } from "react"

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState({ username: null, token: null })
  const [logged, setLogged] = useState(false)

  const login = async (username, password) => {
    const request = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username: username, password: password }),
    }
    const response = await fetch(`/api/gsheet/login`, request)
    let json = await response.json()
    if (json.token) {
      setLogged(true)
      setUser({ username: username, token: json.token })
    } else {
      alert("Login failed!")
    }
  }

  const logout = () => {
    setUser({ username: null, token: null })
    setLogged(false)
  }

  const authorization = () => {
    return `${user.username}:${user.token}`
  }

  const reset_password = async (new_password) => {
    const request = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: authorization(),
      },
      body: JSON.stringify({ password: new_password }),
    }

    fetch("/api/gsheet/password", request)
      .then((response) => response.json())
      .then((data) => {
        alert(data.message)
      })
      .catch((err) => console.log("Something went wrong!", err))

    logout()
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        logged,
        login,
        logout,
        authorization,
        reset_password,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
