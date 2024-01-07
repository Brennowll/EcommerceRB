import { useQuery } from "react-query"
import Cookies from "js-cookie"
import { api } from "../../../store/QueryClient"
import Order from "./Order"

type Product = {
  id: number
  picturesLinks: string[]
  price: number
  name: string
}

type ProductOrdered = {
  size: string
  quantity: string
  product: Product
}

type Order = {
  status: string
  adress: string
  products: ProductOrdered[]
}

const OrdersView = () => {
  const { data } = useQuery<Order[]>({
    queryKey: ["orders"],
    queryFn: async () => {
      const token = Cookies.get("access_token")

      const response = await api.get("/orders/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      console.log(response.data)

      return response.data
    },
  })

  return (
    <div className="flex flex-col gap-4">
      {data?.map((order, index) => (
        <Order
          key={index}
          productsList={order.products}
          title={order.status}
          description={order.adress}
          buttonText="Copiar código de rastreamento"
        />
      ))}
    </div>
  )
}

export default OrdersView
