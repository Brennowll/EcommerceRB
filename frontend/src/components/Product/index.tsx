import { Link } from "react-router-dom"

type ProductProps = {
  imgURLs: string
  title: string
  slug: string
  price?: number
  size?: string
  isForOrderPage?: boolean
}

const Product = (props: ProductProps) => {
  return (
    <Link
      to={`/produtos/${props.slug}`}
      className="flex h-72 w-32 flex-col
      justify-center py-3 sm:h-fit sm:w-56"
    >
      <img
        src={props.imgURLs}
        className={`rounded-md
        object-cover shadow-md shadow-zinc-400 ${
          props.isForOrderPage ? "h-60 w-44" : "h-72 w-56"
        }`}
      />
      <div
        className="mt-2 h-fit w-fit
        [&>p]:text-sm [&>p]:leading-[0.90rem]
        [&>p]:text-secondaryShade"
      >
        <p>{props.title}</p>
        <p>R${props.price}</p>
        {props.size ? <p>Tamanho: {props.size}</p> : null}
      </div>
    </Link>
  )
}

export default Product
