type BoxProps = {
  title: string
  description: string
  buttonFn: () => void
  buttonName: string
}

const OrderDescriptionBox = (props: BoxProps) => {
  return (
    <div
      className="flex w-full max-w-xs flex-col rounded-md
      bg-primary bg-opacity-70 px-6 py-3 shadow-md"
    >
      <h3 className="text-xl">{props.title}</h3>
      <p
        className="text-sm text-textDim"
        dangerouslySetInnerHTML={{ __html: props.description }}
      ></p>
      <button
        className="mt-4 rounded-md bg-primaryShade bg-opacity-60 py-1
        font-bold transition-all hover:bg-opacity-80"
        onClick={props.buttonFn}
      >
        {props.buttonName}
      </button>
    </div>
  )
}

export default OrderDescriptionBox
