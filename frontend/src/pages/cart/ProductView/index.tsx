import { useMutation } from "react-query"
import Cookies from "js-cookie"

import { api } from "../../../store/QueryClient"
import trashIcon from "/src/assets/trashIcon.svg"

type ProductViewProps = {
  id: number
  imgSRC: string
  productName: string
  productSize: string
  productPrice: number
  productQuantity: number
  refetchProducts: () => void
}

const ProductView = (props: ProductViewProps) => {
  const sizeString = `Tamanho: ${props.productSize}`
  const priceString = `R$${props.productPrice}`
  const quantityString = `Quantidade: ${props.productQuantity}`

  const { mutate } = useMutation({
    mutationKey: ["deleteProductForOrder"],
    mutationFn: async () => {
      const token = Cookies.get("access_token")

      if (!token) {
        return Promise.reject(new Error("Token not found"))
      }

      const response = await api.delete(
        `products_for_order/${props.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )

      return response.data
    },
    onSuccess: props.refetchProducts,
  })

  const handleDelete = () => {
    mutate()
  }

  return (
    <article
      className="flex h-28 w-full justify-between rounded-lg bg-primary bg-opacity-70
      p-2 shadow-md sm:h-32"
    >
      <div className="flex h-full w-full items-center gap-4">
        <img
          src={props.imgSRC}
          alt=""
          className="h-full w-24 rounded-md object-cover"
        />
        <div className="flex flex-col gap-1">
          <h3 className="text-sm sm:text-lg">{props.productName}</h3>
          <p className="text-xs text-zinc-600 sm:text-base sm:leading-5">
            {sizeString}
            <br />
            {priceString}
            <br />
            {quantityString}
          </p>
        </div>
      </div>
      <div className="flex h-full items-center sm:mr-2">
        <button
          className="rounded-md bg-black bg-opacity-0 p-1 transition-all
          hover:bg-opacity-20"
          onClick={handleDelete}
        >
          <img
            src={trashIcon}
            alt="Ícone de uma lixeira"
            className="h-6 sm:h-7"
          />
        </button>
      </div>
    </article>
  )
}

export default ProductView
