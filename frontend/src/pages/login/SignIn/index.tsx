import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation } from "react-query"
import { z } from "zod"
import axios from "axios"

import { api } from "../../../store/QueryClient"
import { signInUserSchema } from "../../../store/zodSchemas"
import {
  renderSignInAuthInput,
  renderErrorMessage,
} from "../../../store/functions"

type SignInUser = z.infer<typeof signInUserSchema>

const SignIn = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<SignInUser>({
    resolver: zodResolver(signInUserSchema),
  })

  const [usernameApiError, setUsernameApiError] = useState<
    string | undefined
  >(undefined)
  const [emailApiError, setEmailApiError] = useState<
    string | undefined
  >(undefined)

  const { mutate, isSuccess, isError } = useMutation({
    mutationFn: async (data: SignInUser) => {
      const response = await api.post("/create_user/", {
        username: data.username,
        email: data.email,
        password: data.password,
      })
      return response.data
    },
    onSuccess: () => {
      reset()
    },
    onError: (error) => {
      if (axios.isAxiosError(error)) {
        if (error.response?.data.username) {
          setUsernameApiError("Já existe um usuário com este nome.")
        }
        if (error.response?.data.email) {
          setEmailApiError("Já existe um usuário com este email")
        }
      }
    },
  })

  const onSubmit = (data: SignInUser) => {
    mutate(data)
  }

  return (
    <form
      className="flex h-fit w-full flex-col gap-3 rounded-md
    border-2 border-primaryShade bg-primary p-2"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div
        className="mt-1 flex h-fit w-full flex-row items-end
        gap-2 border-b-2 border-secondaryShade pb-2"
      >
        <span
          className="h-4 w-4 rounded-full bg-secondaryShade
          sm:h-6 sm:w-6"
        ></span>
        <h2
          className="text-end text-base leading-3 sm:text-xl
          sm:leading-6"
        >
          Inscreva-se
        </h2>
      </div>
      <div className="flex flex-col gap-1">
        {renderSignInAuthInput({
          inputType: "text",
          placeholder: "Nome de usuário",
          zodRegisterFn: register,
          zodRegisterName: "username",
          zodErrorCondition: errors.username?.message,
          apiErrorCondition: usernameApiError,
        })}
        {renderSignInAuthInput({
          inputType: "text",
          placeholder: "Email",
          zodRegisterFn: register,
          zodRegisterName: "email",
          zodErrorCondition: errors.email?.message,
          apiErrorCondition: emailApiError,
        })}
        {renderSignInAuthInput({
          inputType: "password",
          placeholder: "Senha",
          zodRegisterFn: register,
          zodRegisterName: "password",
          zodErrorCondition: errors.password?.message,
        })}
        {renderSignInAuthInput({
          inputType: "password",
          placeholder: "Confirmação da senha",
          zodRegisterFn: register,
          zodRegisterName: "confirmPassword",
          zodErrorCondition: errors.confirmPassword?.message,
        })}
        {isError &&
          usernameApiError === null &&
          emailApiError === null &&
          renderErrorMessage("Um erro aconteceu, tente novamente")}
        {isSuccess && (
          <p className="pl-1 text-xs text-sucess">
            Usuário criado com sucesso, entre em sua conta.
          </p>
        )}
      </div>
      <button
        type="submit"
        className="h-8 w-full rounded-md bg-primaryShade
        bg-opacity-70"
      >
        Criar conta
      </button>
    </form>
  )
}

export default SignIn
