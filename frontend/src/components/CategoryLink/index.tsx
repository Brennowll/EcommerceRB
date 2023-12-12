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
  const { pathname } = useLocation()
  const pathParts = pathname.split("/")
  const linkToSelect = props.link || props.name.toLowerCase()
  const isButtonLocation = pathParts[1] === linkToSelect
  const classSelected = isButtonLocation
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
      to={
        props.link ? `/${props.link}` : `/${props.name.toLowerCase()}`
      }
      onClick={handleButtonClick}
    >
      <div
        className="flex h-6 w-6 items-center justify-center
        rounded-full border-1 border-secondary"
      >
        <div
          className={`h-2 w-2 rounded-full transition-all ${classSelected}`}
        ></div>
      </div>
      <p>{props.name}</p>
    </Link>
  )
}

export default CategoryLink
