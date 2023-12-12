import SignUp from "./SignUp"
import SignIn from "./SignIn"

const LoginPage = () => {
  return (
    <section
      className="flex h-full w-full
      items-center justify-center overflow-y-auto"
    >
      <div
        className="m-1 flex w-[27rem]
        flex-col items-center justify-center gap-2"
      >
        <SignUp />
        <span
          className="w-[calc(100%-10px)] rounded-md
          border-b-2 border-secondaryShade"
        ></span>
        <SignIn />
      </div>
    </section>
  )
}

export default LoginPage
