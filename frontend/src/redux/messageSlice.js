import { createSlice } from "@reduxjs/toolkit";

const messageSlice=createSlice({
  name:"messages",
  initialState:{
    messages:[]
  },
  reducers:{
    setMessages:(state,action)=>{
    state.messages=action.payload
  },
   addMessage(state, action) {
            state.messages.push(action.payload);
        },
  markMessagesSeen: (state, action) => {
  const { userId, seenBy } = action.payload;

  state.messages.forEach((msg) => {
    if (
      msg.sender === userId &&
      msg.receiver === seenBy
    ) {
      msg.seen = true;
    }
  });
},
markSingleMessageSeen: (state, action) => {
  const { messageId } = action.payload;

  const message = state.messages.find(
    (msg) => msg._id === messageId
  );

  if (message) {
    message.seen = true;
  }
}
  }
})

export const {setMessages, addMessage, markMessagesSeen, markSingleMessageSeen}=messageSlice.actions
export default messageSlice.reducer

//data we send get into payload.