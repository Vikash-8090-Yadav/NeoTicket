// import axios from 'axios';

const axios = require('axios')

const ethers = require("ethers")

// import lighthouse from '@lighthouse-web3/sdk'

const lighthouse = require('@lighthouse-web3/sdk')
const apiKey = "b3b18111.271ba6addd39409a80ac3fee4d78070c" 
async function test(){


// const response1 = await axios.get("https://api.lighthouse.storage/api/lighthouse/get_proof?network=testnet&cid=QmTRvC3TRMpzVMbpBaw5GpeKALtnjtMMAHTX8AiaxTt7ff")
const cid1 = "QmWm2qaiyhR1aR9gkS4CUymn57e8iRwRkbZVRVJsHo3hzU";
const response1 = await axios.get(`https://api.lighthouse.storage/api/lighthouse/get_proof?network=testnet&cid=${cid1}`)
// const { pieceCID, dealInfo } = poDSI;

console.log(response1.data);
// console.log("THeres is",response1.data.pieceCID,response1.data.carFileSize);
// console.log("THeres is",response1);

// const respo = await axios.get("http://localhost:1337/get_proof?network=testnet&cid=QmTRvC3TRMpzVMbpBaw5GpeKALtnjtMMAHTX8AiaxTt7ff")

// console.log("THeres is",response1);
// console.log("Deal ID: " + response1.data.dealInfo[0].dealId);
// const carszie = response1.data.carFileSize;

// console.log(carszie)

// const proof = await axios.get("https://api.lighthouse.storage/api/lighthouse/get_proof?cid=QmRYsm6rVRDFenqjMHUoRFqhTqHUo2fbQgWkChdD5ibj2t")

// console.log(proof);


// alert("The deal status is");
// const cid = "QmRYsm6rVRDFenqjMHUoRFqhTqHUo2fbQgWkChdD5ibj2t";
// const status = await axios.get("https://calibration.lighthouse.storage/api/deal_status?cid=QmTRvC3TRMpzVMbpBaw5GpeKALtnjtMMAHTX8AiaxTt7ff")
// console.log("Deal ID: " + Number(status.data.currentActiveDeals[0][0].hex))
// const dealStatus = await axios.get(`https://calibration.lighthouse.storage/api/deal_status?cid=${cid}`)

// console.log(dealStatus.)
// console.log("The deal status is ",status.data);

}

// import axios from "axios";

async function getPoDSI(cid) {
    const response = await axios.get('https://api.lighthouse.storage/api/lighthouse/get_proof?cid=QmcjCsgNtDmwVjdLEXCsgkNm9Pf7No4ivFYu3ijC7AoYuT');
    console.log('PoDSI:', response.data);
    const status = await axios.get("https://calibration.lighthouse.storage/api/deal_status?cid=QmWm2qaiyhR1aR9gkS4CUymn57e8iRwRkbZVRVJsHo3hzU")
console.log("Deal ID: " + Number(status.data.currentActiveDeals[0][0].hex))
}

// const cid = 'QmRYsm6rVRDFenqjMHUoRFqhTqHUo2fbQgWkChdD5ibj2t';  // Replace with the actual CID of your file
// getPoDSI(cid).catch(console.error);


async function status(){
    // const st = await light
    const proof = await axios.get("https://api.lighthouse.storage/api/lighthouse/deal_status?cid=Qmah5toeKUT8fkPa6QhaDZVcuuEcSdvMshGUbrTX4tQvjX")
    // console.log(proof.)

    const st  = await lighthouse.dealStatus('Qmah5toeKUT8fkPa6QhaDZVcuuEcSdvMshGUbrTX4tQvjX')

    console.log(st);
}

async function verifyDocument() {
    const response1 = await axios.get("https://api.lighthouse.storage/api/lighthouse/get_proof?network=testnet&cid=Qmah5toeKUT8fkPa6QhaDZVcuuEcSdvMshGUbrTX4tQvjX")
    // const { pieceCID, dealInfo } = poDSI;
    // const status = await axios.get("https://calibration.lighthouse.storage/api/deal_status?cid=Qmah5toeKUT8fkPa6QhaDZVcuuEcSdvMshGUbrTX4tQvjX")
    // console.log("Deal ID: " + Number(status.data.currentActiveDeals[0][0].hex))
  

    const dealId = response1.data.dealInfo[0].dealId;
    const pieceCID= response1.data.pieceCID;

    console.log(dealId)

    const dealInfo = response1.data.dealInfo;
    

    if ( !dealInfo || dealInfo.length === 0 ) {
        console.error('Verification Failed');

        console.log("Please Wait!,minter is still veryfying the CID");
        return false;
    }

    console.log('Document Verified:', dealInfo);
    return true;
}


async function  pod(){

    const cid1 = "Qmah5toeKUT8fkPa6QhaDZVcuuEcSdvMshGUbrTX4tQvjX";

    const response1 = await axios.get(`https://api.lighthouse.storage/api/lighthouse/get_proof?network=testnet&cid=${cid1}`)
    // const { pieceCID, dealInfo } = poDSI;
  
    console.log(response1.data);

    

    


    // let response = await axios.get("https://api.lighthouse.storage/api/lighthouse/get_proof?cid=Qmah5toeKUT8fkPa6QhaDZVcuuEcSdvMshGUbrTX4tQvjX&network=testnet")

// console.log(response)
}
// verifyDocument();


// status();
// getPoDSI("QmWm2qaiyhR1aR9gkS4CUymn57e8iRwRkbZVRVJsHo3hzU")
// pod();



// getPoDSI("QmeWHmYfU13VkR8a666FeFHsydEYFvFVmnBcrMqiFQ5o4S").then(verifyDocument).catch(console.error);

// test();


const fileInfo = async() => {
    /*
      @param {string} cid - cid of file.
    */
    const cid = "Qmah5toeKUT8fkPa6QhaDZVcuuEcSdvMshGUbrTX4tQvjX"
    const status = await lighthouse.dealStatus('Qmah5toeKUT8fkPa6QhaDZVcuuEcSdvMshGUbrTX4tQvjX')


    console.log(status)
    /* Sample Response
      {
        data: {
          fileSizeInBytes: '95077',
          cid: 'QmeMsykMDyD76zpAbinCy1cjb1KL6CVNBfB44am15U1XHh',
          encryption: false,
          fileName: 'itachi.jpg',
          mimeType: 'image/jpeg',
          txHash: ''
        }
      }
    */
  }


  fileInfo();