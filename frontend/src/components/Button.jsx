function Button({ handleCurrentFile, fileName }) {
    return (
        <button className="fileBtn" id={fileName} onClick={() => handleCurrentFile(fileName)}>
            {fileName}
        </button>
    )
}

export default Button