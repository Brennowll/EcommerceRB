import { useContext } from "react"
import { Link } from "react-router-dom"
import Cookies from "js-cookie"
import { GlobalStateContext } from "../../store/GlobalStateProvider"

type AuthLinksProps = {
  containerClass: string
}

const AuthLinks = (props: AuthLinksProps) => {
  const { userIsLogged } = useContext(GlobalStateContext)

  const logout = () => {
    Cookies.remove("access_token")
    Cookies.remove("refresh_token")
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
        <a href="pecas">
          <button
            className="text-center font-bauhausRegular
          hover:underline"
            onClick={logout}
          >
            Sair
          </button>
        </a>
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
