import { useContext, useState, useEffect } from "react"
import { useLocation } from "react-router-dom"
import { ProductsContext } from "../../../store/ProductsProvider"
import arrowNextIcon from "/src/assets/arrowNextIcon.svg"

const NavPages = () => {
  const { numPages } = useContext(ProductsContext)
  const [numbersToShow, setNumbersToShow] = useState<number[]>([
    0, 0, 0,
  ])
  const [hasPrevLatPages, setHasPrevLatPages] = useState<boolean[]>([
    false,
    false,
  ])

  const location = useLocation()
  const pathParts = location.pathname.split("/")
  const lastPart = pathParts.slice(-1)[0]
  const categoryPath = `/${pathParts[1]}/`

  const page = !isNaN(parseInt(lastPart)) ? parseInt(lastPart) : 1
  const isFirstPage = page == 1
  const isLastPage = page == numPages
  const classLinkUnavailable = " filter-gray-500"

  const classCurrentPage = "hover:underline text-gray-500"

  useEffect(() => {
    const hasPreviousPages = page - 1 <= 1 ? false : true
    const hasLaterPages = page + 1 >= numPages ? false : true
    setHasPrevLatPages([hasPreviousPages, hasLaterPages])

    if (isFirstPage) {
      if (numPages >= 3) {
        setNumbersToShow([1, 2, 3])
      } else if (numPages == 2) {
        setNumbersToShow([1, 2, 0])
      } else {
        setNumbersToShow([1, 0, 0])
      }
    } else if (isLastPage) {
      if (page == 2) {
        setNumbersToShow([1, 2])
      } else {
        setNumbersToShow([page - 2, page - 1, page])
      }
    } else {
      setNumbersToShow([page - 1, page, page + 1])
    }
  }, [page, numPages, isFirstPage, isLastPage])

  return (
    <nav className="flex">
      <a
        href={
          isFirstPage
            ? location.pathname
            : `${categoryPath}${page - 1}`
        }
        className={isFirstPage ? classLinkUnavailable : ""}
        aria-disabled={isFirstPage ? true : false}
      >
        <img
          src={arrowNextIcon}
          alt="Imagem de uma seta para a esquerda, voltar uma página"
          className="h-6 rotate-180 transform"
        />
      </a>
      {hasPrevLatPages[0] == true ? (
        <a href={`${categoryPath}1`} className="pr-1">
          {hasPrevLatPages[0] == true ? "..." : null}
        </a>
      ) : null}
      {numbersToShow[0] != 0 ? (
        <a
          href={`${categoryPath}${numbersToShow[0]}`}
          className={
            page == numbersToShow[0]
              ? classCurrentPage
              : `hover:underline`
          }
        >
          {numbersToShow[0]}
        </a>
      ) : null}
      {numbersToShow[1] != 0 ? (
        <a
          href={`${categoryPath}${numbersToShow[1]}`}
          className={
            page == numbersToShow[1]
              ? classCurrentPage
              : `hover:underline`
          }
        >
          {numbersToShow[1]}
        </a>
      ) : null}
      {numbersToShow[2] != 0 ? (
        <a
          href={`${categoryPath}${numbersToShow[2]}`}
          className={
            page == numbersToShow[2]
              ? classCurrentPage
              : `hover:underline`
          }
        >
          {numbersToShow[2]}
        </a>
      ) : null}
      {hasPrevLatPages[1] == true ? (
        <a href={`${categoryPath}${numPages}`} className=" pl-1">
          {hasPrevLatPages[1] == true ? "..." : null}
        </a>
      ) : null}
      <a
        href={
          isLastPage
            ? location.pathname
            : `${categoryPath}${page + 1}`
        }
        className={isLastPage ? classLinkUnavailable : ""}
        aria-disabled={isLastPage ? true : false}
      >
        <img
          src={arrowNextIcon}
          alt="Imagem de uma seta para a direita, avançar uma página"
          className="h-6"
        />
      </a>
    </nav>
  )
}

export default NavPages
