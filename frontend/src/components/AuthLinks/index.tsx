import { useContext } from "react"
import { Link } from "react-router-dom"
import Cookies from "js-cookie"
import { GlobalStateContext } from "../../store/GlobalStateProvider"
import { useMutation } from "react-query"
import { api } from "../../store/QueryClient"

type AuthLinksProps = {
  containerClass: string
}

const AuthLinks = (props: AuthLinksProps) => {
  const { userIsLogged } = useContext(GlobalStateContext)

  const { mutate } = useMutation({
    mutationFn: async () => {
      const response = await api.post("logout/")
      return response.data
    },
    onSuccess: () => {
      window.location.href = "pecas"
    },
  })

  const handleLogoutClick = () => {
    mutate()
  }

  const renderLoginLinks = () => {
    return (
      <>
        <Link
          to={"/login"}
          className="font-bauhausRegular hover:underline"
        >
          Cadastre-se
        </Link>
        <Link
          to={"/login"}
          className="font-bauhausRegular hover:underline"
        >
          Iniciar-sessão
        </Link>
      </>
    )
  }

  const renderProfileLink = () => {
    return (
      <>
        <Link
          to={"/perfil"}
          className="text-center font-bauhausRegular
          hover:underline"
        >
          Perfil <br />
          Pedidos
        </Link>
        <button
          className="text-center font-bauhausRegular
          hover:underline"
          onClick={handleLogoutClick}
        >
          Sair
        </button>
      </>
    )
  }

  return (
    <div
      className={`items-center justify-center ${props.containerClass}`}
    >
      {userIsLogged ? renderProfileLink() : renderLoginLinks()}
    </div>
  )
}

export default AuthLinks
