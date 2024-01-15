import { ColorRing } from "react-loader-spinner"

export const LoadingSpinner = () => {
  return (
    <ColorRing
      height={60}
      width={60}
      colors={["#BEA889", "#BEA889", "#BEA889", "#BEA889", "#BEA889"]}
    />
  )
}
