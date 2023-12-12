import { useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import axios from "axios"
import { useMutation } from "react-query"
import { api } from "../../../store/QueryClient"

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
        // Verificar complexidade da senha
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

type SignInUser = z.infer<typeof signInSchema>

const renderErrorMessage = (message: string | undefined | null) => {
  return message ? (
    <p className="text-myRed pl-1 text-xs text-error">{message}</p>
  ) : null
}

const SignIn = () => {
  const {
    register: signInRegister,
    handleSubmit: signInHandleSubmit,
    formState: { errors: signInErrors },
    reset: signInReset,
  } = useForm<SignInUser>({
    resolver: zodResolver(signInSchema),
  })

  const [usernameApiError, setUsernameApiError] = useState<
    string | null
  >(null)
  const [emailApiError, setEmailApiError] = useState<string | null>(
    null,
  )

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

  return (
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
        {renderErrorMessage(signInErrors.username?.message)}
        {renderErrorMessage(usernameApiError)}
        <input
          type="text"
          placeholder="Email"
          className={`rounded-sm px-1
          py-[0.10rem] focus:outline-none ${
            signInErrors.email && "border-2 border-error"
          }`}
          {...signInRegister("email")}
        />
        {renderErrorMessage(signInErrors.email?.message)}
        {renderErrorMessage(emailApiError)}
        <input
          type="password"
          placeholder="Senha"
          className={`rounded-sm px-1
          py-[0.10rem] focus:outline-none ${
            signInErrors.password && "border-2 border-error"
          }`}
          {...signInRegister("password")}
        />
        {renderErrorMessage(signInErrors.password?.message)}
        <input
          type="password"
          placeholder="Confirmação da senha"
          className={`rounded-sm px-1
          py-[0.10rem] focus:outline-none ${
            signInErrors.confirmPassword && "border-2 border-error"
          }`}
          {...signInRegister("confirmPassword")}
        />
        {renderErrorMessage(signInErrors.confirmPassword?.message)}
        {signInError &&
          usernameApiError === null &&
          emailApiError === null &&
          renderErrorMessage("Um erro aconteceu, tente novamente")}
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
  )
}

export default SignIn
