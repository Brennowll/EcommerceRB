import { useState, useContext } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { useMutation } from "react-query"
import { z } from "zod"

import { GlobalStateContext } from "../../../store/GlobalStateProvider"
import { api } from "../../../store/QueryClient"
import { userDetailsSchema } from "../../../store/zodSchemas"
import {
  renderErrorMessage,
  renderSucessMessage,
} from "../../../store/functions"
import UserDetailBox from "./UserDetailBox"

const ProfileView = () => {
  const { userDetails } = useContext(GlobalStateContext)

  const [apiError, setApiError] = useState<string | null>(null)
  const [apiSuccess, setApiSuccess] = useState<string | null>(null)

  type UserDetails = z.infer<typeof userDetailsSchema>

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UserDetails>({
    resolver: zodResolver(userDetailsSchema),
  })

  const { mutate, isSuccess } = useMutation({
    mutationFn: async (userDetailsUpdated: UserDetails) => {
      setApiError(null)

      const response = await api.put(
        `/users_details/${
          userDetails?.id
            ? `${userDetails.id}/`
            : "1/?create_if_not_exist=true"
        }`,
        {
          cellphone: `+55${userDetailsUpdated.cellphone}`,
          adress: userDetailsUpdated.adress,
          cep: userDetailsUpdated.cep,
        },
      )

      return response.data
    },
    onSuccess: () => {
      setApiSuccess("Dados atualizados")
    },
    onError: () => {
      setApiError("Ocorreu um erro, tente novamente!")
    },
  })

  const onSubmit = (data: UserDetails) => {
    mutate(data)
  }

  return (
    <form
      className="mx-2 grid h-fit min-h-[18rem] grid-cols-1 gap-3 rounded-md bg-primary p-5"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
        <UserDetailBox
          title="Telefone"
          defaultValue={userDetails?.cellphone || ""}
          registerFn={register}
          registerName="cellphone"
          zodError={errors.cellphone?.message}
        />
        <UserDetailBox
          title="Endereço"
          defaultValue={userDetails?.adress || ""}
          registerFn={register}
          registerName="adress"
          zodError={errors.adress?.message}
        />
        <UserDetailBox
          title="CEP"
          defaultValue={userDetails?.cep || ""}
          registerFn={register}
          registerName="cep"
          zodError={errors.cep?.message}
        />
      </div>
      {apiError && renderErrorMessage(apiError)}
      {isSuccess && renderSucessMessage(apiSuccess)}
      <button
        type="submit"
        className="h-10 w-full rounded-md border-2 border-primaryShade bg-white
        transition-all hover:bg-neutral-100"
      >
        Salvar
      </button>
    </form>
  )
}

export default ProfileView
