import React from 'react'
import Image from "next/image";
import Link from "next/link";
import basic from "./images/basic.jpg"
import inter from "./images/inter.jpeg"
import adv from "./images/adv.jpg"

const Card = () => {

  return (
    <>
      <div name ="Market" id="card" className = "w-full p-5 overflow-x-hidden">
        <div className = "max-w-screen-lg mx-auto flex flex-col items-center justify-center border-gray-500">
          <div className = "pb-8">
            <p className = "text-4xl font-bold text-center mb-5 text-white">Trade, Discover, and Prosper</p>
            <p className = "text-xl font-bold text-center mb-5 text-white">Choose from the variety of Items with new additions published every month.</p>
          </div>

          <div className = "grid sm:grid-cols-1 md:grid-cols-3 gap-4">
            <div className = "shadow-black shadow-xl rounded-lg border-4 border-green-500">
              <div className='overflow-hidden rounded-t-lg'>
                <Image src = {basic} height="250" width="400" className = "w-full rounded-t-md duration-200 hover:scale-110 hover:overflow-hidden" />
              </div>

              <div className = "bg-gradient-to-b from-black to-gray-800 text-center">
                <div>
                  <p className = "text-sm text-justify font-bold mx-auto p-3 text-white"> <p className ="text-lg font-bold text-red-600">List Item:</p> This feature enables users to upload details and images of their unique or vintage items onto the platform. By listing the item, the user essentially puts it up for sale in the marketplace. The information provided helps potential buyers understand the specifications, condition, and any other relevant details about the item before making a purchase. </p>
                </div>
              </div>
            </div>

            <div className = "shadow-black shadow-xl rounded-lg border-4 border-green-500">
              <div className='overflow-hidden rounded-t-lg'>
                <Image src = {inter} height="250" width="400" className = "w-full rounded-t-md duration-200 hover:scale-110 hover:overflow-hidden" />
              </div>

              <div className = "bg-gradient-to-b from-black to-gray-800 text-center">
                <div>
                  <p className = "text-sm text-justify font-bold mx-auto p-3 text-white"> <p className ="text-lg font-bold text-yellow-600"> Buy Item:</p> Users interested in acquiring unique or vintage items can browse through the listings available on the platform and initiate a purchase. Once they find an item that meets their requirements, they can proceed with the transaction. The purchase process typically involves secure payment methods, ensuring a smooth and reliable experience for the buyer.</p>
                </div>
              </div>
            </div>

            <div className = "shadow-black shadow-xl rounded-lg border-4 border-green-500">
              <div className='overflow-hidden rounded-t-lg'>
                <Image src = {adv} height="250" width="400" className = "w-full rounded-t-md duration-200 hover:scale-110 hover:overflow-hidden" />
              </div>

              <div className = "bg-gradient-to-b from-black to-gray-800 text-center">
                <div>
                  <p className = "text-sm text-justify font-bold mx-auto p-3 text-white"> <p className ="text-lg font-bold text-blue-600">Review Item:</p> After a successful transaction, buyers have the option to review the purchased item. This feature allows users to share their experience, opinions, and feedback about the item's quality, authenticity, or any other relevant aspect. Reviews provide valuable insights for other potential buyers and contribute to building trust within the community. Additionally, the review process may also involve rating the seller, contributing to their overall reputation within the marketplace. </p>
                </div>
              </div>
            </div>
          </div>

          <div className='flex justify-center items-center mt-10'>
            <button className = "flex justify-center px-4 py-2 mx-auto text-xl from-[#FB65FE] from-100% to-[#9010FF] to-100% hover:rotate-2 delay-100 transition ease-in-out   text-center border hover:bg-gray-100 hover:shadow-md border-gray-500  rounded-md bg-green-500 text-cyan font-bold">
              <Link legacyBehavior href={"/Market"} className = "text-white font-extrabold">Click -  Dive into the Marketplace Universe Dapp</Link>
            </button>
          </div>
        </div>
      </div>
      <div className="flex sm:justify-end px-32 justify-start sm:h-40 h-28 ml-8 sm:ml-0 sm:mr-40">
        <img src="/line1.png" alt="line3 " />
      </div>
    </>
  )
}

export default Card