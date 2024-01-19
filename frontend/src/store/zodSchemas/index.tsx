import { z } from "zod"

export const signUpUserSchema = z.object({
  email: z
    .string()
    .email("Email não é válido.")
    .refine((value) => value.trim() !== "", {
      message: "O email não pode ser vazio.",
    }),
  password: z
    .string()
    .min(8, "A senha precisa ter no mínimo 8 caracteres.")
    .max(40, "A senha é grande demais, máx 40 caracteres.")
    .refine((value) => value.split("\n").length <= 1, {
      message: `A senha pode ter no máximo ${1} linha.`,
    })
    .refine(
      (value) => value.trim() !== "",
      "A senha não pode ter somente espaços.",
    )
    .refine((value) => value.trim() !== "", {
      message: "A senha não pode ser vazia.",
    }),
})

export const signInUserSchema = z
  .object({
    username: z
      .string()
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
      )
      .refine((value) => value.trim() !== "", {
        message: "O nome de usuário é obrigatório.",
      }),
    email: z
      .string()
      .min(3, "Email deve ter pelo menos 3 caracteres.")
      .max(40, "Email excede o limite de caracteres, Máx 40.")
      .email("Email não é válido.")
      .refine((value) => value.split("\n").length <= 1, {
        message: `Email pode ter no máximo ${1} linha.`,
      })
      .refine(
        (value) => value.trim() !== "",
        "O email não pode ser apenas espaços.",
      )
      .refine((value) => value.trim() !== "", {
        message: "O email é obrigatório",
      }),
    password: z
      .string()
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
      }, "Senha deve incluir letras maiúsculas, minúsculas, dígitos e caracteres especiais.")
      .refine((value) => value.trim() !== "", {
        message: "A senha é obrigatória",
      }),
    confirmPassword: z
      .string()
      .refine((value) => value.trim() !== "", {
        message: "A confirmação da senha é obrigatória",
      }),
  })
  .superRefine(({ confirmPassword, password }, ctx) => {
    if (confirmPassword !== password) {
      ctx.addIssue({
        code: "custom",
        message: "As senhas não são iguais.",
      })
    }
  })

export const userDetailsSchema = z.object({
  cellphone: z.string().refine((value) => /^\d{11}$/.test(value), {
    message: "O telefone deve ter exatamente 11 dígitos numéricos.",
  }),
  adress: z.string().refine((value) => value.trim() !== "", {
    message: "O endereço é obrigatório",
  }),
  cep: z
    .string()
    .refine((value) => value.trim() !== "", {
      message: "O cep é obrigatório",
    })
    .refine((value) => /^\d{5}-\d{3}$/.test(value), {
      message: "O CEP deve seguir o formato 12345-678.",
    }),
})
