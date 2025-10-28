import "./Sidebar.css";
import { useContext, useEffect, useState } from "react";
import { MyContext } from "./MyContext";
import { v1 as uuidv1 } from "uuid";

function Sidebar() {
  const {
    allThreads = [], // ✅ Default to empty array to avoid undefined
    setAllThreads,
    currThreadId,
    newChat,
    setNewChat,
    prompt,
    SetPrompt,
    reply,
    setReply,
    setCurrThreadId,
    setPrevChats,
  } = useContext(MyContext);

  const [currChatId, setCurrChatId] = useState("");

  const getAllThreads = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/thread");
      const result = await response.json();
      const filterData = result.map((thread) => ({
        threadId: thread.threadId,
        title: thread.title,
      }));
      setAllThreads(filterData);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAllThreads();
  }, [currThreadId]);

  const createNewChat = () => {
    setNewChat(true);
    SetPrompt("");
    setReply(null);
    const newId = uuidv1();
    setCurrThreadId(newId);
    setPrevChats([]);
    setCurrChatId(newId); // highlight the new chat
  };

  const changeThread = async (threadId) => {
    try {
      const response = await fetch(`http://localhost:8080/api/thread/${threadId}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const res = await response.json();
      setPrevChats(res);
      setNewChat(false);
      setReply(null);
      setCurrChatId(threadId); // 🎯 update current chat selection
    } catch (error) {
      console.error("Error fetching thread:", error);
    }
  };

  const DelThread = async (threadId) => {
    try {
      const response = await fetch(`http://localhost:8080/api/thread/${threadId}`, { method: "DELETE" });
      const res = await response.json();
      console.log(res);
      setAllThreads((prev) => prev.filter((thread) => thread.threadId !== threadId));
      if (currChatId === threadId) {
        setCurrChatId(""); // Clear highlight if active chat is deleted
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <section>
      {/* Top Buttons */}
      <div className="sidebarTopButton">
        <button className="openaiButton">
          <i className="fa-brands fa-openai"></i>
        </button>
        <button className="openaiButton newChat" onClick={createNewChat}>
          <i className="fa-regular fa-pen-to-square"></i>
        </button>
      </div>

      {/* Thread History */}
      <div className="thread">
        {Array.isArray(allThreads) && allThreads.length > 0 ? (
          allThreads.map((thread) => (
            <li key={thread.threadId} className={currChatId === thread.threadId ? "highlighted" : ""} onClick={() => changeThread(thread.threadId)}>
              {thread.title}
              <i
                className="fa-solid fa-trash"
                onClick={(e) => {
                  e.stopPropagation();
                  DelThread(thread.threadId);
                }}
              ></i>
            </li>
          ))
        ) : (
          <p>No threads found</p>
        )}
      </div>

      {/* Footer */}
      <div className="signs text-center">
        <p>AiroCare AI</p>
      </div>
    </section>
  );
}

export default Sidebar;
