import { useEffect, useState } from 'react'
import { ethers } from 'ethers'
import { useRouter } from 'next/router'
import axios from 'axios'
import Web3Modal from 'web3modal'
import Navbar from "../Component/Course/Nav"
import { marketplaceAddress } from '../config'
import NFTMarketplace from '../abi/marketplace.json'

export default function ResellNFT() {
  const [formInput, updateFormInput] = useState({ price: '', image: '' })
  const router = useRouter()
  const { id, tokenURI } = router.query
  const { image, price } = formInput

  useEffect(() => {
    fetchNFT()
  }, [id])

  async function fetchNFT() {
    if (!tokenURI) return
    try {
      const meta = await axios.get(tokenURI)
      updateFormInput(state => ({ ...state, image: meta.data.image }))
    } catch (error) {
      console.error("Error fetching NFT metadata:", error)
    }
  }

  async function listNFTForSale() {
    if (!price) return
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      await provider.send('eth_requestAccounts', [])
      const signer = provider.getSigner()

      const priceFormatted = ethers.utils.parseUnits(formInput.price, 'ether')
      let contract = new ethers.Contract(marketplaceAddress, NFTMarketplace.abi, signer)
      let listingPrice = await contract.getListingPrice()

      listingPrice = listingPrice.toString()
      let transaction = await contract.resellToken(id, priceFormatted, { value: listingPrice })
      await transaction.wait()
   
      router.push('/marketplace')
    } catch (error) {
      console.error("Error listing NFT for sale:", error)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-purple-900 via-blue-800 to-indigo-900">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center mb-8 text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-pink-600">
          Resell Your NFT
        </h1>
        <div className="max-w-md mx-auto bg-white bg-opacity-10 rounded-xl shadow-md overflow-hidden md:max-w-2xl">
          <div className="md:flex">
            <div className="p-8 w-full">
              <div className="mb-4">
                <label htmlFor="price" className="block text-sm font-medium text-gray-300">
                  Ticket Price in ETH
                </label>
                <input
                  type="text"
                  id="price"
                  placeholder="0.1"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white bg-opacity-20 text-white"
                  onChange={e => updateFormInput({ ...formInput, price: e.target.value })}
                />
              </div>
              {image && (
                <div className="mt-4">
                  <img className="w-full h-64 object-cover rounded-md" src={image} alt="NFT" />
                </div>
              )}
              <button
                onClick={listNFTForSale}
                className="mt-6 w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-pink-500 to-yellow-500 hover:from-pink-600 hover:to-yellow-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105"
              >
                List NFT for Sale
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}