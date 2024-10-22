
import { ReactNode } from "react"
import Logo from "/logo.svg"
import LogoWhite from "/logo-white.svg"


function  AuthLayout({children,title,description,isLogin}:{children:ReactNode,title:string,description:string,isLogin?:boolean}) {
  return (
    <div className="max-h-[100vh] h-full  w-ful overflow-hiddenl  overflow-hidden p-[20px]   flex    font-poppins font-[600px] text-[36px] leading-[38.16px] md:gap-[27px] ">
      <div className={` min-h-[calc(100vh-40px)] h-full bg-[#7065F00F]  lg:block hidden ${isLogin?"bg-[url('/login_image.jpg')]":"bg-[url('/login_image.jpg')]"}  bg-no-repeat  bg-cover  w-[50%] rounded-l-[20px] rounded-r-[200px] `}>
        <div className="md:p-[12px] w-full  min-h-[calc(100vh-40px)]   flex justify-between flex-col  items-start gap-[14px] ">
         
          <div className="flex items-center gap-[4px]">
            <img src={LogoWhite} className="p-[5px] w-[80px]" />
            <p className=" text-[28px] text-blue-600 font-semibold">Tie-App</p>

            </div>
          <div className="bg-[#00000021]  p-[68px] h-[363px] w-full rounded-l-[20px] backdrop-blur-sm rounded-r-[200px]">
            <p className="text-white font-urbanist font-[500]  pb-[38px] leading-[28.8px]">Welcome to Tie-App</p>
            <p className="font-[800] font-urbanist leading-[60.8px] text-[white] text-[44px]">Welcoming To Tie-App
            We 're glad you're here</p>
          </div>
        </div>
      </div>
      <div className="lg:w-[50%] lg:h-fit max-h-[100vh]  overflow-auto py-[30px] w-full" >
        <div className="md:px-[60px] px-[10px] gap-[20px] w-full  flex flex-col lg:items-start items-center">
        <div className=" justify-center  w-full  flex lg:hidden  items-center gap-[14px] ">
          <img src={Logo}  className="w-[80px]"/>
        
        </div>
        <div>
        <p className=" font-urbanist font-semibold text-[32px] leading-7 xl:text-start text-center text-black-light pb-[16px] w-full ">
       {title}
        </p>
        <p className="font-urbanist font-[400px] text-[20px] leading-7 xl:text-start text-center text-tertiary-dark ">
        {description}
        </p>

          </div>
        {children}
    </div>
        </div>
    </div>
  )
}

export default AuthLayout