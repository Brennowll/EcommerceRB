import { useContext } from "react"
import CategoryLink from "../CategoryLink"
import { ProductsContext } from "../../store/ProductsProvider"

const Categories = () => {
  const { categories } = useContext(ProductsContext)
  const categoriesButtons = categories?.map((categorie) => (
    <CategoryLink name={categorie} key={categorie} />
  ))

  return (
    <>
      <CategoryLink
        name={"Todas as peças"}
        link="pecas"
        key={"Todas as peças"}
      />
      {categoriesButtons}
    </>
  )
}

export default Categories
