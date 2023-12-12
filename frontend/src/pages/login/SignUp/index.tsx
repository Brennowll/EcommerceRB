import { useState, useContext } from "react"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation } from "react-query"
import { useNavigate } from "react-router-dom"
import Cookies from "js-cookie"
import axios from "axios"
import { api } from "../../../store/QueryClient"
import { GlobalStateContext } from "../../../store/GlobalStateProvider"

const signUpSchema = z.object({
  email: z
    .string()
    .nonempty("Email é necessário.")
    .email("Email não é válido."),
  password: z
    .string()
    .nonempty("Password é necessário.")
    .min(8, "A senha precisa ter no mínimo 8 caracteres.")
    .max(40, "A senha é grande demais, máx 40 caracteres.")
    .refine((value) => value.split("\n").length <= 1, {
      message: `A senha pode ter no máximo ${1} linha.`,
    })
    .refine(
      (value) => value.trim() !== "",
      "A senha não pode ter somente espaços.",
    ),
})

type SignUpUser = z.infer<typeof signUpSchema>

const renderErrorMessage = (message: string | undefined | null) => {
  return message ? (
    <p className="text-myRed pl-1 text-xs text-error">{message}</p>
  ) : null
}

const SignUp = () => {
  const { setUserIsLogged } = useContext(GlobalStateContext)
  const [loginApiError, setLoginApiError] = useState<string | null>()
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpUser>({
    resolver: zodResolver(signUpSchema),
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
    onSuccess: (data) => {
      const token = data.access
      const refreshToken = data.refresh

      Cookies.set("access_token", token)
      Cookies.set("refresh_token", refreshToken)

      setUserIsLogged(true)
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
        <input
          type="text"
          placeholder="Email"
          className={`rounded-sm px-1
          py-[0.10rem] focus:outline-none ${
            errors.email && "border-2 border-error"
          }`}
          {...register("email")}
        />
        {renderErrorMessage(errors.email?.message)}
        <input
          type="password"
          placeholder="Senha"
          className={`rounded-sm px-1
          py-[0.10rem] focus:outline-none ${
            errors.password && "border-2 border-error"
          }`}
          {...register("password")}
        />
        {renderErrorMessage(errors.password?.message)}
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
