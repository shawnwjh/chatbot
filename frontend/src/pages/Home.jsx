import { React, useState, useEffect } from 'react'
import axios from 'axios'
import '../styles/Home.css'
import Button from '../components/Button'
import Chat from '../components/Chat'
import { useSelector, useDispatch } from 'react-redux'
import { addFile, deleteFile, updateCurrent } from '../redux/fileSlice'
import { startChat, addChat } from '../redux/chatSlice'

const SUMMARIZER_API = 'http://localhost:8000/chat/';
const SUMMARIZER_UPLOAD = 'http://localhost:8000/upload/';

function Home() {

  const allFiles = useSelector((state) => state.file.value);
  const currentFile = useSelector((state) => state.file.current);
  const chatLog = useSelector((state) => state.chat.value);
  const dispatch = useDispatch();

  const [file, setFile] = useState('');
  const [question, setQuestion] = useState('');
  const [fileLoading, setFileLoading] = useState(false);
  const [chatLoading, setChatLoading] = useState(false);

  useEffect(() => {
    const fileList = document.getElementsByClassName('fileBtn');
    for (let file of fileList) {
      if (file.id == currentFile.payload) {
        file.classList.add('active');
      } else {
        if (file.classList.contains('active')) {
          file.classList.remove('active');
        }
      }
    }
  })

  const handleChange = (e) => {
    setFile(e.target.files[0]);
  }

  const handleFileSubmit = (e) => {
    e.preventDefault();
    setFileLoading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('fileName', file.name);
    const config = {
      headers: {
        'content-type': 'multipart/form-data',
      },
    };
    axios.post(SUMMARIZER_UPLOAD, formData, config)
      .then((response) => {
        dispatch(addFile(response.data.filename[0]));
        dispatch(startChat(response.data.filename[0]));
        setFileLoading(false);
      })
      .catch((error) => {
        console.error("Error uploading file: ", error);
      });
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    setChatLoading(true);
    setQuestion('');
    const userChat = {
      "body": question,
      "type": "Me"
    }
    const saveChatlog = {
      "currentFile": currentFile.payload,
      "chat": userChat
    }
    dispatch(addChat(saveChatlog));
    const body = {
      "document": currentFile.payload,
      "body": question
    }
    fetch(SUMMARIZER_API, {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify(body)
    }).then((res) => {
      return res.json();
    }).then((data) => {
      const aiChat = {
        "body": data.message.response,
        "type": "Chatterbot"
      }
      const saveAIChatlog = {
        "currentFile": currentFile.payload,
        "chat": aiChat 
      }
      dispatch(addChat(saveAIChatlog));
      setChatLoading(false);
    })
  }

  const handleCurrentFile = (file) => {
    dispatch(updateCurrent(file));
  }

  return (
    <>
      <div id="filesContainer">
        <div id="fileList">          
          {allFiles.map((file, i) => <div className="fileBtnContainer"><Button handleCurrentFile={handleCurrentFile} fileName={file.payload}></Button></div>)}

          {fileLoading == true &&
            <div id="fileLoading">
              <img id="fileLoadingIcon" src="loading.gif" />
            </div>
          }

          {allFiles.length == 0 &&
            <div className="noFiles">No files uploaded</div>  
          }
        </div>

        <div id="uploadContainer">
          <form id="fileUpload" onSubmit={handleFileSubmit}>
            <input id="fileInput" type="file" onChange={handleChange} />
            <input type="submit" value="Upload" />
          </form>
        </div>
      </div>

      <div id="chatContainer">
        <div id="fileTitle">{currentFile.payload}</div>

        <div id="chatlog">
          {Object.keys(currentFile).length == 0 &&
            <div className="noFiles">No chats. Upload a file to start a chat!</div>  
          }
          
          {Object.keys(currentFile).length != 0 &&
            <Chat chatLog={chatLog} currentFile={currentFile}></Chat>
          }
          {chatLoading == true &&
            <div id="chatLoading">
              <img id="chatLoadingIcon" src="loading.gif" />
            </div>
          }
        </div>

        {currentFile != '' &&
          <div id="queryContainer">
            <input id="question" type="text" value={question} onChange={(e) => setQuestion(e.target.value)} placeholder="Enter your question" />
            <button onClick={handleSubmit}>Submit</button>
          </div>
        }
      </div>
    </>
  )
}

export default Home
