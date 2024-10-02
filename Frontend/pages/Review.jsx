import {
    marketplaceAddress
  } from '../config'
  
  import NFTMarketplace from '../abi/marketplace.json'
  

import { useState, useEffect } from "react";
import { ethers } from "ethers";
import Buy from  "../Component/v1.0.0/Review/Buys"
import Memos from "../Component/v1.0.0/Review/Memos";



function Review() {
  const [state, setState] = useState({
    provider: null,
    signer: null,
    contract: null,
  });
  const [account, setAccount] = useState("None");
  useEffect(() => {
    const connectWallet = async () => {
      const contractAddress = marketplaceAddress;
      const contractABI =  NFTMarketplace.abi;
      const provider = new ethers.providers.Web3Provider(ethereum);
          const signer = provider.getSigner();
          const contract = new ethers.Contract(
            contractAddress,
            contractABI,
            signer
          );
          setAccount(account);
          setState({ provider, signer, contract });
     
    };
    connectWallet();
    
  }, []);
  // console.log(state);
  return (
    <div className ="">
      <div className="">
        <Buy state={state} />
        <Memos state={state} />
      </div>
    </div>
  );
}

export default Review;