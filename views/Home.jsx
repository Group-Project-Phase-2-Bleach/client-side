import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Sidebar from "../src/components/Sidebar";
import IncomingMessage from "../src/components/IncomingMessage";
import OutgoingMessage from "../src/components/OutgoingMessage";
import { socket } from "../src/socket";
import toastMsgNotif from "../utils/toastMsgNotif";
import Loading from "../src/components/Loading";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteMessageOnPub,
  fetchPublicMessage,
  sendPublicMessage,
} from "../src/features/PublicMessage/PublicMessageSlice";
import { fetchLoggedProfile } from "../src/features/User/CurrentlyLoggedProfile";
import Modal from "../src/components/Modal";
export default function Home() {
  const dispatch = useDispatch();
  const [file, setFile] = useState(null);
  const publicMessage = useSelector((state) => state.pubMessage.pubMessageList);
  const [sendPubMessage, setSendPubMessage] = useState("");
  const [fileName, setFileName] = useState("Upload");
  const [loading, setLoading] = useState(false);

  const loggedProfile = useSelector(
    (state) => state.currentlyLoggedProfile.userDataLogin
  );

  const currentUser = {
    currentUsername: loggedProfile.username,
    currentId: loggedProfile.id,
  };

  const handleSendMessage = async (event) => {
    event.preventDefault();
    setLoading("Loading....");
    const response = dispatch(
      sendPublicMessage(file, sendPubMessage, currentUser)
    ).then(() => {
      if (response) {
        setFileName("Upload");
        setFile(null);
        setSendPubMessage("");
        setLoading(false);
      }
    });
  };

  const onDeleteMessage = async (id) => {
    dispatch(deleteMessageOnPub(id));
  };

  const handleFileUpload = (e) => {
    setFile(e.target.files[0]);
    setFileName(e.target.files[0] ? e.target.files[0].name : "Upload");
  };

  const clearFile = (event) => {
    event.preventDefault();
    setFile(null);
    setFileName("Upload");
  };

  useEffect(() => {
    socket.connect();
    socket.on("broadcastMessage", (newMessage) => {
      if (newMessage.sender !== currentUser.currentUsername) {
        toastMsgNotif(newMessage.message);
      }

      dispatch(fetchPublicMessage());
    });

    socket.on("broadcastDelete", (data) => {
      // setMessage(data)
      dispatch(fetchPublicMessage());
    });

    return () => {
      socket.disconnect();
      socket.off("broadcastMessage");
      socket.off("broadcastDelete");
    };
  }, [publicMessage]);

  useEffect(() => {
    dispatch(fetchLoggedProfile());
    dispatch(fetchPublicMessage());
  }, []);

  return (
    <>
      <div className="flex h-screen overflow-hidden bg-gray-100">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Chat Area */}
        <div className="flex-1 bg-gray-100 ">
          {/* Chat Header */}
          <header className="bg-white p-4 text-gray-700 bg-gray-100">
            <h1 className="text-2xl font-semibold bg-gray-100"></h1>
          </header>
          <div className="h-screen max-h-[80vh] overflow-y-auto p-4 pb-36 bg-gray-100 flex items-center justify-center">
            <h1 className="text-4xl text-center">
              Click profile to enter a chat...
            </h1>
          </div>
          {/* Chat Input */}
          <footer className="bg-black-100 border-t border-gray-300 p-4 absolute bottom-0 w-3/4 border-solid">
            <div>
              {/* <Modal /> */}

            </div>
          </footer>
        </div>
      </div>
    </>
  );
}
