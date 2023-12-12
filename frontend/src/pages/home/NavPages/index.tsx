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

  const renderPageLink = (pageNumber: number) => (
    <a
      key={pageNumber}
      href={`${categoryPath}${pageNumber}`}
      className={
        page === pageNumber ? classCurrentPage : "hover:underline"
      }
    >
      {pageNumber}
    </a>
  )

  const renderEllipsisLink = () => <a className="pl-1 pr-1">...</a>

  return (
    <nav className="flex">
      <a
        href={
          isFirstPage
            ? location.pathname
            : `${categoryPath}${page - 1}`
        }
        className={isFirstPage ? classLinkUnavailable : ""}
        aria-disabled={isFirstPage}
      >
        <img
          src={arrowNextIcon}
          alt="Navigate to previous page"
          className="h-6 rotate-180 transform"
        />
      </a>
      {hasPrevLatPages[0] && renderEllipsisLink()}
      {numbersToShow.map((pageNumber) =>
        pageNumber !== 0 ? renderPageLink(pageNumber) : null,
      )}
      {hasPrevLatPages[1] && renderEllipsisLink()}
      <a
        href={
          isLastPage
            ? location.pathname
            : `${categoryPath}${page + 1}`
        }
        className={isLastPage ? classLinkUnavailable : ""}
        aria-disabled={isLastPage}
      >
        <img
          src={arrowNextIcon}
          alt="Navigate to next page"
          className="h-6"
        />
      </a>
    </nav>
  )
}

export default NavPages
