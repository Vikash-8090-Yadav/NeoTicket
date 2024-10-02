import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Layout from "../Component/Layout"
import "../styles/globals.css"
import { EthereumClient, w3mConnectors, w3mProvider } from '@web3modal/ethereum'
import { Web3Modal } from '@web3modal/react'
import { configureChains, createConfig, WagmiConfig } from 'wagmi'
import { arbitrum, mainnet, polygonMumbai, polygon } from 'wagmi/chains'

if (!"2437b6ee508a24481ec9cfa2ff6ddadf") {
  throw new Error('You need to provide NEXT_PUBLIC_PROJECT_ID env variable')
}

const chains = [arbitrum, mainnet, polygonMumbai, polygon]
const projectId = "2437b6ee508a24481ec9cfa2ff6ddadf"

const { publicClient } = configureChains(chains, [w3mProvider({ projectId })])
const wagmiConfig = createConfig({
  autoConnect: true,
  connectors: w3mConnectors({ projectId, chains }),
  publicClient
})
const ethereumClient = new EthereumClient(wagmiConfig, chains)

function MyApp({ Component, pageProps = {} }) {
  const [loading, setLoading] = useState(true)
  const [ready, setReady] = useState(false)
  const { pathname } = useRouter()

  useEffect(() => {
    const loadDetails = async () => {
      // Load any necessary data or perform initial setup here
      await new Promise(resolve => setTimeout(resolve, 2000)) // Simulating loading time
      setLoading(false)
    }
    loadDetails()
    setReady(true)
  }, [])

  if (loading || !ready) {
    return (
      <div className="fixed inset-0 bg-gradient-to-r from-purple-900 via-blue-800 to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-white"></div>
          <h1 className="mt-8 text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-pink-600">
            OneTicket
          </h1>
          <p className="mt-2 text-white text-xl">Loading amazing experiences...</p>
        </div>
      </div>
    )
  }

  return (
    <>
      
        <Layout>
          <Component {...pageProps} />
        </Layout>      
     
      
      
    </>
  )
}

export default MyApp