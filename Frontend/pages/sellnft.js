import { useState } from 'react';
import { ethers } from 'ethers';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { ToastContainer, toast } from 'react-toastify';
import { TailSpin } from "react-loader-spinner";
import Navbar from "../Component/Course/Nav";
import lighthouse from '@lighthouse-web3/sdk'
import axios from 'axios';
import { upload } from "@spheron/browser-upload";
import { notification } from 'antd';
import { create as IPFSHTTPClient } from 'ipfs-http-client';

const projectId = '2EFZSrxXvWgXDpOsDrr4cQosKcl';
const ProjectSecret = 'b84c6cb2eec9c4536a0b6424ca709f9d';

const auth =
  'Basic ' + Buffer.from(projectId + ':' + ProjectSecret).toString('base64');

const client = IPFSHTTPClient({
  host: 'ipfs.infura.io',
  port: 5001,
  protocol: 'https',
  headers: {
    authorization: auth,
  },
});

let cid1 = null;

const apiKey = "b3b18111.271ba6addd39409a80ac3fee4d78070c" 


import { marketplaceAddress } from '../config';
import NFTMarketplace from '../abi/marketplace.json'

export default function CreateItem() {
// 
// for the sdk

const [uploadLink, setUploadLink] = useState("");
const [dynamicLink, setDynamicLink] = useState("");
const [file, setFile] = useState(null);
const [LIghthouseCid,SetLIghthouseCid] = useState('');

  // 
  const [Uploading, setuploading] = useState(false);
	const [uploaded, setuploaded] = useState(false);
  const [fileUrl, setFileUrl] = useState(null);
  const [formInput, updateFormInput] = useState({ price: '', name: '', description: '' });
  const router = useRouter();

  async function onChange(e) {
    e.preventDefault();
    const file = e.target.files[0];
    try {

    const selectedFile = e.target.files ? file : null;
    setFile(selectedFile);
    setUploadLink("");
    setDynamicLink("");
      




    
      const LightHouseresponse = await lighthouse.uploadText(file, apiKey, "Uploaded Image")

      const cid1 = LightHouseresponse.data.Hash;
      const url = `https://gateway.lighthouse.storage/ipfs/${cid1}`;
      setFileUrl(url);
      console.log(url);
    } catch (error) {
      console.log('Error uploading file: ', error);
    }

    

  }

  async function uploadToIPFS() {
		setuploading(true);
    const { name, description, price } = formInput;


    if( !name){
      toast.warn("Asset Name filed is empty");
    }
    else if(description == ""){
      toast.warn("Asset description filed is empty");
    }
    else if(price== ""){
      toast.warn("Price filed is empty");
    }
    else if(uploaded == false){
      toast.warn("Files upload required");
    }
    else if(uploaded == false){
      toast.warn("Files upload required");
    }

  
    if (!name || !description || !price || !fileUrl) {
      console.log("Error");
      return;
    }

    console.log("Done");
 
    /* first, upload to IPFS */
    
    const data = JSON.stringify({
      name,
      description,
      image: fileUrl,
    });

    try {

     

      const LightHouseresponse = await lighthouse.uploadText(data, apiKey, "Uploaded Image")

      const cid1 = LightHouseresponse.data.Hash;

      const datawithcid = JSON.stringify({
        name,
        description,
        image: fileUrl,
        cid1,
      });

      const LightHouseresponse1 = await lighthouse.uploadText(datawithcid, apiKey, "Uploaded Image")

      const cid2 = LightHouseresponse1.data.Hash;

      SetLIghthouseCid(cid2)


    
      const LightHouseurl =  `https://gateway.lighthouse.storage/ipfs/${cid2}`;
      // /* after file is uploaded to IPFS, return the URL to use it in the transaction */
 
      // console.log("upres",uploadResult)
      // console.log("dynLInk",DynamicLink)

      console.log("The url fro the lighthiuse is",LightHouseurl)
      
      return LightHouseurl;
    } catch (error) {
      toast.warn("Error uploading image");
      console.log('Error uploading file: ', error);
    }
  
    setuploading(false);
		setuploaded(true);
		 
		toast.success("Files uploaded sucessfully");

  }






  async function listNFTForSale(e) {
    e.preventDefault();


    toast.success("Proposal Uploaded to LightHouse")


    const url = await uploadToIPFS();
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send('eth_requestAccounts', []);
    const signer = provider.getSigner();

    /* next, create the item */
    const price = ethers.utils.parseUnits(formInput.price, 'ether');
    let contract = new ethers.Contract(
      marketplaceAddress,
      NFTMarketplace.abi,
      signer
    );

    const desc = formInput.description;
    const  name = formInput.name;
    const price1 = formInput.price;

    const data = JSON.stringify({

     name,price,desc
    });
    const dealParams = {
      num_copies: 1,
      repair_threshold: 28800,
      renew_threshold: 240,
      miner: ["t017840"],
      network: 'calibration',
      add_mock_data: 2
    };

    const response = await lighthouse.uploadText(data, apiKey, "Data for the sale")

    console.log("The cid is ",response.data.Hash);

  

    const cid = response.data.Hash;
    localStorage.setItem("cid11",cid)

    
    let listingPrice = await contract.getListingPrice();
    listingPrice = listingPrice.toString();
    let transaction = await contract.createToken(url, price, { value: listingPrice });
    await transaction.wait();
    

    alert('Successfully created NFT');
    toast.success("Files uploaded sucessfully");
   
  }

  return (
    <>
    <Navbar/>
      <div className="min-h-screen py-10 bg-gradient-to-r from-green-700 to-green-300">
      
        <div className="container mx-auto mt-3">
          <div className="flex w-8/12 bg-white flex-col md:flex-row rounded-xl mx-auto shadow-lg overflow-hidden">
          <div className="md:w-1/2 bg-black flex flex-col justify-center items-center">
            <h2 className='text-3xl mb-4 text-white'>Add your details</h2>
            <div>
              <p className='text-justify px-4 text-white'>Congratulations on taking the step to become a part of our vibrant community! By contributing your unique items to "EduLearn," you're not just listing products; you're creating opportunities for others to discover and own exceptional pieces. Your participation in our marketplace enriches the experience for all, fostering a dynamic environment for collectors and enthusiasts alike. Thank you for being an integral part of our growing network of passionate traders and buyers.</p>
            </div>
          </div>
          <div className="md:w-1/2 py-10 px-12">
            <p className="mb-3">List your Course and get paid.</p>
            <form>
              <div className="mt-5">
                <input placeholder="Course Name" className="border-2 border-black rounded p-4 mb-2 w-full" onChange={(e) => updateFormInput({ ...formInput, name: e.target.value })}/>
              </div>

              <div className="mt-5">
                <textarea placeholder="Course Description" className="border-2 border-black rounded p-4 mb-2 w-full" onChange={(e) => updateFormInput({ ...formInput, description: e.target.value })}/>  
              </div>
              
              <div className="mt-5">
                <input placeholder="Course Price in ETH" className="border-2 border-black rounded p-4 mb-2 w-full" onChange={(e) => updateFormInput({ ...formInput, price: e.target.value })}/>  
              </div>
              
              <div className="mt-5">
							  <label className="block text-sm font-medium text-gray-700 name1">
								  Select Course Image
							  </label>
							  <div className="mt-1 flex items-center border-2 border-black">
								  <span className="inline-block h-12 w-12 overflow-hidden rounded-full bg-gray-100">
									  
                    <svg className="h-full w-full text-gray-300" fill="currentColor" viewBox="0 0 24 24">
                    
										  <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
									  </svg>
								  </span>
                  
                  <input type="file" name="Asset" className="ml-3 blockw-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:green-700 focus:outline-non "accept="image/*" onChange={onChange}/>
                        
								  {" "}
							  </div>
						  </div>
						
              {Uploading == true ? (
								<button className="button bg-green-600">
									<TailSpin color="#fff" height={20} />
								</button>
							) : uploaded == false ? (
								<button className="rounded-xl bg-green-600 button mt-3" onClick={listNFTForSale}>
								  SELL MY ITEM 
							  </button>
							) : (
								<button style={{ cursor: "no-drop" }} className="button">
									Files uploaded sucessfully
								</button>
							)}
              
            </form>
            
          </div>
          </div>
        </div>
      </div>
    
 
    </>
  );
}