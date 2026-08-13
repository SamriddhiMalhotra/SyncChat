import { IoArrowBackSharp } from "react-icons/io5";
import dp from "../assets/dp.jpg";
import { useDispatch, useSelector } from "react-redux";
import { setselectedUserData } from "../redux/userSlice";
import { MdEmojiEmotions } from "react-icons/md";
import { FaImages } from "react-icons/fa";
import { IoSend } from "react-icons/io5";
import { useEffect, useRef, useState } from "react";
import EmojiPicker from "emoji-picker-react";
import SenderMessage from "./SenderMessage";
import ReceiverMessage from "./ReceiverMessage";
import { serverUrl } from "../main";
import axios from "axios";
import { addMessage, markMessagesSeen, markSingleMessageSeen} from "../redux/messageSlice";

function MessageArea() {
  let { selectedUserData, userData, socket } = useSelector(
    (state) => state.user
  );

  let { messages } = useSelector((state) => state.messages);

  let dispatch = useDispatch();

  let [showPicker, setShowPicker] = useState(false);
  let [input, setInput] = useState("");
  let [isTyping, setIsTyping] = useState(false);
  let [frontendImage, setFrontendImage] = useState(null);
  let [backendImage, setBackendImage] = useState("");
  

  let image = useRef();
  let typingTimeout = useRef(null);
  const isCurrentlyTyping = useRef(false);

  const handleImage = async (e) => {
    let file = e.target.files[0];
    setBackendImage(file);
    setFrontendImage(URL.createObjectURL(file));
  };

  //POST REQ TO SEND NEW MSG TO SERVER
  const handleSendMessage = async (e) => {
    e.preventDefault();

    if (!selectedUserData?._id) return;

    if (input.length == 0 && backendImage == null) {
      return;
    }

    try {
      let formData = new FormData();

      formData.append("message", input);

      if (backendImage) {
        formData.append("image", backendImage);
      }

      let result = await axios.post(
        `${serverUrl}/api/message/send/${selectedUserData._id}`,
        formData,
        { withCredentials: true }
      );

      dispatch(addMessage(result.data));

      setInput("");
      setFrontendImage(null);
      setBackendImage(null);

    } catch (error) {
      console.log(error);
    }
  };
  
  //SOCKET FOR LISTENING NEW MESSAGES COMING FROM SERVER.
  useEffect(() => {
    if (!socket || !selectedUserData) return;

     const handleNewMessage = (mess) => {
      if (mess.sender?.toString() === selectedUserData?._id?.toString()) {
      dispatch(addMessage(mess));

      //emitting/telling backend this particular message was seen
      socket.emit("markMessageSeen", {
        messageId: mess._id
      });

    }
  };

   const handleMessageSeen = ({ messageId }) => {
    dispatch(
      markSingleMessageSeen({
        messageId
      })
    );
  };

    socket.on("newMessage", handleNewMessage);
    socket.on("messageSeenByReceiver", handleMessageSeen);
    //It returns a cleanup function.
    return () => {
        socket.off("newMessage", handleNewMessage);
        socket.off("messageSeenByReceiver", handleMessageSeen);
    };

}, [socket, selectedUserData?._id, dispatch]);
//Sender → updated UI by the API response.
//Receiver → updated UI by the socket event.
// socket.off("newMessage", handleNewMessage);
// removes only the listener that this component registered.

  let onEmojiClick = (emojiData) => {
    setInput((prevInput) => prevInput + emojiData.emoji);
    setShowPicker(false);
  };

  //EMITING TYPING EVENTS FROM THE INPUT
  const handleTyping = (e) => {
  const value = e.target.value;
  setInput(value);
  if (!socket || !selectedUserData?._id) return;
  clearTimeout(typingTimeout.current);

 if (!value.trim()) {
    if (isCurrentlyTyping.current) {
      socket.emit("stopTyping", {
        senderId: userData._id,
        receiverId: selectedUserData._id,
      });

      isCurrentlyTyping.current = false;
    }

    return;
  }

  if (!isCurrentlyTyping.current) {
    socket.emit("typing", {
      senderId: userData._id,
      receiverId: selectedUserData._id,
    });

    isCurrentlyTyping.current = true;
  }

  typingTimeout.current = setTimeout(() => {
    socket.emit("stopTyping", {
      senderId: userData._id,
      receiverId: selectedUserData._id,
    });

    isCurrentlyTyping.current = false;
  }, 1000);
};
// Prevents sending the "typing" event repeatedly while the user is already typing-const isCurrentlyTyping = useRef(false);

//LISTENING FOR TYPING EVENTS
useEffect(() => {
  if (!socket) return;

  const handleUserTyping = ({ senderId }) => {
    if (senderId === selectedUserData?._id) {
      setIsTyping(true);
    }
  };

  const handleUserStopTyping = ({ senderId }) => {
    if (senderId === selectedUserData?._id) {
      setIsTyping(false);
    }
  };

  socket.on("userTyping", handleUserTyping);
  socket.on("userStopTyping", handleUserStopTyping);

  return () => {
    socket.off("userTyping", handleUserTyping);
    socket.off("userStopTyping", handleUserStopTyping);

    // Reset when switching users
    setIsTyping(false);
    clearTimeout(typingTimeout.current);
  };
}, [socket, selectedUserData?._id]);

 //LISTENING FOR MESSAGES-SEEN WHEN A CONVERSATION IS SELECTED.
  useEffect(() => {
  if (!socket) return;

  const handleMessagesSeen = ({ seenBy }) => {
    dispatch(
     markMessagesSeen({
      userId:userData._id,
      seenBy
     })
    );
  };

  socket.on("messagesSeen", handleMessagesSeen);

  return () => {
    socket.off("messagesSeen", handleMessagesSeen);
  };
}, [socket, userData?._id, dispatch]);

  return (
    <div
      className={`lg:w-[70%] ${
        selectedUserData ? "flex" : "hidden"
      } lg:flex w-full h-full bg-[#f5f7f6] border-l-2 border-gray-200 relative`}
    >

      {/* WHEN USER IS SELECTED */}
      {selectedUserData && (
        <div className="w-full h-100vh flex flex-col">

          {/* HEADER */}
          <div className="w-full h-[100px] bg-[#12824d] rounded-b-[30px] shadow-gray-300 shadow-lg flex items-center gap-[20px] px-[20px]">

            {/* ARROW */}
            <div
              className="cursor-pointer"
              onClick={() => dispatch(setselectedUserData(null))}
            >
              <IoArrowBackSharp className="w-[40px] h-[50px] text-white" />
            </div>

            {/* PROFILE IMAGE */}
            <div className="w-[50px] h-[50px] rounded-full overflow-hidden flex justify-center items-center shadow-gray-600 shadow-lg cursor-pointer bg-white border-2 border-white">
              <img
                src={selectedUserData?.image || dp}
                className="w-full h-full object-cover"
                alt="profile"
              />
            </div>

            {/* USER NAME */}
            <div className="flex flex-col">
               <h1 className="text-white font-semibold text-[23px] tracking-wide">
              {selectedUserData?.name || "User"}
            </h1>

            {/* DISPLAY TYPING IN REAL TIME */} 
            {isTyping && (
  <div className="flex items-center gap-1 ml-2">
    <span className="w-2 h-2 bg-white rounded-full animate-bounce"></span>
    <span className="w-2 h-2 bg-white rounded-full animate-bounce [animation-delay:150ms]"></span>
    <span className="w-2 h-2 bg-white rounded-full animate-bounce [animation-delay:300ms]"></span>
  </div>
)}
            </div>
           
          </div>

          {/* THE WHITE AREA */}
          <div className="w-full h-[70%] flex flex-col py-[30px] px-[20px] overflow-auto gap-[20px]">

            {/* DISPLAYING EMOJIS */}
            {showPicker && (
              <div className="absolute bottom-[120px] left-[20px]">
                <EmojiPicker
                  width={250}
                  height={350}
                  onEmojiClick={onEmojiClick}
                  className="shadow-lg z-[100]"
                />
              </div>
            )}

            {/* DISPLAYING PREVIOUS MESSAGES */}
            {messages &&
              messages.map((mess) =>
                mess.sender == userData._id ? (
                  <SenderMessage
                    image={mess.image}
                    message={mess.message}
                    seen={mess.seen}
                    key={mess._id}
                  />
                ) : (
                  <ReceiverMessage
                    image={mess.image}
                    message={mess.message}
                    key={mess._id}
                  />
                )
              )}
          </div>
        </div>
      )}

      {/* WHEN NO USER SELECTED */}
      {!selectedUserData && (
        <div className="w-full h-full flex flex-col justify-center items-center">

          <h1 className="text-gray-700 font-bold text-[45px] tracking-tight">
            Welcome to SyncChat 👋
          </h1>

          <span className="text-gray-500 font-medium text-[22px] mt-[5px]">
            Select a conversation to start chatting.
          </span>

        </div>
      )}

      {/* CREATING INPUT PORTION */}
      {selectedUserData && (
        <div className="w-full h-[100px] lg:w-[70%] fixed bottom-[20px] flex items-center justify-center">

          {/* IMAGE PREVIEW */}
          <img
            src={frontendImage}
            className="w-[80px] absolute right-[20%] bottom-[100px] rounded-lg shadow-gray-400 shadow-lg"
          />

          <form
            className="w-[95%] lg:w-[70%] h-[60px] bg-[#12824d] shadow-gray-400 shadow-lg rounded-full flex items-center gap-[20px] px-[20px]"
            onSubmit={(e) => handleSendMessage(e)}
          >

            {/* EMOJI BUTTON */}
            <div onClick={() => setShowPicker((prev) => !prev)}>
              <MdEmojiEmotions className="w-[25px] h-[25px] text-white cursor-pointer hover:text-[#dff3e8] transition-colors" />
            </div>

            {/* IMAGE INPUT */}
            <input
              type="file"
              accept="image/*"
              hidden
              ref={image}
              onChange={handleImage}
            />

            {/* MESSAGE INPUT */}
            <input
              type="text"
              className="w-full h-full px-[10px] outline-none border-0 text-[18px] font-medium text-white bg-transparent placeholder-[#d7eee2]"
              placeholder="Message"
              onChange={handleTyping}
              value={input}
            />

            {/* IMAGE BUTTON */}
            <div onClick={() => image.current.click()}>
              <FaImages className="w-[25px] h-[25px] text-white cursor-pointer hover:text-[#dff3e8] transition-colors" />
            </div>

            {/* SEND BUTTON */}
            {(input.length > 0 || backendImage != null) && (
              <button>
                <IoSend className="w-[25px] h-[25px] text-white cursor-pointer hover:text-[#dff3e8] transition-colors" />
              </button>
            )}

          </form>
        </div>
      )}
    </div>
  );
}

export default MessageArea;