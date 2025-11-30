import UI_IMG from "../../assets/images/auth.jpg"

export default function AuthLayout({ children }) {
    return (
        <div className="flex">
            <div className="w-screen h-screen md-w-[60vw] px-12 pt-8 pb-12">
                <h2 className="text-xl font-bold text-black">Task Manager</h2>
                {children}
            </div>



            <div className="hidden md:flex w-[60vw] h-screen items-center justify-center ">
                <img src={UI_IMG} alt="img" className="w-64 lg:w-full h-dvh" />
            </div>

        
        </div>


    )
}
