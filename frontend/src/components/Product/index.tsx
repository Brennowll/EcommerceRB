import { Link } from "react-router-dom"

type ProductProps = {
  id: number
  imgURLs: string
  title: string
  sizesAndColors?: string
  price?: number
}

const Product = (props: ProductProps) => {
  return (
    <Link
      to={`/produtos/${props.id}`}
      className="flex h-72 w-32 flex-col
      justify-center py-3 sm:h-fit sm:w-56"
    >
      <img
        src={props.imgURLs}
        className="h-72 w-56 rounded-md
        object-cover shadow-md shadow-zinc-400"
      />
      <div
        className="mt-2 h-fit w-fit
        [&>p]:text-sm [&>p]:leading-[0.90rem]
        [&>p]:text-secondaryShade"
      >
        <p>{props.title}</p>
        <p>R${props.price}</p>
      </div>
    </Link>
  )
}

export default Product
