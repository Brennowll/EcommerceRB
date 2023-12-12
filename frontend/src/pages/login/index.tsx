import { useState, useContext } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useNavigate } from "react-router-dom"
import { zodResolver } from "@hookform/resolvers/zod"
import Cookies from "js-cookie"
import axios from "axios"
import { useMutation } from "react-query"
import { GlobalStateContext } from "../../store/GlobalStateProvider"
import { api } from "../../store/QueryClient"

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

const signInSchema = z
  .object({
    username: z
      .string()
      .nonempty("Nome de usuário é obrigatório.")
      .min(3, "Nome de usuário deve ter pelo menos 3 caracteres.")
      .max(
        30,
        "Nome de usuário excede o limite de caracteres, Máx 30.",
      )
      .refine((value) => value.split("\n").length <= 1, {
        message: `Nome de usuário pode ter no máximo ${1} linha.`,
      })
      .refine(
        (value) => value.trim() !== "",
        "O nome de usuário não pode ser apenas espaços.",
      ),
    email: z
      .string()
      .nonempty("Email é obrigatório.")
      .min(3, "Email deve ter pelo menos 3 caracteres.")
      .max(40, "Email excede o limite de caracteres, Máx 40.")
      .email("Email não é válido.")
      .refine((value) => value.split("\n").length <= 1, {
        message: `Email pode ter no máximo ${1} linha.`,
      })
      .refine(
        (value) => value.trim() !== "",
        "O email não pode ser apenas espaços.",
      ),
    password: z
      .string()
      .nonempty("Senha é obrigatória.")
      .min(8, "Senha deve ter pelo menos 8 caracteres.")
      .max(40, "Senha excede o limite de caracteres, Máx 40.")
      .refine((value) => value.split("\n").length <= 1, {
        message: `Senha pode ter no máximo ${1} linha.`,
      })
      .refine(
        (value) => value.trim() !== "",
        "A senha não pode ser apenas espaços.",
      )
      .refine((value) => {
        // Verificar complexidade da senha (exemplo simples)
        const hasUpperCase = /[A-Z]/.test(value)
        const hasLowerCase = /[a-z]/.test(value)
        const hasDigits = /\d/.test(value)
        const hasSpecialChars = /[^A-Za-z0-9]/.test(value)
        return (
          hasUpperCase && hasLowerCase && hasDigits && hasSpecialChars
        )
      }, "Senha deve incluir letras maiúsculas, minúsculas, dígitos e caracteres especiais."),
    confirmPassword: z
      .string()
      .nonempty("Confirmação da senha é obrigatória."),
    // address: z
    //   .string()
    //   .nonempty("O endereço é obrigatório.")
    //   .min(3, "O endereço deve ter pelo menos 3 caracteres.")
    //   .max(50, "O endereço excede o limite de caracteres, Máx 50.")
    //   .refine((value) => value.split("\n").length <= 1, {
    //     message: `O endereço pode ter no máximo ${1} linha.`,
    //   })
    //   .refine(
    //     (value) => value.trim() !== "",
    //     "O endereço não pode ser apenas espaços.",
    //   ),
    // cellphone: z
    //   .string()
    //   .nonempty("O telefone é obrigatório.")
    //   .min(
    //     10,
    //     "O telefone é inválido, não esqueça de adicionar o ddd.",
    //   )
    //   .max(12, "O telefone excede o limite de caracteres.")
    //   .refine(
    //     (value) => /^\d+$/.test(value),
    //     "O número de telefone deve conter apenas dígitos.",
    //   ),
  })
  .superRefine(({ confirmPassword, password }, ctx) => {
    if (confirmPassword !== password) {
      ctx.addIssue({
        code: "custom",
        message: "As senhas não são iguais.",
      })
    }
  })

type SignUpUser = z.infer<typeof signUpSchema>
type SignInUser = z.infer<typeof signInSchema>

