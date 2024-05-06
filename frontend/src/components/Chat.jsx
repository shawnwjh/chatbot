function Chat({ chatLog, currentFile }) {
     return (
        <>
            {chatLog[currentFile.payload].map((chat, i) => <div className={chat.type}><span className="title">{chat.type}</span>{chat.body}</div>)}
        </>
    )
}

export default Chat