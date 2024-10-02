import React, { useState, useEffect } from "react"
import Link from 'next/link'
import { ethers } from 'ethers'
import { Web3 } from 'web3'

function NavLink({ to, children }) {
  return (
    <Link href={to}>
      <a className="text-white hover:text-yellow-300 px-4 py-2 rounded-md text-lg font-medium transition duration-150 ease-in-out">
        {children}
      </a>
    </Link>
  )
}

const networks = {
  NeoTestnet: {
    chainId: `0x${Number(12227332).toString(16)}`,
    chainName: "NeoTestnet",
    nativeCurrency: {
      name: "NeoTestnet",
      symbol: "GAS",
      decimals: 18,
    },
    rpcUrls: ["https://neoxt4seed1.ngd.network"],
    blockExplorerUrls: ['https://xt4scan.ngd.network/'],
  },
}

export default function Navbar() {
  const [accountAddress, setAccountAddress] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [balance, setBalance] = useState('0')
  const [isHovered, setIsHovered] = useState(false)

  useEffect(() => {
    const storedAddress = localStorage.getItem("filWalletAddress")
    if (storedAddress) {
      setAccountAddress(storedAddress)
      fetchBalance(storedAddress)
    }
  }, [])

  const fetchBalance = async (address) => {
    if (typeof window.ethereum !== 'undefined') {
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const balance = await provider.getBalance(address)
      setBalance(ethers.utils.formatEther(balance))
    }
  }

  const handleLogin = async () => {
    setLoading(true)
    
    if(typeof window.ethereum == "undefined"){
      console.log("Please install the metamask")
    }
    let web3 = new Web3(window.ethereum)

    const chainId = await web3.eth.getChainId()
    const NeoTestnetChainId = parseInt(networks.NeoTestnet.chainId, 16)

    console.log(parseInt(chainId))
    console.log("The neo testnet chain id is", parseInt(chainId))

    const chainId1 = parseInt(chainId)
    
    if(chainId1 !== NeoTestnetChainId){
      await window.ethereum.request({
        method: "wallet_addEthereumChain",
        params: [{
          ...networks["NeoTestnet"]
        }]
      })
    }
    const accounts = await web3.eth.requestAccounts()

    console.log(accounts)
    const Address = accounts[0]
    if (typeof window !== 'undefined') {
      localStorage.setItem("filWalletAddress", Address)
    }

    console.log(Address)
    setAccountAddress(Address)
    fetchBalance(Address)

    setLoading(false)
    window.location.reload()
  }

  const handleLogout = () => {
    localStorage.removeItem("filWalletAddress")
    setAccountAddress('')
    setIsDropdownOpen(false)
    setBalance('0')
  }

  function truncateAddress(address) {
    if (!address) return ''
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  const getEtherscanLink = (address) => {
    return `https://xt4scan.ngd.network/address/${address}`
  }

  return (
    <nav className="sticky top-0 z-50 bg-gradient-to-r from-purple-900 via-blue-800 to-indigo-900 shadow-lg">
      <div className="max-w-full mx-auto px-6 lg:px-12">
        <div className="flex items-center justify-between h-24">
          <div className="flex items-center space-x-8">
            <Link href="/">
              <a className="flex-shrink-0">
                <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-pink-600">
                  OneTicket
                </h1>
              </a>
            </Link>
            <div className="hidden lg:block">
              <div className="flex items-baseline space-x-6">
                <NavLink to="/Market">HOME</NavLink>
                <NavLink to="/sellnft">Create Event</NavLink>
                <NavLink to="/mynft">MY Ticket</NavLink>
                <NavLink to="/dashboard">DASHBOARD</NavLink>
                <NavLink to="/Review">Your experience!!</NavLink>
              </div>
            </div>
          </div>
          <div className="hidden lg:flex items-center space-x-6">
            {accountAddress ? (
              <div className="flex items-center">
                <span className="text-white text-lg mr-4">{truncateAddress(accountAddress)}</span>
                <div className="relative">
                  <button
                    onMouseEnter={() => {
                      setIsDropdownOpen(true)
                      setIsHovered(true)
                    }}
                    onMouseLeave={() => setIsHovered(false)}
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className={`w-10 h-10 rounded-full bg-gradient-to-r from-pink-500 to-yellow-500 flex items-center justify-center text-white font-bold text-lg focus:outline-none overflow-hidden transition-all duration-300 hover:shadow-lg hover:scale-105 ${
                      isHovered ? 'ring-2 ring-white' : ''
                    }`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </button>
                  {isDropdownOpen && (
                    <div 
                      className="absolute right-0 mt-2 w-64 bg-gradient-to-br from-purple-900 to-indigo-900 rounded-md shadow-lg py-1 z-10"
                      onMouseEnter={() => setIsHovered(true)}
                      onMouseLeave={() => setIsHovered(false)}
                    >
                      <div className="px-4 py-3 text-sm text-gray-200 border-b border-gray-700 flex justify-between items-center">
                        <span className="font-medium">Account</span>
                        <a 
                          href={getEtherscanLink(accountAddress)} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-yellow-400 hover:text-yellow-300 transition-colors duration-200"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                        </a>
                      </div>
                      <div className="px-4 py-3 text-sm text-gray-200 border-b border-gray-700">
                        <p className="font-medium text-yellow-400">Address</p>
                        <p className="truncate">{accountAddress}</p>
                      </div>
                      <div className="px-4 py-3 text-sm text-gray-200 border-b border-gray-700">
                        <p className="font-medium text-yellow-400">Balance</p>
                        <p>{parseFloat(balance).toFixed(4)} GAS</p>
                      </div>
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-200 hover:bg-purple-800 transition duration-150 ease-in-out"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <button
                onClick={handleLogin}
                className="bg-gradient-to-r from-pink-500 to-yellow-500 hover:from-pink-600 hover:to-yellow-600 text-white text-lg font-bold py-3 px-8 rounded-full transition duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-xl"
              >
                Connect Wallet
              </button>
            )}
          </div>
          <div className="lg:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-3 rounded-md text-white hover:text-yellow-300 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
            >
              <span className="sr-only">Open main menu</span>
              {!isOpen ? (
                <svg className="block h-8 w-8" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              ) : (
                <svg className="block h-8 w-8" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="lg:hidden">
          <div className="px-4 pt-2 pb-3 space-y-2">
            <NavLink to="/Market">HOME</NavLink>
            <NavLink to="/sellnft">Create Event</NavLink>
            <NavLink to="/mynft">MY Ticket</NavLink>
            <NavLink to="/dashboard">DASHBOARD</NavLink>
            <NavLink to="/Review">Your experience!!</NavLink>
          </div>
          <div className="pt-4 pb-4 border-t border-gray-700">
            <div className="flex items-center px-5">
              {accountAddress ? (
                <div className="flex items-center space-x-4">
                  <span className="text-white text-lg">{truncateAddress(accountAddress)}</span>
                  <button
                    onClick={handleLogout}
                    className="bg-red-500 hover:bg-red-600 text-white text-lg font-medium py-2 px-6 rounded-full transition duration-150 ease-in-out"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <button
                  onClick={handleLogin}
                  className="bg-gradient-to-r from-pink-500 to-yellow-500 hover:from-pink-600 hover:to-yellow-600 text-white text-lg font-bold py-3 px-8 rounded-full transition duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-xl"
                >
                  Connect Wallet
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}