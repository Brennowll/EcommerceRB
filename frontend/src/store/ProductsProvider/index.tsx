import React, {
  Dispatch,
  ReactNode,
  SetStateAction,
  createContext,
  useState,
  useEffect,
} from "react"
import { useQuery } from "react-query"
import { useLocation } from "react-router-dom"
import { api } from "../QueryClient"
import Product from "../../components/Product"

type Product = {
  id: number
  category: string
  picturesLinks: string[]
  name: string
  slug: string
  description: string
  availableSizes: string
  price: number
}

type Category = {
  name: string
}

interface Results {
  categories: Category[]
  num_pages: number
  products: Product[]
}

type ProductsContextType = {
  isFetching: boolean
  categoryForApi: string | null
  setCategoryForApi: Dispatch<SetStateAction<string | null>>
  numPages: number
  setNumPages: Dispatch<SetStateAction<number>>
  categories: string[]
  setCategories: Dispatch<SetStateAction<string[]>>
  products: Product[]
  setProducts: Dispatch<SetStateAction<Product[]>>
}

type ApiParams = {
  category?: string
  page?: number
}

export const ProductsContext = createContext<ProductsContextType>(
  {} as ProductsContextType,
)

type ProductsProviderProps = {
  children: ReactNode
}

const ProductsProvider: React.FC<ProductsProviderProps> = ({
  children,
}: ProductsProviderProps) => {
  const [categoryForApi, setCategoryForApi] = useState<string | null>(
    null,
  )
  const [numPages, setNumPages] = useState<number>(0)
  const [categories, setCategories] = useState<string[]>([])
  const [products, setProducts] = useState<Product[]>([])

  const location = useLocation()
  const pathParts = location.pathname.split("/")
  const lastPart = pathParts.slice(-1)[0]

  const { refetch, isFetching } = useQuery<Product[]>({
    queryKey: ["products"],
    queryFn: async () => {
      const params: ApiParams = buildApiParams(
        pathParts,
        parseInt(lastPart),
      )

      const response = await api.get("products/", {
        params: params,
      })

      const uniqueCategories = findUniqueCategories(
        response.data.results.categories,
      )
      updateStateWithResponseData(
        response.data.results,
        uniqueCategories,
      )

      return response.data
    },
    refetchOnWindowFocus: false,
  })

  function buildApiParams(pathParts: string[], page: number | null) {
    const params: ApiParams = {}

    if (categoryForApi) {
      params.category = categoryForApi
    } else {
      const categoryInPath = pathParts[1]
      if (categoryInPath !== "pecas") {
        params.category =
          categoryInPath.charAt(0).toUpperCase() +
          categoryInPath.slice(1)
      }
    }

    if (page) {
      params.page = page
    }

    return params
  }

  function findUniqueCategories(categories: Category[]): string[] {
    const tempCategories: string[] = []
    for (const category of categories) {
      tempCategories.push(category.name)
    }
    return tempCategories
  }

  function updateStateWithResponseData(
    results: Results,
    uniqueCategories: string[],
  ): void {
    setCategories(uniqueCategories)
    setNumPages(results.num_pages)
    setProducts(results.products)
  }

  useEffect(() => {
    refetch()
  }, [categoryForApi, lastPart])

  return (
    <ProductsContext.Provider
      value={{
        isFetching,
        categoryForApi,
        setCategoryForApi,
        numPages,
        setNumPages,
        categories,
        setCategories,
        products,
        setProducts,
      }}
    >
      {children}
    </ProductsContext.Provider>
  )
}

export default ProductsProvider
