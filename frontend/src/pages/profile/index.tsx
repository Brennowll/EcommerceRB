import { useState } from "react"
import ProfileView from "./ProfileView"
import OrdersView from "./OrdersView"

const ProfilePage = () => {
  const [profileIsActive, setProfileIsActive] =
    useState<boolean>(true)

  const handleProfileClick = () => {
    setProfileIsActive(true)
  }

  const handleOrdersClick = () => {
    setProfileIsActive(false)
  }

  const titleProfileClass = profileIsActive ? "" : "text-zinc-400"
  const titleOrderClass = profileIsActive ? "text-zinc-400" : ""

  const spanProfileClass = profileIsActive ? "" : "border-opacity-40"
  const spanOrderClass = profileIsActive ? "border-opacity-40" : ""

  return (
    <section className="flex h-fit justify-center">
      <div className="my-20 flex h-fit w-[83rem] flex-col items-center">
        <header
          className="flex w-[calc(100%-60px)] justify-center gap-5
          border-b-2 border-primaryShade pb-2"
        >
          <button
            className="flex flex-col"
            onClick={handleProfileClick}
          >
            <h3
              className={`text-2xl leading-6 transition-all ${titleProfileClass}`}
            >
              Perfil
            </h3>
            <span
              className={`h-1 w-full rounded-lg border-2 border-primaryShade
            transition-all ${spanProfileClass}`}
            ></span>
          </button>
          <button
            className="flex flex-col"
            onClick={handleOrdersClick}
          >
            <h3
              className={`text-2xl leading-6 transition-all ${titleOrderClass}`}
            >
              Pedidos
            </h3>
            <span
              className={`h-1 w-full rounded-lg border-2 border-primaryShade
            transition-all ${spanOrderClass}`}
            ></span>
          </button>
        </header>
        <div className="flex h-fit w-full flex-col pt-5">
          {profileIsActive ? <ProfileView /> : <OrdersView />}
        </div>
      </div>
    </section>
  )
}

export default ProfilePage
