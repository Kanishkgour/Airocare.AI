import "./ChatWindow.css";
import { MyContext } from "./MyContext.jsx";
import { createContext, useContext, useEffect, useState } from "react";
import { ScaleLoader, PuffLoader } from "react-spinners";

import Chatcomponent from "./Chat.jsx";

function ChatWindow() {
  const {
    prompt,
    SetPrompt,
    reply,
    setReply,
    currThreadId,
    prevChats,
    setPrevChats,
    setNewChat,
  } = useContext(MyContext);

  const [profile, SetProfile] = useState(false);

  const [load, setLoad] = useState(false);
  const getReply = async () => {
    setLoad(true);
    setNewChat(false);
    // console.log("Message: ", prompt); //uncomment this to check the user input message 

    const options = {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        message: prompt,
        threadId: currThreadId,
      }),
    };

    try {
      const REACT_APP_API_URL = "http://localhost:8080";
      if (!REACT_APP_API_URL) {
        console.error("API URL is not defined");
        return;
      }

      const response = await fetch(`${REACT_APP_API_URL}/api/chat`, options);
      const res = await response.json();
      // console.log("response : ", res);  //uncomment this to check the response
      setReply(res.reply);
    } catch (error) {
      console.log("Error", error);
    }
    setLoad(false);
  };

  useEffect(() => {
    if (prompt && reply) {
      setPrevChats((prevChats) => [
        ...prevChats,
        { role: "user", content: prompt },
        { role: "assistant", content: reply },
      ]);
    }
    SetPrompt("");
  }, [reply]);

  return (
    <>
      <div className="chatWindow">
        <div className="navbar">
          <div className="left-Section">
            <span>
              <button>
                AiroCare <i className="fa-solid fa-angle-down"></i>{" "}
              </button>
            </span>
          </div>
          <div className="right-section">
            <li>
              <i className="fa-solid fa-arrow-up-from-bracket"></i>&nbsp; share
            </li>
            <li>
              <i className="fa-solid fa-ellipsis"></i>
            </li>
            <li onClick={() => SetProfile(!profile)}>
              {profile ? (
                <div className=" h-25 w-25 border-1 bg-body-tertiary text-light">
                  hello
                </div>
              ) : null}
              <i className="fa-solid fa-user userProfile"></i>
            </li>
          </div>
        </div>
        <Chatcomponent />

        <ScaleLoader
          color="#ffffff80"
          loading={load}
          className=" d-flex justify-content-center "
        />

        <div className="inputfields">
          <div className="one">
            <input
              type="text"
              placeholder="Ask Anything"
              autoFocus
              value={prompt}
              onChange={(e) => {
                SetPrompt(e.target.value);
              }}
              onKeyDown={(e) => (e.key === "Enter" ? getReply() : "")}
            />
            <button type="submit" onClick={getReply}>
              <i className="fa-solid fa-paper-plane"></i>
            </button>
          </div>

          <p className=" text-white-50">
            AiroCare can make mistakes. Check important info. See{" "}
            <u>Cookie Preferences.</u>
          </p>
        </div>
      </div>
    </>
  );
}

export default ChatWindow;

// https://qg1ktpng-5500.inc1.devtunnels.ms/
