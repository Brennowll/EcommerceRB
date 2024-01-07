import Product from "../../../../components/Product"

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
  productsList?: ProductOrdered[]
  title: string
  description: string
  buttonText: string
  buttonFn?: () => void
}

const Order = (props: OrderProps) => {
  return (
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
          <h4 className="text-xl">{props.title}:</h4>
          <p className="text-textDim">{props.description}</p>
        </div>
        <button className="h-14 rounded-md border-2 border-primaryShade bg-primary">
          {props.buttonText}
        </button>
      </div>
    </article>
  )
}

export default Order
