import React, {
  Dispatch,
  ReactNode,
  SetStateAction,
  createContext,
  useState,
} from "react"

type userData = {
  username: string
  email: string
}

type GlobalStateContextType = {
  navMenuIsOpen: boolean
  setNavMenuIsOpen: Dispatch<SetStateAction<boolean>>
  userIsLogged: boolean | null
  setUserIsLogged: Dispatch<SetStateAction<boolean | null>>
  userData: userData | null
  setUserData: Dispatch<SetStateAction<userData | null>>
}

export const GlobalStateContext =
  createContext<GlobalStateContextType>({} as GlobalStateContextType)

type GlobalStateProviderProps = {
  children: ReactNode
}

const GlobalStateProvider: React.FC<GlobalStateProviderProps> = ({
  children,
}: GlobalStateProviderProps) => {
  const [navMenuIsOpen, setNavMenuIsOpen] = useState<boolean>(false)
  const [userIsLogged, setUserIsLogged] = useState<boolean | null>(
    null,
  )
  const [userData, setUserData] = useState<userData | null>(null)

  return (
    <GlobalStateContext.Provider
      value={{
        navMenuIsOpen,
        setNavMenuIsOpen,
        userIsLogged,
        setUserIsLogged,
        userData,
        setUserData,
      }}
    >
      {children}
    </GlobalStateContext.Provider>
  )
}

export default GlobalStateProvider
