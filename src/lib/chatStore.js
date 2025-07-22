import { create } from "zustand";
import { doc, getDoc } from "firebase/firestore";
import { db } from "./firebase";
import { useUserStore } from "./userStore";

export const useChatStore = create((set) => ({
  chatId: null,
  user: null,
  isCurrentUserBlocked: false,
  isReceiverUserBlocked: false,

  changeChat: (chatId, user) => {
    const currentUser = useUserStore.getState().currentUser;

    if (user?.blocked?.includes(currentUser.id)) {
      return set({
        chatId,
        user: null,
        isCurrentUserBlocked: true,
        isReceiverUserBlocked: false,
      });
    }

    if (currentUser?.blocked?.includes(user.id)) {
      return set({
        chatId,
        user,
        isCurrentUserBlocked: false,
        isReceiverUserBlocked: true,
      });
    }

     return set({
      chatId,
      user,
      isCurrentUserBlocked: false,
      isReceiverUserBlocked: false,
    });
  },

  changeBlock: () => {
    set((state) => ({
      isReceiverUserBlocked: !state.isReceiverUserBlocked,
    }));
  },
}));
