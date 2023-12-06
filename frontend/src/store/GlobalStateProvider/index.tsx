import React, {
  Dispatch,
  ReactNode,
  SetStateAction,
  createContext,
  useState,
} from "react"

interface GlobalStateContextType {
  navMenuIsOpen: boolean
  setNavMenuIsOpen: Dispatch<SetStateAction<boolean>>
}

export const GlobalStateContext =
  createContext<GlobalStateContextType>({} as GlobalStateContextType)

interface GlobalStateProviderProps {
  children: ReactNode
}

const GlobalStateProvider: React.FC<GlobalStateProviderProps> = ({
  children,
}: GlobalStateProviderProps) => {
  const [navMenuIsOpen, setNavMenuIsOpen] = useState<boolean>(false)

  return (
    <GlobalStateContext.Provider
      value={{
        navMenuIsOpen,
        setNavMenuIsOpen,
      }}
    >
      {children}
    </GlobalStateContext.Provider>
  )
}

export default GlobalStateProvider
