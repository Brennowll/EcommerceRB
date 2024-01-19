import { useContext, useState, useEffect } from "react"
import { useLocation, Link } from "react-router-dom"
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

  const page = parseInt(lastPart) || 1
  const isFirstPage = page === 1
  const isLastPage = page === numPages

  const classLinkUnavailable = "filter-gray-500"
  const classCurrentPage = "hover:underline text-gray-500"

  const calculatePagesToShow = () => {
    if (isFirstPage) {
      if (numPages >= 3) setNumbersToShow([1, 2, 3])
      else if (numPages === 2) setNumbersToShow([1, 2, 0])
      else setNumbersToShow([1, 0, 0])
    } else if (isLastPage) {
      if (page === 2) setNumbersToShow([1, 2])
      else setNumbersToShow([page - 2, page - 1, page])
    } else {
      setNumbersToShow([page - 1, page, page + 1])
    }
  }

  const calculatePrevNextPages = () => {
    const hasPreviousPages = page - 1 > 1
    const hasLaterPages = page + 1 < numPages
    setHasPrevLatPages([hasPreviousPages, hasLaterPages])
  }

  useEffect(() => {
    calculatePrevNextPages()
    calculatePagesToShow()
  }, [page, numPages, isFirstPage, isLastPage])

  const renderArrowLink = (previousOrNext: string) => {
    const arrowLinkElement = (
      to: string,
      unavailableCondition: boolean,
      altMessage: string,
      imgClass?: string,
    ) => {
      return (
        <Link
          to={to}
          className={unavailableCondition ? classLinkUnavailable : ""}
          aria-disabled={unavailableCondition}
        >
          <img
            src={arrowNextIcon}
            alt={altMessage}
            className={`h-6 ${imgClass}`}
          />
        </Link>
      )
    }

    if (previousOrNext == "previous") {
      const previousLink = isFirstPage
        ? location.pathname
        : `${categoryPath}${page - 1}`

      return arrowLinkElement(
        previousLink,
        isFirstPage,
        "Navegue para a página anterior",
        "rotate-180 transform",
      )
    } else {
      const laterLink = isLastPage
        ? location.pathname
        : `${categoryPath}${page + 1}`

      return arrowLinkElement(
        laterLink,
        isLastPage,
        "Navegue para a próxima página",
      )
    }
  }

  const renderEllipsisLink = (previouOrLater: string) =>
    previouOrLater == "previous"
      ? hasPrevLatPages[0] && (
          <Link to={`${categoryPath}1`} className="pr-1">
            ...
          </Link>
        )
      : hasPrevLatPages[1] && (
          <a href={`${categoryPath}${numPages}`} className="pl-1">
            ...
          </a>
        )

  const renderPageLink = (pageNumber: number) => (
    <Link
      key={pageNumber}
      to={`${categoryPath}${pageNumber}`}
      className={
        page === pageNumber ? classCurrentPage : "hover:underline"
      }
    >
      {pageNumber}
    </Link>
  )

  return (
    <nav className="flex">
      {renderArrowLink("previous")}
      {renderEllipsisLink("previous")}
      {numbersToShow.map((pageNumber) =>
        pageNumber !== 0 ? renderPageLink(pageNumber) : null,
      )}
      {renderEllipsisLink("later")}
      {renderArrowLink("later")}
    </nav>
  )
}

export default NavPages
