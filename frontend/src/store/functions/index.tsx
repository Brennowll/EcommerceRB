import { UseFormRegister } from "react-hook-form"
import wppIcon from "/src/assets/whatsappIcon.svg"
import instagramIcon from "/src/assets/instagramIcon.svg"
import facebookIcon from "/src/assets/facebookIcon.svg"
import phoneIcon from "/src/assets/phoneIcon.svg"

type RenderAuthInputProps<T extends object> = {
  inputType: string
  placeholder: string
  zodRegisterFn: UseFormRegister<T>
  zodRegisterName: keyof T
  zodErrorCondition?: string
  apiErrorCondition?: string
}

type RenderAuthInputSignInProps = RenderAuthInputProps<{
  email: string
  password: string
  username: string
  confirmPassword: string
}>

type RenderAuthInputSignUpProps = RenderAuthInputProps<{
  email: string
  password: string
}>

export const renderContactIcons = (containerClass?: string) => {
  const contactLink = (
    href: string,
    imgSrc: string,
    imgAlt: string,
  ) => {
    return (
      <a href={href} target="_blank">
        <img
          src={imgSrc}
          alt={imgAlt}
          className="h-6 transition-all hover:h-7"
        />
      </a>
    )
  }

  return (
    <nav
      className={`flex w-32 flex-row justify-center gap-2 ${containerClass}`}
    >
      {contactLink("/", wppIcon, "Ícone do aplicativo whatsapp")}
      {contactLink(
        "https://www.instagram.com/boutiquerimini/",
        instagramIcon,
        "Ícone do aplicativo instagram",
      )}
      {contactLink(
        "https://pt-br.facebook.com/boutiquerimini/",
        facebookIcon,
        "Ícone do aplicativo facebook",
      )}
      {contactLink("/", phoneIcon, "Ícone de um telefone")}
    </nav>
  )
}

export const renderErrorMessage = (
  message: string | undefined | null,
) => {
  return message ? (
    <p className="text-myRed pl-1 text-xs text-error">{message}</p>
  ) : null
}

export const renderSucessMessage = (
  message: string | undefined | null,
) => {
  return message ? (
    <p className="pl-1 text-xs text-sucess">{message}</p>
  ) : null
}

export const renderSignInAuthInput = ({
  inputType,
  placeholder,
  zodRegisterFn,
  zodRegisterName,
  zodErrorCondition,
  apiErrorCondition,
}: RenderAuthInputSignInProps) => {
  return (
    <>
      <input
        type={inputType}
        placeholder={placeholder}
        className={`rounded-sm px-1 py-[0.10rem] focus:outline-none ${
          zodErrorCondition && "border-2 border-error"
        }`}
        {...zodRegisterFn(zodRegisterName)}
      />
      {zodErrorCondition && renderErrorMessage(zodErrorCondition)}
      {apiErrorCondition && renderErrorMessage(apiErrorCondition)}
    </>
  )
}

export const renderSignUpAuthInput = ({
  inputType,
  placeholder,
  zodRegisterFn,
  zodRegisterName,
  zodErrorCondition,
  apiErrorCondition,
}: RenderAuthInputSignUpProps) => {
  return (
    <>
      <input
        type={inputType}
        placeholder={placeholder}
        className={`rounded-sm px-1 py-[0.10rem] focus:outline-none ${
          zodErrorCondition && "border-2 border-error"
        }`}
        {...zodRegisterFn(zodRegisterName)}
      />
      {zodErrorCondition && renderErrorMessage(zodErrorCondition)}
      {apiErrorCondition && renderErrorMessage(apiErrorCondition)}
    </>
  )
}
