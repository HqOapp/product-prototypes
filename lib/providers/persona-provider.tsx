"use client"

import { createContext, useContext, useState, ReactNode } from "react"

export type Persona = "Executive" | "Asset Manager" | "Property Experience Manager (PXM)" | "Investment Officer" | "Finance Controller"

interface PersonaContextType {
  currentPersona: Persona
  setPersona: (persona: Persona) => void
}

const PersonaContext = createContext<PersonaContextType | undefined>(undefined)

export function PersonaProvider({ children }: { children: ReactNode }) {
  const [currentPersona, setCurrentPersona] = useState<Persona>("Property Experience Manager (PXM)")

  const setPersona = (persona: Persona) => {
    setCurrentPersona(persona)
  }

  return (
    <PersonaContext.Provider value={{ currentPersona, setPersona }}>
      {children}
    </PersonaContext.Provider>
  )
}

export function usePersona() {
  const context = useContext(PersonaContext)
  if (context === undefined) {
    throw new Error("usePersona must be used within a PersonaProvider")
  }
  return context
} 