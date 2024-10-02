import Head from 'next/head'
import Home from "./marketplace"
import Link from 'next/link'
import Navbar from "../Component/Course/Nav"

export default function Market() {
  return (
    <div className="min-h-screen bg-gradient-to-r from-purple-900 via-blue-800 to-indigo-900">
      <Head>
        <title>OneTicket Hub - NFT Marketplace</title>
        <meta name="description" content="OneTicket Hub NFT Marketplace" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

 

      <main className="container mx-auto px-4 py-8">
        

        <div className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg rounded-xl shadow-xl p-8">
          <Home />
        </div>
      </main>

      
    </div>
  )
}