import { useContext } from "react"
import { Link, useLocation } from "react-router-dom"
import { ProductsContext } from "../../store/ProductsProvider"

type Props = {
  name: string
  onClick?: () => void
  link?: string
}

const CategoryLink = (props: Props) => {
  const { setCategoryForApi } = useContext(ProductsContext)
  const linkToRedirect = props.link
    ? `/${props.link}`
    : `/${props.name.toLowerCase()}`

  const { pathname: pathName } = useLocation()
  const pathParts = pathName.split("/")
  const linkToSelect = props.link || props.name.toLowerCase()
  const isLinkLocation = pathParts[1] === linkToSelect
  const classSelected = isLinkLocation
    ? "bg-secondary"
    : "bg-transparent"

  const handleButtonClick = () => {
    setCategoryForApi(props.link || props.name)
  }

  return (
    <Link
      className="flex h-10 w-full items-center gap-2
        rounded-lg border-2 border-primaryShade bg-white
        pl-2 shadow-md transition-all hover:shadow-none"
      to={linkToRedirect}
      onClick={handleButtonClick}
    >
      <span
        className="flex h-6 w-6 items-center justify-center
        rounded-full border-1 border-secondary"
      >
        <span
          className={`h-2 w-2 rounded-full transition-all ${classSelected}`}
        ></span>
      </span>
      <p>{props.name}</p>
    </Link>
  )
}

export default CategoryLink
