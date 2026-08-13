import { useEffect, useRef } from "react"

function ReceiverMessage({ image, message }) {
  let scroll = useRef()

  useEffect(() => {
    scroll.current.scrollIntoView({ behavior: "smooth" })
  }, [message, image])

  const handleImageScroll = () => {
    scroll.current.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <div className="w-fit max-w-[500px] bg-white px-[20px] py-[10px] text-gray-800 text-[18px] font-medium rounded-tl-none rounded-2xl relative left-0 shadow-gray-300 shadow-lg gap-[10px] flex flex-col border border-gray-200">

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

    </div>
  )
}

export default ReceiverMessage