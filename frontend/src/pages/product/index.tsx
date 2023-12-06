import { useEffect, useState } from "react"
import { useQuery } from "react-query"
import { useLocation } from "react-router-dom"
import { api } from "../../store/QueryClient"
import ArrowNextIcon from "/src/assets/ArrowNextIcon.svg"

type Product = {
  id: number
  picturesLinks: string[]
  name: string
  description: string
  sizesAvailable: string
  price: number
}

const ProductPage = () => {
  const [pictureNumSelected, setPictureNumSelected] =
    useState<number>(0)
  const [sizesAvailable, setSizesAvailable] = useState<string[]>([])
  const [sizeSelected, setSizeSelected] = useState<string>()
  const [sizeNotSelectedError, setSizeNotSelectedError] =
    useState<boolean>(false)

  const location = useLocation()
  const pathParts = location.pathname.split("/")
  const productIdPath = pathParts[pathParts.length - 1]

  const { data } = useQuery<Product[]>({
    queryKey: ["product"],
    queryFn: async () => {
      const response = await api.get("products", {
        params: { id: productIdPath },
      })

      return response.data
    },
    refetchOnWindowFocus: false,
  })

  const handleAddToCartClick = () => {
    if (!sizeSelected) {
      setSizeNotSelectedError(true)
      return
    }
  }

  useEffect(() => {
    if (!data) {
      return
    }

    const sizesAvailable = data[0].sizesAvailable.split(",")
    const sizesTemp: string[] = []

    for (const sizes of sizesAvailable) {
      const sizeName = sizes.split("-")[1].trim().toUpperCase()
      sizesTemp.push(sizeName)
    }

    setSizesAvailable(sizesTemp)
  }, [data])

  return (
    <section
      className="my-16 flex flex-col items-center
      justify-center gap-8 sm:flex-row md:gap-12"
    >
      <div
        className="flex h-[426px] w-80 flex-col gap-3
        rounded-md border-2 border-primaryShade border-opacity-70
        bg-primary p-5 shadow-lg md:h-fit md:w-fit"
      >
        <div
          className="flex max-h-12 items-center justify-center
          md:max-h-16"
        >
          <button
            onClick={() => {
              pictureNumSelected == 0
                ? null
                : setPictureNumSelected(pictureNumSelected - 1)
            }}
          >
            <img
              src={ArrowNextIcon}
              alt="Seta apontada para a esquerda"
              className="h-8 rotate-180 transform"
            />
          </button>

          {data
            ? data[0].picturesLinks.map((link, index) => (
                <button
                  className="relative mx-1 h-12 w-9 rounded-md
                  shadow-md md:h-16 md:w-12"
                  onClick={() => {
                    setPictureNumSelected(index)
                  }}
                  key={index}
                >
                  <span
                    className="absolute inset-0 rounded-md
                    bg-black bg-opacity-5 transition-all
                    hover:bg-opacity-10 active:bg-opacity-0"
                  ></span>
                  <img
                    src={link}
                    alt="Foto do produto"
                    className="h-full w-full rounded-md object-cover"
                  />
                </button>
              ))
            : null}
          <button
            onClick={() => {
              data &&
              pictureNumSelected == data[0].picturesLinks.length - 1
                ? null
                : setPictureNumSelected(pictureNumSelected + 1)
            }}
          >
            <img
              src={ArrowNextIcon}
              alt="Seta apontada para a direita"
              className="h-8"
            />
          </button>
        </div>
        <figure>
          <img
            src={
              data ? data[0].picturesLinks[pictureNumSelected] : ""
            }
            alt="Foto selecionada do produto"
            className="max-h-80 max-w-sm rounded-md
            md:max-h-[32rem]"
          />
        </figure>
      </div>
      <div
        className="flex w-80 flex-col gap-3 px-3
        sm:w-52 sm:px-0 md:w-64 lg:w-80"
      >
        <h2 className="text-2xl leading-5 md:text-[1.6rem]">
          {data ? "R$" + data[0].price : null}
        </h2>
        <div>
          <h3 className="text-lg md:text-xl">
            {data ? data[0].name : null}
          </h3>
          <p className="text-sm text-neutral-600 md:text-base">
            {data ? data[0].description : null}
          </p>
        </div>
        <div className="flex flex-col">
          {sizeNotSelectedError ? (
            <p className="pb-1 text-xs text-error">
              Selecione um Tamanho
            </p>
          ) : null}
          <div className="flex flex-row gap-1">
            {sizesAvailable.map((size, index) => (
              <button
                key={index}
                className={`relative h-7 w-10 rounded-md
                bg-stone-100 shadow-md transition-all ${
                  sizeSelected == size
                    ? "bg-primaryShade text-white"
                    : null
                }`}
                onClick={() => {
                  setSizeSelected(size)

                  if (sizeNotSelectedError) {
                    setSizeNotSelectedError(false)
                  }
                }}
              >
                <span
                  className="absolute inset-0 rounded-md
                  bg-black bg-opacity-5 transition-all
                  hover:bg-opacity-20 active:bg-opacity-0"
                ></span>
                {size}
              </button>
            ))}
          </div>
        </div>
        <button
          className="mt-1 h-11 w-full rounded-md
          border-2 border-primaryShade bg-primary
          shadow-md transition-all hover:bg-orange-200"
          onClick={handleAddToCartClick}
        >
          Adicione ao carrinho
        </button>
      </div>
    </section>
  )
}

export default ProductPage
