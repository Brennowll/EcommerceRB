import { useContext } from "react"
import { Link, useLocation } from "react-router-dom"
import { ProductsContext } from "../../store/ProductsProvider"

type Props = {
  buttonParams?: string
  isRadio?: boolean
  name: string
  onClick?: () => void
  isCategoryButton?: boolean
  isLink?: boolean
  link?: string
}

const Button = (props: Props) => {
  const { setCategoryForApi } = useContext(ProductsContext)
  const centeringIfRadio = props.isRadio ? `pl-2 ` : `justify-center `

  const linkToSelect = props.link
    ? props.link
    : props.name.toLowerCase()
  const location = useLocation()
  const pathParts = location.pathname.split("/")
  const isButtonLocation = pathParts[1] == linkToSelect
  const classSelected = isButtonLocation
    ? "bg-secondary"
    : "bg-transparent"

  const handleButtonClick = () => {
    if (props.onClick) {
      props.onClick()
    }
    if (props.isCategoryButton) {
      if (props.link) {
        setCategoryForApi(props.link)
      } else {
        setCategoryForApi(props.name)
      }
    }
  }

  if (!props.isLink) {
    return (
      <button
        className={
          `flex h-10 w-52 items-center gap-2
          rounded-lg border-2 border-primaryShade bg-white
          shadow-md transition-all hover:shadow-none ` +
          centeringIfRadio +
          props.buttonParams
        }
        onClick={handleButtonClick}
      >
        {props.isRadio ? (
          <div
            className="flex h-6 w-6 items-center
            justify-center rounded-full border-1
            border-secondary"
          >
            <div
              className={
                `h-2 w-2 rounded-full transition-all 
            ` + classSelected
              }
            ></div>
          </div>
        ) : null}
        <p>{props.name}</p>
      </button>
    )
  } else {
    return (
      <Link
        className={
          `flex h-10 w-52 items-center gap-2
          rounded-lg border-2 border-primaryShade bg-white
          shadow-md transition-all hover:shadow-none ` +
          centeringIfRadio +
          props.buttonParams
        }
        to={
          props.link
            ? "/" + props.link
            : "/" + props.name.toLowerCase()
        }
        onClick={handleButtonClick}
      >
        {props.isRadio ? (
          <div
            className="flex h-6 w-6 items-center
            justify-center rounded-full border-1
            border-secondary"
          >
            <div
              className={
                `h-2 w-2 rounded-full transition-all 
                duration-300 ` + classSelected
              }
            ></div>
          </div>
        ) : null}
        <p>{props.name}</p>
      </Link>
    )
  }
}

export default Button
