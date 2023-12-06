import { QueryClientProvider } from "react-query"
import { BrowserRouter } from "react-router-dom"
import { queryClient } from "./store/QueryClient"
import GlobalStateProvider from "./store/GlobalStateProvider"
import "/src/App.css"
import Layout from "./pages/(layout)"

function App() {
  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <GlobalStateProvider>
          <Layout />
        </GlobalStateProvider>
      </QueryClientProvider>
    </BrowserRouter>
  )
}

export default App
