import { create } from "zustand";
import { doc, getDoc } from "firebase/firestore";
import { db } from "./firebase";
import { useUserStore } from "./userStore";

export const useChatStore = create((set) => ({
  chatId: null,
  user: null,
  isCurrentUserBlocked: false,
  isReceiverUserBlocked: false,
  isGroup: false,
  groupName:'', 

  changeGrpChat: async (groupId, groupData) => {
  const currentUser = useUserStore.getState().currentUser;
  if (!currentUser || !groupId || !groupData) return;
  let name = groupData?.name;
    if (!name) {
      try {
        const docSnap = await getDoc(doc(db, "group", groupId));
        if (docSnap.exists()) {
          name = docSnap.data().name || '';
        }
      } catch (error) {
        console.error("Failed to fetch group name:", error);
      }
    }

    set({
      chatId: groupId,
      user: groupData,
      isCurrentUserBlocked: false,
      isReceiverUserBlocked: false,
      isGroup: true,
      groupName: name || '', 
    });
  },
  changeChat: async (chatId, selectedUser) => {
    const currentUser = useUserStore.getState().currentUser;

    if (!currentUser || !selectedUser) return;

    try {
      const [currentUserSnap, selectedUserSnap] = await Promise.all([
        getDoc(doc(db, "user", currentUser.id)),
        getDoc(doc(db, "user", selectedUser.id)),
      ]);

      const currentUserData = currentUserSnap.data();
      const selectedUserData = selectedUserSnap.data();

      const isCurrentUserBlocked =
        selectedUserData?.blocked?.includes(currentUser.id) || false;
      const isReceiverUserBlocked =
        currentUserData?.blocked?.includes(selectedUser.id) || false;

      set({
        chatId,
        user: selectedUser,
        isCurrentUserBlocked,
        isReceiverUserBlocked,
        isGroup: false,
      });
    } catch (error) {
      console.error("Failed to set chat:", error);
    }
  },

  changeBlock: () => {
    set((state) => ({
      isReceiverUserBlocked: !state.isReceiverUserBlocked,
    }));
  },

  resetChat: () => {
    set({
      chatId: null,
      user: null,
      isCurrentUserBlocked: false,
      isReceiverUserBlocked: false,
      isGroup: false,
    });
  },
}));
