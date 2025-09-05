"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"

// User data by mode
const usersByMode = {
  piedmont: [
    { name: "Brent Smith", title: "President & CEO", company: "Piedmont Realty Trust" },
    { name: "Pierce Nunnery", title: "Director, Experience", company: "Piedmont Realty Trust" },
  ],
  generic: [
    { name: "Ellie Sanders", title: "", company: "Garbarino Properties" },
  ],
  ocvibe: [],
  cousins: [],
} as const;

// Default user for modes without specific users
const defaultUser = { name: "Ellie Sanders", title: "", company: "Garbarino Properties" };

export type User = typeof defaultUser;

interface UserContextType {
  selectedUser: User
  setSelectedUser: (user: User) => void
  availableUsers: User[]
  updateUserForMode: (mode: string) => void
}

const UserContext = createContext<UserContextType | undefined>(undefined)

interface UserProviderProps {
  children: ReactNode
}

export function UserProvider({ children }: UserProviderProps) {
  const [selectedUser, setSelectedUser] = useState<User>(defaultUser)
  const [currentMode, setCurrentMode] = useState<string>("generic")

  // Function to update user when mode changes
  const updateUserForMode = (mode: string) => {
    setCurrentMode(mode)
    const modeKey = mode.toLowerCase() as keyof typeof usersByMode
    const modeUsers = usersByMode[modeKey] || []
    const newUser = modeUsers[0] || defaultUser
    setSelectedUser(newUser)
  }

  // Get available users for current mode
  const getAvailableUsers = (mode: string): User[] => {
    const modeKey = mode.toLowerCase() as keyof typeof usersByMode
    const modeUsers = usersByMode[modeKey] || []
    return modeUsers.length > 0 ? [...modeUsers] : [defaultUser]
  }

  const availableUsers = getAvailableUsers(currentMode)

  const value: UserContextType = {
    selectedUser,
    setSelectedUser,
    availableUsers,
    updateUserForMode,
  }

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  )
}

export function useUser() {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider")
  }
  return context
} 