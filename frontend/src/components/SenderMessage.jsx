import { useEffect, useRef } from "react"

function SenderMessage({ image, message,seen }) {
  let scroll = useRef()

  useEffect(() => {
    scroll.current.scrollIntoView({ behavior: "smooth" })
  }, [message, image])

  const handleImageScroll = () => {
    scroll.current.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <div className="w-fit max-w-[500px] bg-[#12824d] px-[20px] py-[10px] text-white text-[18px] font-medium rounded-tr-none rounded-2xl relative right-0 ml-auto shadow-gray-300 shadow-lg gap-[10px] flex flex-col">

      <div ref={scroll}>
        {image && (
          <img
            src={image}
            className="w-[100px] rounded-lg"
            onLoad={handleImageScroll}
          />
        )}

        {message && <span>{message}</span>}
      </div>
      <div className="flex justify-end">
    <span className="text-sm text-gray-200">
      {seen ? "✓✓" : "✓"}
    </span>
  </div>

    </div>
  )
}

export default SenderMessage