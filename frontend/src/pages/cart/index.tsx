import { useState, useContext, useEffect } from "react"
import { useQuery, useMutation } from "react-query"
import { Link, useNavigate, useLocation } from "react-router-dom"
import axios from "axios"

import { api } from "../../store/QueryClient"
import { GlobalStateContext } from "../../store/GlobalStateProvider"
import { LoadingSpinner } from "../../components/LoadingSpinner"
import { renderErrorMessage } from "../../store/functions"
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

type OrderSumarry = {
  productsTotalCost: string
  shippingCost: string
}

type ShippingArgs = {
  ceporigem: string
  cepdestino: string
  valorpac: string
  prazopac: string
  valorsedex: string
  prazosedex: string
}

const CartPage = () => {
  const { userIsLogged, userDetails } = useContext(GlobalStateContext)
  const [orderSumarry, setOrderSummary] = useState<OrderSumarry>({
    productsTotalCost: "0",
    shippingCost: "0",
  })
  const [apiError, setApiError] = useState<string | null>()
  const [productsVerified, setProductsVerified] =
    useState<boolean>(false)

  const navigate = useNavigate()
  const location = useLocation()
  const searchParams = new URLSearchParams(location.search)
  const session_id = searchParams.get("session_id")

  const totalCost =
    parseInt(orderSumarry.productsTotalCost) +
    parseInt(orderSumarry.shippingCost)

  const { data, refetch, isFetching } = useQuery<ProductsForOrder[]>({
    queryKey: ["userProductsForOrder"],
    queryFn: async () => {
      if (!userIsLogged) {
        return Promise.reject(new Error("User is not logged in."))
      }

      const response = await api.get("products_for_order")
      return response.data
    },
    onSuccess: (data) => {
      let tempProductsCost = 0
      const tempOrderSummary = orderSumarry

      for (const productForOrder of data) {
        tempProductsCost +=
          productForOrder.quantity * productForOrder.product.price
      }

      tempOrderSummary.productsTotalCost = `${tempProductsCost}`
      setOrderSummary(tempOrderSummary)

      shippingRefetch()
    },
    refetchOnWindowFocus: false,
  })

  const { refetch: shippingRefetch, isFetching: shippingIsFetching } =
    useQuery<ShippingArgs>({
      queryKey: ["shippingCost"],
      queryFn: async () => {
        if (!userIsLogged) {
          return Promise.reject(new Error("User is not logged in."))
        }

        if (userDetails?.cep == "") {
          return Promise.reject(new Error("Cep not found"))
        }

        const cepOnlyNum = userDetails?.cep.replace(/\D/g, "")
        const response = await api.post("calculate_shipping/", {
          cep: cepOnlyNum,
        })
        return response.data
      },
      onSuccess: (data) => {
        const tempOrderSummary = orderSumarry
        tempOrderSummary.shippingCost = data.valorsedex
        setOrderSummary(tempOrderSummary)
      },
      refetchOnWindowFocus: false,
    })

  const { mutate: mutateVerifyAvailableProducts } = useMutation({
    mutationKey: ["verifyAvailableProducts"],
    mutationFn: async () => {
      const response = await api.post("verify_available_products/")
      return response.data
    },
    onSuccess: () => {
      setApiError(null)
      setProductsVerified(true)
    },
    onError: (error) => {
      setProductsVerified(false)
      if (axios.isAxiosError(error)) {
        setApiError(error.response?.data.message)
      }
    },
  })

  const { mutate } = useMutation({
    mutationKey: ["createStripeSession"],
    mutationFn: async () => {
      const formattedCost = parseInt(
        totalCost.toFixed(2).replace(".", ""),
      )

      const response = await api.post("create_checkout_session/", {
        price: formattedCost,
      })

      return response.data
    },
    onSuccess: (data) => {
      setApiError(null)
      window.location.href = data.redirectUrl
    },
    onError: () => {
      setApiError("Ocorreu um erro, tente novamente mais tarde")
    },
  })

  const { mutate: createOrderMutation } = useMutation({
    mutationKey: ["createOrder"],
    mutationFn: async () => {
      const response = await api.post("orders/", {
        stripe_payment_id: session_id,
        adress: userDetails?.adress,
      })
      return response.data
    },
    onSuccess: () => {
      navigate("/perfil")
    },
  })

  const refetchCartProducts = () => {
    refetch()
  }

  useEffect(() => {
    if (session_id) {
      createOrderMutation()
    }

    if (productsVerified) {
      mutate()
    }
  }, [session_id, productsVerified])

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

  const handleChangeShippingInfoClick = () => {
    navigate("/perfil")
  }

  const noCepRegistered = !userDetails?.cep || userDetails.cep == ""
  const noAdressRegistered =
    !userDetails?.adress || userDetails.adress == ""
  const noCellphoneRegistered =
    !userDetails?.cellphone || userDetails.cellphone == ""

  const handleMakeOrderClick = () => {
    if (
      noCepRegistered ||
      noAdressRegistered ||
      noCellphoneRegistered
    ) {
      return setApiError(
        "Cadastre CEP, endereço e telefone para fazer um pedido",
      )
    }

    if (isFetching || shippingIsFetching) {
      return setApiError(
        "O frete está sendo calculado, aguarde alguns segundos.",
      )
    }

    setApiError(null)
    mutateVerifyAvailableProducts()
  }

  const adressDescription = [
    `Endereço: ${
      userDetails
        ? userDetails?.adress !== ""
          ? userDetails.adress
          : "Não cadastrado!"
        : "Não cadastrado!"
    }`,
    `CEP: ${
      userDetails
        ? userDetails?.cep !== ""
          ? userDetails.cep
          : "Não cadastrado!"
        : "Não cadastrado!"
    }`,
  ]

  const orderSumarryDescription = [
    `Produtos: R$${parseInt(orderSumarry.productsTotalCost).toFixed(
      2,
    )}`,
    `Frete: R$${orderSumarry.shippingCost}`,
    `Total: R$${totalCost.toFixed(2)}`,
  ]

  return (
    <main className="flex h-fit w-full items-center justify-center sm:h-full">
      {userIsLogged ? (
        isFetching ? (
          <LoadingSpinner />
        ) : (
          <div
            className="flex h-fit w-full max-w-6xl flex-col justify-center
          py-16 sm:h-full md:max-h-[28rem] md:flex-row md:py-0"
          >
            <div
              className="ml-2 grid h-fit w-[calc(100%-20px)] max-w-xl
              auto-rows-min flex-col gap-2 self-center overflow-y-auto rounded-md
              bg-primary bg-opacity-70 p-3 sm:w-full sm:pr-3 md:mx-3
              md:max-h-full md:min-h-full md:self-start"
            >
              {data && data.length > 0 ? (
                renderProductsView()
              ) : (
                <p className="self-center justify-self-center">
                  Não há produtos no carrinho!
                </p>
              )}
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
                descriptions={adressDescription}
                buttonFn={handleChangeShippingInfoClick}
                buttonName="Editar"
              />
              <OrderDescriptionBox
                title="Resumo do pedido:"
                descriptions={orderSumarryDescription}
                buttonFn={handleMakeOrderClick}
                buttonName="Fazer pedido"
              />
              <div className="max-w-xs">
                {apiError ? renderErrorMessage(apiError) : null}
              </div>
            </div>
          </div>
        )
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
