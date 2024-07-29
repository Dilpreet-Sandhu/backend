
import Header from "./Header"
import SideBar from "./SideBar"


export default function AppLayout() {

    return (Component) => {
        return (props) => {
            return (
            <div className="w-full h-full bg-black">
                <Header/>
                <div className="flex">
                <SideBar/>
                <Component {...props}/>
                </div>
            </div>
            )
        }
    }
   
}