const LoginPage = () => {
  const { setUserIsLogged } = useContext(GlobalStateContext)
  const [loginApiError, setLoginApiError] = useState<string | null>()
  const [usernameApiError, setUsernameApiError] = useState<
    string | null
  >(null)
  const [emailApiError, setEmailApiError] = useState<string | null>(
    null,
  )
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpUser>({
    resolver: zodResolver(signUpSchema),
  })

  const {
    register: signInRegister,
    handleSubmit: signInHandleSubmit,
    formState: { errors: signInErrors },
    reset: signInReset,
  } = useForm<SignInUser>({
    resolver: zodResolver(signInSchema),
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

  const {
    mutate: signInMutate,
    isSuccess: signInSucess,
    isError: signInError,
  } = useMutation({
    mutationFn: async (data: SignInUser) => {
      const response = await api.post("/create_user/", {
        username: data.username,
        email: data.email,
        password: data.password,
      })

      return response.data
    },
    onSuccess: () => {
      signInReset()
    },
    onError: (error) => {
      if (axios.isAxiosError(error)) {
        if (error.response?.data.username) {
          setUsernameApiError(error.response?.data.username[0])
        }
        if (error.response?.data.email) {
          setEmailApiError(error.response?.data.email[0])
        }
      }
    },
  })

  const signInOnSubmit = (data: SignInUser) => {
    signInMutate(data)
  }

  const onSubmit = (data: SignUpUser) => {
    mutate({
      email: data.email,
      password: data.password,
    })
  }

  return (
    <section
      className="flex h-full w-full
      items-center justify-center overflow-y-auto"
    >
      <div
        className="m-1 flex w-[27rem]
        flex-col items-center justify-center gap-2"
      >
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
            {errors.email && (
              <p
                className="text-myRed
                pl-1 text-xs text-error"
              >
                {errors.email.message}
              </p>
            )}
            <input
              type="password"
              placeholder="Senha"
              className={`rounded-sm px-1
              py-[0.10rem] focus:outline-none ${
                errors.password && "border-2 border-error"
              }`}
              {...register("password")}
            />
            {errors.password && (
              <p className="pl-1 text-xs text-error">
                {errors.password.message}
              </p>
            )}
            {loginApiError != null && (
              <p
                className="text-myRed
                pl-1 text-xs text-error"
              >
                {loginApiError}
              </p>
            )}
          </div>
          <button
            type="submit"
            className="bg h-8 w-full rounded-md
            bg-primaryShade bg-opacity-70"
          >
            Entrar
          </button>
        </form>
        <span
          className="w-[calc(100%-10px)] rounded-md
          border-b-2 border-secondaryShade"
        ></span>
        <form
          className="flex h-fit w-full flex-col gap-3 rounded-md
          border-2 border-primaryShade bg-primary p-2"
          onSubmit={signInHandleSubmit(signInOnSubmit)}
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
            <input
              type="text"
              placeholder="Nome de usuário"
              className={`rounded-sm px-1
              py-[0.10rem] focus:outline-none ${
                signInErrors.username && "border-2 border-error"
              }`}
              {...signInRegister("username")}
            />
            {signInErrors.username && (
              <p className="pl-1 text-xs text-error">
                {signInErrors.username.message}
              </p>
            )}
            {usernameApiError != null && (
              <p className="pl-1 text-xs text-error">
                {usernameApiError}
              </p>
            )}
            <input
              type="text"
              placeholder="Email"
              className={`rounded-sm px-1
              py-[0.10rem] focus:outline-none ${
                signInErrors.email && "border-2 border-error"
              }`}
              {...signInRegister("email")}
            />
            {signInErrors.email && (
              <p className="pl-1 text-xs text-error">
                {signInErrors.email.message}
              </p>
            )}
            {emailApiError != null && (
              <p className="pl-1 text-xs text-error">
                {emailApiError}
              </p>
            )}
            <input
              type="password"
              placeholder="Senha"
              className={`rounded-sm px-1
              py-[0.10rem] focus:outline-none ${
                signInErrors.password && "border-2 border-error"
              }`}
              {...signInRegister("password")}
            />
            {signInErrors.password && (
              <p className="pl-1 text-xs text-error">
                {signInErrors.password.message}
              </p>
            )}
            <input
              type="password"
              placeholder="Confirmação da senha"
              className={`rounded-sm px-1
              py-[0.10rem] focus:outline-none ${
                signInErrors.confirmPassword &&
                "border-2 border-error"
              }`}
              {...signInRegister("confirmPassword")}
            />
            {signInErrors.confirmPassword && (
              <p className="pl-1 text-xs text-error">
                {signInErrors.confirmPassword.message}
              </p>
            )}
            {signInError &&
              usernameApiError === null &&
              emailApiError === null && (
                <p
                  className="text-myRed mb-1 pb-2
                  pl-3 text-xs"
                >
                  Um erro aconteceu, tente novamente
                </p>
              )}
            {signInSucess && (
              <p
                className="mb-1 pb-2 pl-3
                text-xs text-sucess"
              >
                User created succesfully. Please login
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
      </div>
    </section>
  )
}

export default LoginPage
