import { UseFormRegister } from "react-hook-form"
import { renderErrorMessage } from "../../../../store/functions"

type DetailBox<T extends object> = {
  title: string
  defaultValue: string
  registerFn: UseFormRegister<T>
  registerName: keyof T
  zodError?: string
}

type DetailBoxProps = DetailBox<{
  cellphone: string
  adress: string
  cep: string
}>

const UserDetailBox = (props: DetailBoxProps) => {
  return (
    <div
      className="flex h-fit w-full flex-col gap-2 rounded-md
      bg-white p-6"
    >
      <div className="flex w-full flex-col">
        <h4 className="text-xl leading-6">{props.title}</h4>
        <span className="h-1 w-full rounded-md border-2 border-primary border-opacity-70"></span>
      </div>
      <textarea
        className="h-28 resize-none rounded-md bg-primary bg-opacity-50 px-2 py-1
        focus:outline-none"
        placeholder="Digite aqui..."
        defaultValue={props.defaultValue}
        {...props.registerFn(props.registerName)}
      />
      {props.zodError && renderErrorMessage(props.zodError)}
    </div>
  )
}

export default UserDetailBox
