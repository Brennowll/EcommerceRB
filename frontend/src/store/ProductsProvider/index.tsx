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
  picturesLinks: string[]
  sizesAndColors: string
  name: string
  description: string
  category: string
  price: number
}

interface ProductsContextType {
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

interface ProductsProviderProps {
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
  const page = !isNaN(parseInt(lastPart)) ? null : parseInt(lastPart)

  const { refetch } = useQuery<Product[]>({
    queryKey: ["products"],
    queryFn: async () => {
      const params: ApiParams = {}

      if (categoryForApi) {
        params.category = categoryForApi
      } else {
        const categoryInPath = pathParts[1]
        if (categoryInPath != "pecas") {
          params.category =
            categoryInPath.charAt(0).toUpperCase() +
            categoryInPath.slice(1)
        }
      }

      if (page) {
        params.page = page
      }

      const response = await api.get("products/", {
        params: params,
      })

      const tempCategories: string[] = []
      for (const category of response.data.results.categories) {
        if (!tempCategories.includes(category.name)) {
          tempCategories.push(category.name)
        }
      }

      setCategories(tempCategories)
      setNumPages(response.data.results.num_pages)
      setProducts(response.data.results.products)

      return response.data
    },
    refetchOnWindowFocus: false,
  })

  useEffect(() => {
    refetch()
  }, [categoryForApi])

  return (
    <ProductsContext.Provider
      value={{
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
