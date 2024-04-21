export async function createChat(
  participantAId: string,
  participantBId: string
) {
  try {
    const res = await fetch(import.meta.env.VITE_BACKEND_URL + "/chats", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        participantAId: participantAId,
        participantBId: participantBId,
      }),
    });

    if (res.ok) {
      const chatRoom = await res.json();

      return chatRoom.id as string;
    }

    return null;
  } catch (err) {
    return null;
  }
}
