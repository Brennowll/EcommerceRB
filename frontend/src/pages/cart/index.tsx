import { useContext } from "react"
import { useQuery } from "react-query"
import { Link, useNavigate } from "react-router-dom"
import Cookies from "js-cookie"

import { api } from "../../store/QueryClient"
import { GlobalStateContext } from "../../store/GlobalStateProvider"
import ProductView from "./ProductView"
import OrderDescriptionBox from "./OrderDescriptionBox"

type Product = {
  id: number
  category: string
  picturesLinks: string[]
  name: string
  description: string
  availableSizes: string
  price: number
}

type ProductsForOrder = {
  id: number
  size: string
  quantity: number
  product: Product
}

const CartPage = () => {
  const { userIsLogged, userDetails } = useContext(GlobalStateContext)
  const navigate = useNavigate()

  const { data, refetch } = useQuery<ProductsForOrder[]>({
    queryKey: ["userProductsForOrder"],
    queryFn: async () => {
      const token = Cookies.get("access_token")

      if (!token) {
        return Promise.reject(new Error("Token not found"))
      }

      const response = await api.get("products_for_order", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      return response.data
    },
  })

  const refetchCartProducts = () => {
    refetch()
  }

  const renderProductsView = () => {
    return data
      ? data.map((productForOrder) => (
          <ProductView
            key={productForOrder.id}
            id={productForOrder.id}
            imgSRC={productForOrder.product.picturesLinks[0]}
            productName={productForOrder.product.name}
            productSize={productForOrder.size}
            productPrice={productForOrder.product.price}
            productQuantity={productForOrder.quantity}
            refetchProducts={refetchCartProducts}
          />
        ))
      : null
  }

  const changeShippingInfo = () => {
    navigate("/perfil")
  }

  const adressDescription = `
    Endereço: ${userDetails?.adress} <br />
    CEP: ${userDetails?.cep}
  `

  return (
    <main className="flex h-fit w-full items-center justify-center sm:h-full">
      {userIsLogged ? (
        <div
          className="flex h-fit w-full max-w-6xl flex-col justify-center
        py-16 sm:h-full md:max-h-[28rem] md:flex-row md:py-0"
        >
          <div
            className="ml-2 grid h-fit w-full max-w-xl flex-col gap-2 self-center
          overflow-y-auto pr-1 sm:pr-3 md:max-h-full md:self-start md:pb-2"
          >
            {renderProductsView()}
          </div>
          <span
            className="my-3 w-[calc(100%-20px)] max-w-xl self-center border-t-2
          border-black sm:w-[calc(36rem-10px)] md:my-0 md:h-[calc(100%-30px)] md:w-0
          md:border-l-2 md:border-t-0"
          ></span>
          <div
            className="mr-2 flex max-w-xl flex-col gap-3 self-center pl-3
          sm:flex-row md:max-w-none md:flex-col"
          >
            <OrderDescriptionBox
              title="Informações para envio:"
              description={adressDescription}
              buttonFn={changeShippingInfo}
              buttonName="Editar"
            />
            <OrderDescriptionBox
              title="Endereço"
              description="Fortaleza - PA, área residencial 5, quadra 10, conjunto
              3, casa 30"
              buttonFn={() => console.log("Apertei")}
              buttonName="Editar"
            />
          </div>
        </div>
      ) : (
        <Link to={"/login"} className="text-center hover:underline">
          Você não está logado! <br />
          Clique aqui para entrar em sua conta.
        </Link>
      )}
    </main>
  )
}

export default CartPage
