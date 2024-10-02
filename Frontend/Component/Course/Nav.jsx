import React, { useState, useEffect } from "react"
import Link from 'next/link'
import { ethers } from 'ethers'

function NavLink({ to, children }) {
  return (
    <Link href={to}>
      <a className="text-white hover:text-yellow-300 px-4 py-2 rounded-md text-lg font-medium transition duration-150 ease-in-out">
        {children}
      </a>
    </Link>
  )
}

export default function Navbar() {
  const [accountAddress, setAccountAddress] = useState('')
  const [isCopied, setIsCopied] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    const storedAddress = localStorage.getItem("filWalletAddress")
    if (storedAddress) {
      setAccountAddress(storedAddress)
    }
  }, [])

  const handleLogin = async () => {
    if (typeof window.ethereum !== "undefined") {
      try {
        await window.ethereum.request({ method: 'eth_requestAccounts' })
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()
        const address = await signer.getAddress()
        localStorage.setItem("filWalletAddress", address)
        setAccountAddress(address)
      } catch (error) {
        console.error("Failed to connect wallet:", error)
      }
    } else {
      alert("Please install MetaMask!")
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("filWalletAddress")
    setAccountAddress('')
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(accountAddress)
    setIsCopied(true)
    setTimeout(() => setIsCopied(false), 2000)
  }

  function truncateAddress(address) {
    if (!address) return ''
    return `${address.slice(0, 6)}...${address.slice(-4)}`
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
              <div className="flex items-center space-x-4">
                <span className="text-gray-300 text-lg">{truncateAddress(accountAddress)}</span>
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
                <div className="flex flex-col space-y-2">
                  <span className="text-gray-300 text-lg">{truncateAddress(accountAddress)}</span>
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