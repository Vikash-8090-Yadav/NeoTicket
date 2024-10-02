import { ethers } from 'ethers'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { marketplaceAddress } from '../config'
import NFTMarketplace from '../abi/marketplace.json'
import Navbar from "../Component/Course/Nav"

export default function CreatorDashboard() {
  const [nfts, setNfts] = useState([])
  const [loadingState, setLoadingState] = useState('not-loaded')

  useEffect(() => {
    loadNFTs()
  }, [])

  async function loadNFTs() {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      await provider.send('eth_requestAccounts', [])
      const signer = provider.getSigner()

      const contract = new ethers.Contract(marketplaceAddress, NFTMarketplace.abi, signer)
      const data = await contract.fetchItemsListed()

      const items = await Promise.all(data.map(async i => {
        const tokenUri = await contract.tokenURI(i.tokenId)
        const meta = await axios.get(tokenUri)
        let price = ethers.utils.formatUnits(i.price.toString(), 'ether')
        return {
          price,
          tokenId: i.tokenId.toNumber(),
          seller: i.seller,
          owner: i.owner,
          image: meta.data.image,
          name: meta.data.name,
          description: meta.data.description,
          cid1: meta.data.cid1,
        }
      }))

      setNfts(items)
      setLoadingState('loaded')
    } catch (error) {
      console.error("Failed to load NFTs:", error)
      setLoadingState('loaded') // Set to loaded even on error to remove loading spinner
    }
  }

  if (loadingState === 'not-loaded') {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-r from-purple-900 via-blue-800 to-indigo-900">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-white"></div>
      </div>
    )
  }

  if (loadingState === 'loaded' && !nfts.length) {
    return (
      <div className="min-h-screen bg-gradient-to-r from-purple-900 via-blue-800 to-indigo-900">
        <div className="flex items-center justify-center h-screen">
          <h1 className="text-3xl font-bold text-white">No Events Created</h1>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-purple-900 via-blue-800 to-indigo-900">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center mb-8 text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-pink-600">
          Creator Dashboard
        </h1>
        <h2 className="text-2xl font-semibold mb-6 text-white">Your Listed Events</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {nfts.map((nft, i) => (
            <div key={i} className="bg-white rounded-xl overflow-hidden shadow-lg transition-all duration-300 hover:shadow-2xl hover:scale-105 w-64">
              <div className="h-48 overflow-hidden">
                <img src={nft.image} alt={nft.name} className="w-full h-full object-cover" />
              </div>
              <div className="p-4">
                <h3 className="text-xl font-semibold mb-2 text-gray-800 truncate">{nft.name}</h3>
                <p className="text-gray-600 mb-4 h-12 overflow-hidden">{nft.description}</p>
                <div className="flex justify-between items-center">
                  <p className="text-2xl font-bold text-indigo-600">{nft.price} ETH</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}