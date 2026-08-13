import MessageArea from "../components/MessageArea"
import SideBar from "../components/SideBar"
import useMessages from "../customHooks/GetMessages"

function Home() {
  useMessages()
  return (
    <div className="w-full h-[100vh] overflow-hidden flex" >
      <SideBar />
      <MessageArea />
    </div>
  )
}

export default Home