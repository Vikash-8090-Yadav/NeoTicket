import { ethers } from 'ethers'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { ToastContainer, toast } from 'react-toastify'
import { notification } from 'antd'
import { marketplaceAddress } from '../config'
import NFTMarketplace from '../abi/marketplace.json'

export default function Home() {
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
      
      const contract = new ethers.Contract(marketplaceAddress, NFTMarketplace.abi, provider)
      const data = await contract.fetchMarketItems()

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
      toast.error("Failed to load NFTs. Please try again.")
    }
  }

  async function buyNft(nft) {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      await provider.send('eth_requestAccounts', [])
      const signer = provider.getSigner()
      const contract = new ethers.Contract(marketplaceAddress, NFTMarketplace.abi, signer)

      const price = ethers.utils.parseUnits(nft.price.toString(), 'ether')   
      const transaction = await contract.createMarketSale(nft.tokenId, {
        value: price
      })
      await transaction.wait()
      loadNFTs()
      toast.success("NFT purchased successfully!")
    } catch (error) {
      console.error("Failed to buy NFT:", error)
      toast.error("Failed to buy NFT. Please try again.")
    }
  }

  if (loadingState === 'loaded' && !nfts.length) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-r from-purple-900 via-blue-800 to-indigo-900">
        <h1 className="text-white text-3xl font-bold">No items in the marketplace</h1>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-purple-900 via-blue-800 to-indigo-900">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center mb-8 text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-pink-600">
          NFT Marketplace
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {nfts.map((nft, i) => (
            <div key={i} className="bg-white rounded-lg overflow-hidden shadow-lg transform transition duration-500 hover:scale-105">
              <div className="h-48 bg-gray-200 flex items-center justify-center overflow-hidden">
                <img 
                  src={nft.image} 
                  alt={nft.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4">
                <h2 className="text-xl font-semibold mb-2 text-gray-800">{nft.name}</h2>
                <p className="text-gray-600 h-20 overflow-y-auto mb-4">{nft.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold text-indigo-600">{nft.price} ETH</span>
                  <button 
                    onClick={() => buyNft(nft)}
                    className="bg-gradient-to-r from-pink-500 to-yellow-500 hover:from-pink-600 hover:to-yellow-600 text-white font-bold py-2 px-4 rounded-full transition duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-xl"
                  >
                    Buy NFT
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <ToastContainer position="bottom-right" autoClose={5000} />
    </div>
  )
}