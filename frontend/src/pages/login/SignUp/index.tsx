import { useState, useContext } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation, useQueryClient } from "react-query"
import { useNavigate } from "react-router-dom"
import { z } from "zod"
import axios from "axios"

import { api } from "../../../store/QueryClient"
import { GlobalStateContext } from "../../../store/GlobalStateProvider"
import { signUpUserSchema } from "../../../store/zodSchemas"
import {
  renderSignUpAuthInput,
  renderErrorMessage,
} from "../../../store/functions"

type SignUpUser = z.infer<typeof signUpUserSchema>

const SignUp = () => {
  const { setUserIsLogged } = useContext(GlobalStateContext)
  const [loginApiError, setLoginApiError] = useState<string | null>()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpUser>({
    resolver: zodResolver(signUpUserSchema),
  })

  const { mutate } = useMutation({
    mutationFn: async (data: SignUpUser) => {
      setLoginApiError(null)

      const response = await api.post("/token/", {
        username: data.email,
        password: data.password,
      })

      return response.data
    },
    onSuccess: () => {
      setUserIsLogged(true)
      queryClient.refetchQueries("tokenValidation")
      navigate("/pecas")
    },
    onError: (error) => {
      if (axios.isAxiosError(error)) {
        if (error.response?.data.detail) {
          setLoginApiError(error.response?.data.detail)
        }
      }
    },
  })

  const onSubmit = (data: SignUpUser) => {
    mutate({
      email: data.email,
      password: data.password,
    })
  }

  return (
    <form
      className="flex h-fit w-full flex-col
      gap-3 rounded-md border-2 border-primaryShade
      bg-primary p-2"
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
          Login
        </h2>
      </div>
      <div className="flex flex-col gap-1">
        {renderSignUpAuthInput({
          inputType: "text",
          placeholder: "Email",
          zodRegisterFn: register,
          zodRegisterName: "email",
          zodErrorCondition: errors.email?.message,
        })}
        {renderSignUpAuthInput({
          inputType: "password",
          placeholder: "Senha",
          zodRegisterFn: register,
          zodRegisterName: "password",
          zodErrorCondition: errors.password?.message,
        })}
        {renderErrorMessage(loginApiError)}
      </div>
      <button
        type="submit"
        className="bg h-8 w-full rounded-md
        bg-primaryShade bg-opacity-70"
      >
        Entrar
      </button>
    </form>
  )
}

export default SignUp
