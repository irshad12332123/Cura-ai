import ChatMessage from "../components/ChatMessage"
import NavBar from "./NavBar"

function Home() {
  return (
    <div className="py-2 px-10 bg-gradient-to-bl from-[#232e2f]  via-[#051517] to-[#000000] h-screen w-full">
      <main>
        <NavBar />
        {/* Message section */}
        <div className="mt-20">
        <ChatMessage message="Hey! How can i help you today" messageFrom="Bot" />
        <ChatMessage message="Hey! How can i help you today" messageFrom="User" />
        </div>
      </main>
    </div>
  )
}

export default Home
