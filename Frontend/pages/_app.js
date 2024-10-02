

import Layout from "../Component/Layout";

import "../styles/globals.css";

import { useRouter } from 'next/router' 

import { useEffect, useState } from 'react'
import { ColorRing } from 'react-loader-spinner';




if (!"2437b6ee508a24481ec9cfa2ff6ddadf") {
  throw new Error('You need to provide NEXT_PUBLIC_PROJECT_ID env variable')
}




import { EthereumClient, w3mConnectors, w3mProvider } from '@web3modal/ethereum'
import { Web3Modal } from '@web3modal/react'
import { configureChains, createConfig, WagmiConfig } from 'wagmi'
import {  arbitrum, avalanche, bsc, fantom, mainnet, optimism, polygon, polygonMumbai } from 'wagmi/chains'

const chains = [arbitrum, mainnet,polygonMumbai, polygon]
const projectId = '2437b6ee508a24481ec9cfa2ff6ddadf'

const { publicClient } = configureChains(chains, [w3mProvider({ projectId })])
const wagmiConfig = createConfig({
  autoConnect: true,
  connectors: w3mConnectors({ projectId, chains }),
  publicClient
})
const ethereumClient = new EthereumClient(wagmiConfig, chains)

function MyApp({ Component, pageProps = {} }) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDetails = async () => {
      // Load any necessary data or perform initial setup here
      setLoading(false);
    };
    loadDetails();
  }, []);

  const { pathname } = useRouter();
  
  const [ready, setReady] = useState(false)
  useEffect(() => {
    setReady(true)
  }, []);

  return (
    <>
    <div>
      <div>
        {loading ? (
          <div className = "w-screen h-screen flex flex-col justify-center items-center">
            <ColorRing height = {90}/>
            <div className = "font-semibold text-4xl tracking-widest px-5 text-center">One Ticket</div>
          </div>

          ) : (
            <div>
              {
                ready ? (
                  <div>
                    <div className='big bg-indigo-800'></div>
                    
                    <WagmiConfig config={wagmiConfig}>
                      {/* <Navbar handleLogout={handleLogout}/> */}
                      <Layout>
                        <Component {...pageProps} />
                      </Layout>      
                    </WagmiConfig>
                      
                    {pathname === '/custom' ? null : (
                      <Web3Modal projectId={projectId} ethereumClient={ethereumClient} />
                    )}
                  </div>
                ) : null
              }
            </div>
          )
        }
      </div>
    </div>
    </>
  );
}

export default MyApp;
