import React, {
  Dispatch,
  ReactNode,
  SetStateAction,
  createContext,
  useEffect,
  useState,
} from "react"

type UserData = {
  username: string
  email: string
}

type UserDetails = {
  id: number
  cep: string
  adress: string
  cellphone: string
}

type GlobalStateContextType = {
  navMenuIsOpen: boolean
  setNavMenuIsOpen: Dispatch<SetStateAction<boolean>>
  userIsLogged: boolean | null
  setUserIsLogged: Dispatch<SetStateAction<boolean | null>>
  userData: UserData | null
  setUserData: Dispatch<SetStateAction<UserData | null>>
  userDetails: UserDetails | null
  setUserDetails: Dispatch<SetStateAction<UserDetails | null>>
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
  const [userData, setUserData] = useState<UserData | null>(null)
  const [userDetails, setUserDetails] = useState<UserDetails | null>(
    null,
  )

  return (
    <GlobalStateContext.Provider
      value={{
        navMenuIsOpen,
        setNavMenuIsOpen,
        userIsLogged,
        setUserIsLogged,
        userData,
        setUserData,
        userDetails,
        setUserDetails,
      }}
    >
      {children}
    </GlobalStateContext.Provider>
  )
}

export default GlobalStateProvider
