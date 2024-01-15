import { useQuery } from "react-query"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import Product from "../../../../components/Product"
import { LoadingSpinner } from "../../../../components/LoadingSpinner"

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

type OrderProps = {
  id: number
  productsList?: ProductOrdered[]
  description: string
  trackingCode: string
}

type OrderTracking = {
  data: string
  descricao: string
  unidade: string
  cidade: string
  uf: string
}

const Order = (props: OrderProps) => {
  const navigate = useNavigate()

  const { data, isFetching } = useQuery<OrderTracking[]>({
    queryKey: [`order${props.id}`],
    queryFn: async () => {
      if (!props.trackingCode || props.trackingCode == "") {
        return Promise.reject(new Error("Tracking code not found"))
      }

      const key = "1f845e6f37b159fd89b2a8f54d2651bf04f83627"
      const url = `https://www.cepcerto.com/ws/encomenda-json/${props.trackingCode}/${key}/`

      const response = await axios.get(url)
      return response.data
    },
    refetchOnWindowFocus: false,
  })

  const titleIfTrackingCode =
    data && data[0].descricao == "Objeto entregue ao destinatário"
      ? "Pedido entregue!"
      : "Pedido a caminho:"
  const trackingBoxTitle = !props.trackingCode
    ? "Preparando pedido:"
    : titleIfTrackingCode

  const trackingBoxDescription =
    !props.trackingCode || props.trackingCode == ""
      ? "Comprar novamente"
      : "Copiar código de rastreio"

  const handleButtonClickCopyCode = () => {
    const areaDeTransferencia = document.createElement("input")
    areaDeTransferencia.value = props.trackingCode
    document.body.appendChild(areaDeTransferencia)

    areaDeTransferencia.select()
    document.execCommand("copy")
    document.body.removeChild(areaDeTransferencia)
  }

  const handleButtonClickBuyAgain = () => {
    navigate("/pecas/")
  }

  return isFetching ? (
    <LoadingSpinner />
  ) : (
    <article
      className="mx-2 flex h-fit min-h-[18rem] flex-col items-center gap-6 rounded-md bg-primary
      p-4 xl:flex-row xl:items-start"
    >
      <div className="grid w-full grid-cols-2 px-3 sm:grid-cols-3 lg:grid-cols-4">
        {props.productsList?.map((productOrdered, index) => (
          <Product
            key={index}
            id={productOrdered.product.id}
            imgURLs={productOrdered.product.picturesLinks[0]}
            title={productOrdered.product.name}
            price={productOrdered.product.price}
            size={productOrdered.size}
            isForOrderPage={true}
          />
        ))}
      </div>
      <div
        className="flex max-h-56 w-full max-w-sm flex-col justify-between gap-5 rounded-md
          bg-white px-10 py-7"
      >
        <div>
          <h4 className="text-xl">{trackingBoxTitle}</h4>
          <p className="text-sm text-textDim">
            {props.description}
            <br />
            {!props.trackingCode || props.trackingCode == ""
              ? ""
              : `Código de rastreio: ${props.trackingCode}`}
          </p>
        </div>
        <button
          className="h-14 rounded-md border-2 border-primaryShade bg-primary"
          onClick={
            !props.trackingCode || props.trackingCode == ""
              ? handleButtonClickBuyAgain
              : handleButtonClickCopyCode
          }
        >
          {trackingBoxDescription}
        </button>
      </div>
    </article>
  )
}

export default Order
