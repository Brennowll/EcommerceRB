import { useQuery } from "react-query"

import { api } from "../../../store/QueryClient"
import { LoadingSpinner } from "../../../components/LoadingSpinner"
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
  id: number
  products: ProductOrdered[]
  adress: string
  trackingCode: string
}

const OrdersView = () => {
  const { data, isFetching } = useQuery<Order[]>({
    queryKey: ["orders"],
    queryFn: async () => {
      const response = await api.get("/orders/")
      return response.data
    },
    refetchOnWindowFocus: false,
  })

  return (
    <div className="flex flex-col items-center gap-4">
      {isFetching ? (
        <LoadingSpinner />
      ) : data && data.length > 0 ? (
        data?.map((order) => (
          <Order
            key={order.id}
            id={order.id}
            productsList={order.products}
            description={order.adress}
            trackingCode={order.trackingCode}
          />
        ))
      ) : (
        "Não há pedidos!"
      )}
    </div>
  )
}

export default OrdersView
