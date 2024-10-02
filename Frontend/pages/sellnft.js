import React, { useState, useEffect, useCallback } from 'react'
import { ethers } from 'ethers'
import { useRouter } from 'next/router'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { TailSpin } from "react-loader-spinner"
import lighthouse from '@lighthouse-web3/sdk'
import axios from 'axios'
import { create as IPFSHTTPClient } from 'ipfs-http-client'
import Image from "next/image"
import basic from "../Component/v1.0.0/Cards/images/basic.jpg"
import { marketplaceAddress } from '../config'
import NFTMarketplace from '../abi/marketplace.json'

const projectId = '2EFZSrxXvWgXDpOsDrr4cQosKcl'
const ProjectSecret = 'b84c6cb2eec9c4536a0b6424ca709f9d'
const auth = 'Basic ' + Buffer.from(projectId + ':' + ProjectSecret).toString('base64')
const client = IPFSHTTPClient({
  host: 'ipfs.infura.io',
  port: 5001,
  protocol: 'https',
  headers: {
    authorization: auth,
  },
})

const apiKey = "b3b18111.271ba6addd39409a80ac3fee4d78070c"

export default function CreateItem() {
  const [uploadLink, setUploadLink] = useState("")
  const [dynamicLink, setDynamicLink] = useState("")
  const [file, setFile] = useState(null)
  const [LIghthouseCid, SetLIghthouseCid] = useState('')
  const [Uploading, setuploading] = useState(false)
  const [uploaded, setuploaded] = useState(false)
  const [fileUrl, setFileUrl] = useState(null)
  const [formInput, updateFormInput] = useState({ price: '', name: '', description: '' })
  const [loadingState, setLoadingState] = useState('not-loaded')
  const [isCreating, setIsCreating] = useState(false)
  const router = useRouter()

  useEffect(() => {
    setLoadingState('loaded')
  }, [])

  const onChange = useCallback(async (e) => {
    e.preventDefault()
    const file = e.target.files[0]
    try {
      const selectedFile = e.target.files ? file : null
      setFile(selectedFile)
      setUploadLink("")
      setDynamicLink("")
      
      const LightHouseresponse = await lighthouse.uploadText(file, apiKey, "Uploaded Image")
      const cid1 = LightHouseresponse.data.Hash
      const url = `https://gateway.lighthouse.storage/ipfs/${cid1}`
      setFileUrl(url)
      console.log(url)
    } catch (error) {
      console.log('Error uploading file: ', error)
    }
  }, [])

  const uploadToIPFS = useCallback(async () => {
    setuploading(true)
    const { name, description, price } = formInput

    if (!name) {
      toast.warn("Asset Name field is empty")
      return null
    } else if (description == "") {
      toast.warn("Asset description field is empty")
      return null
    } else if (price == "") {
      toast.warn("Price field is empty")
      return null
    } else if (!fileUrl) {
      toast.warn("Files upload required")
      return null
    }

    console.log("Done")
    
    const data = JSON.stringify({
      name,
      description,
      image: fileUrl,
    })

    try {
      const LightHouseresponse = await lighthouse.uploadText(data, apiKey, "Uploaded Image")
      const cid1 = LightHouseresponse.data.Hash

      const datawithcid = JSON.stringify({
        name,
        description,
        image: fileUrl,
        cid1,
      })

      const LightHouseresponse1 = await lighthouse.uploadText(datawithcid, apiKey, "Uploaded Image")
      const cid2 = LightHouseresponse1.data.Hash
      SetLIghthouseCid(cid2)
    
      const LightHouseurl =  `https://gateway.lighthouse.storage/ipfs/${cid2}`
      console.log("The url from the lighthouse is", LightHouseurl)
      
      return LightHouseurl
    } catch (error) {
      toast.warn("Error uploading image")
      console.log('Error uploading file: ', error)
      return null
    } finally {
      setuploading(false)
      setuploaded(true)
    }
  }, [formInput, fileUrl])

  const listNFTForSale = useCallback(async (e) => {
    e.preventDefault()
    setIsCreating(true)

    try {
      const url = await uploadToIPFS()
      if (!url) {
        setIsCreating(false)
        return
      }

      toast.success("Proposal Uploaded to LightHouse")

      const provider = new ethers.providers.Web3Provider(window.ethereum)
      await provider.send('eth_requestAccounts', [])
      const signer = provider.getSigner()

      const price = ethers.utils.parseUnits(formInput.price, 'ether')
      let contract = new ethers.Contract(
        marketplaceAddress,
        NFTMarketplace.abi,
        signer
      )

      const desc = formInput.description
      const name = formInput.name
      const price1 = formInput.price

      const data = JSON.stringify({
        name, price, desc
      })
      const dealParams = {
        num_copies: 1,
        repair_threshold: 28800,
        renew_threshold: 240,
        miner: ["t017840"],
        network: 'calibration',
        add_mock_data: 2
      }

      const response = await lighthouse.uploadText(data, apiKey, "Data for the sale")
      console.log("The cid is ", response.data.Hash)

      const cid = response.data.Hash
      localStorage.setItem("cid11", cid)
      
      let listingPrice = await contract.getListingPrice()
      listingPrice = listingPrice.toString()
      let transaction = await contract.createToken(url, price, { value: listingPrice })
      await transaction.wait()
      
      toast.success("NFT created successfully")
    } catch (error) {
      console.error("Error listing NFT for sale:", error)
      toast.error("Error listing NFT for sale")
    } finally {
      setIsCreating(false)
    }
  }, [formInput, uploadToIPFS])

  if (loadingState === 'not-loaded') {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-r from-purple-900 via-blue-800 to-indigo-900">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-white"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-10 bg-gradient-to-r from-purple-900 via-blue-800 to-indigo-900">
      <div className="container mx-auto mt-10">
        <div className="w-11/12 md:w-8/12 bg-white flex flex-col md:flex-row rounded-xl mx-auto shadow-2xl overflow-hidden transition-all duration-300 hover:shadow-3xl">
          <div className="md:w-1/2 bg-black flex flex-col justify-center items-center p-6">
            <div className="relative w-full h-64">
              <Image 
                src={basic} 
                layout="fill"
                objectFit="cover"
                className="rounded-md transition-transform duration-300 hover:scale-105" 
                alt="Event Image" 
              />
            </div>
          </div>
          <div className="md:w-1/2 py-10 px-12 bg-gradient-to-br from-gray-900 to-gray-800 text-white">
            <h2 className="text-3xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-pink-600">List Your Event</h2>
            <form onSubmit={listNFTForSale}>
              <div className="mb-6">
                <input 
                  placeholder="Event Name" 
                  className="w-full px-4 py-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300" 
                  onChange={(e) => updateFormInput({ ...formInput, name: e.target.value })}
                />
              </div>
              <div className="mb-6">
                <textarea 
                  placeholder="Event Description" 
                  className="w-full px-4 py-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300" 
                  rows="4"
                  onChange={(e) => updateFormInput({ ...formInput, description: e.target.value })}
                />
              </div>
              <div className="mb-6">
                <input 
                  placeholder="Event Price in GAS" 
                  className="w-full px-4 py-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300" 
                  onChange={(e) => updateFormInput({ ...formInput, price: e.target.value })}
                />
              </div>
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">Select Event Image</label>
                <div className="flex items-center">
                  <input 
                    type="file" 
                    name="Asset" 
                    className="hidden" 
                    id="file-upload"
                    accept="image/*" 
                    onChange={onChange}
                  />
                  <label 
                    htmlFor="file-upload" 
                    className="cursor-pointer bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg transition-all duration-300"
                  >
                    Choose File
                  </label>
                  <span className="ml-3 text-sm">{file ? file.name : "No file chosen"}</span>
                </div>
              </div>
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-pink-500 to-yellow-500 hover:from-pink-600 hover:to-yellow-600 text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl"
                disabled={isCreating}
              >
                {isCreating ? (
                  <div className="flex items-center justify-center">
                    <TailSpin color="#fff" height={24} width={24} />
                    <span className="ml-2">Creating Ticket...</span>
                  </div>
                ) : (
                  "Create Ticket"
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
      <ToastContainer position="bottom-right" autoClose={5000} />
    </div>
  )
}