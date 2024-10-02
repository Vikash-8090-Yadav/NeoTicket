import { marketplaceAddress } from '../config'
import NFTMarketplace from '../abi/marketplace.json'
import { useState, useEffect } from "react"
import { ethers } from "ethers"
import Buy from "../Component/v1.0.0/Review/Buys"
import Memos from "../Component/v1.0.0/Review/Memos"

function Review() {
  const [state, setState] = useState({
    provider: null,
    signer: null,
    contract: null,
  })
  const [account, setAccount] = useState("None")
  const [loadingState, setLoadingState] = useState('not-loaded')

  useEffect(() => {
    const connectWallet = async () => {
      try {
        setLoadingState('loading')
        const contractAddress = marketplaceAddress
        const contractABI = NFTMarketplace.abi
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()
        const contract = new ethers.Contract(
          contractAddress,
          contractABI,
          signer
        )
        const accounts = await provider.listAccounts()
        setAccount(accounts[0])
        setState({ provider, signer, contract })
        setLoadingState('loaded')
      } catch (error) {
        console.error("Failed to connect wallet:", error)
        setLoadingState('loaded')
      }
    }
    connectWallet()
  }, [])

  if (loadingState === 'not-loaded' || loadingState === 'loading') {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-r from-purple-900 via-blue-800 to-indigo-900">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-white"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-purple-900 via-blue-800 to-indigo-900">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center mb-8 text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-pink-600">
          Review
        </h1>
        <div className="space-y-8">
          <Buy state={state} />
          <Memos state={state} />
        </div>
      </div>
    </div>
  )
}

export default Review