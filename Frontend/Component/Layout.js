

import Footer from "./v1.0.0/footer/footer";



 import Navbar from "./Course/Nav";
export default function Layout({ children }) {
  

  return (
    <>

        <link rel="stylesheet" type="text/css" href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick.min.css" />
        <link rel="stylesheet" type="text/css" href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick-theme.min.css" />
        <Navbar/>

        {children}


        <Footer/>
    
    </>
  )
}
