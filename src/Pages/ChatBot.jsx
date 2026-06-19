import React, { useState } from "react";
import ReactMarkdown from "react-markdown";

const ChatBot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { role: "assistant", content: "Hello! I'm your AI movie expert. Ask me what's trending, or ask for details about a specific movie! 🍿" }
    ]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const sendMessage = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMessage = { role: "user", content: input };
        const newMessages = [...messages, userMessage];
        
        setMessages(newMessages);
        setInput("");
        setIsLoading(true);

        try {
            const backendUrl = process.env.REACT_APP_BACKEND_URL || "http://localhost:3001";
            const response = await fetch(`${backendUrl}/chat`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ messages: newMessages }),
            });
            const data = await response.json();

            setMessages([...newMessages, { role: "assistant", content: data.reply }]);
        } catch (error) {
            setMessages([...newMessages, { role: "assistant", content: "Sorry, I lost connection to the server." }]);
        }

        setIsLoading(false);
    };

    return (
        <>
            <style>
                {`
                @keyframes slideUp {
                    from { opacity: 0; transform: translateY(20px) scale(0.95); }
                    to { opacity: 1; transform: translateY(0) scale(1); }
                }
                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background-color: rgba(255, 255, 255, 0.2);
                    border-radius: 10px;
                }
                .markdown-body p { margin-top: 0; margin-bottom: 8px; }
                .markdown-body ul { margin-top: 0; padding-left: 20px; }
                `}
            </style>
            <div style={styles.floatingWrapper}>
                {isOpen && (
                    <div style={styles.chatWindow}>
                        <div style={styles.header}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <span style={{ fontSize: '20px' }}>🤖</span>
                                <span style={{ fontWeight: "600", letterSpacing: "0.5px" }}>Flimpedia Assistant</span>
                            </div>
                            <button onClick={() => setIsOpen(false)} style={styles.closeBtn}>✖</button>
                        </div>
                        
                        <div style={styles.chatBox} className="custom-scrollbar">
                            {messages.map((msg, index) => (
                                <div key={index} style={msg.role === "user" ? styles.userMsgWrapper : styles.botMsgWrapper}>
                                    <div style={msg.role === "user" ? styles.userMsg : styles.botMsg}>
                                        {msg.role === "user" ? (
                                            msg.content
                                        ) : (
                                            <div className="markdown-body" style={{ fontSize: "14px", lineHeight: "1.5" }}>
                                                <ReactMarkdown>{msg.content}</ReactMarkdown>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                            {isLoading && (
                                <div style={styles.botMsgWrapper}>
                                    <div style={{...styles.botMsg, fontStyle: "italic", opacity: 0.8}}>
                                        Thinking... ✨
                                    </div>
                                </div>
                            )}
                        </div>
                        
                        <form onSubmit={sendMessage} style={styles.form}>
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Type a message..."
                                style={styles.input}
                            />
                            <button type="submit" disabled={isLoading || !input.trim()} style={{...styles.sendBtn, opacity: input.trim() ? 1 : 0.5}}>
                                Send
                            </button>
                        </form>
                    </div>
                )}

                {!isOpen && (
                    <button onClick={() => setIsOpen(true)} style={styles.toggleBtn}>
                        <span style={{ fontSize: '24px', marginRight: '8px' }}>💬</span>
                        Ask AI
                    </button>
                )}
            </div>
        </>
    );
};

const styles = {
    floatingWrapper: {
        position: "fixed",
        bottom: "30px",
        right: "30px",
        zIndex: 9999,
        fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif"
    },
    toggleBtn: {
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        color: "white",
        border: "none",
        borderRadius: "50px",
        padding: "12px 24px",
        fontSize: "16px",
        fontWeight: "600",
        cursor: "pointer",
        boxShadow: "0 8px 20px rgba(118, 75, 162, 0.4)",
        transition: "transform 0.2s ease, box-shadow 0.2s ease",
        display: "flex",
        alignItems: "center",
        fontFamily: "inherit"
    },
    chatWindow: {
        width: "360px",
        height: "550px",
        background: "rgba(30, 32, 40, 0.85)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        border: "1px solid rgba(255, 255, 255, 0.1)",
        borderRadius: "20px",
        display: "flex",
        flexDirection: "column",
        boxShadow: "0 20px 40px rgba(0,0,0,0.4)",
        overflow: "hidden",
        animation: "slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)"
    },
    header: {
        background: "linear-gradient(135deg, rgba(102, 126, 234, 0.9) 0%, rgba(118, 75, 162, 0.9) 100%)",
        color: "white",
        padding: "16px 20px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        borderBottom: "1px solid rgba(255, 255, 255, 0.05)"
    },
    closeBtn: {
        background: "rgba(255, 255, 255, 0.2)",
        border: "none",
        color: "white",
        fontSize: "12px",
        cursor: "pointer",
        width: "28px",
        height: "28px",
        borderRadius: "50%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transition: "background 0.2s ease"
    },
    chatBox: {
        flex: 1,
        overflowY: "auto",
        padding: "20px",
        display: "flex",
        flexDirection: "column",
        gap: "12px",
        scrollBehavior: "smooth"
    },
    userMsgWrapper: {
        display: "flex",
        justifyContent: "flex-end"
    },
    botMsgWrapper: {
        display: "flex",
        justifyContent: "flex-start"
    },
    userMsg: {
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        color: "white",
        padding: "12px 16px",
        borderRadius: "18px 18px 4px 18px",
        maxWidth: "85%",
        fontSize: "14.5px",
        boxShadow: "0 4px 12px rgba(118, 75, 162, 0.2)",
        lineHeight: "1.5"
    },
    botMsg: {
        background: "rgba(255, 255, 255, 0.1)",
        color: "#f8f9fa",
        padding: "12px 16px",
        borderRadius: "18px 18px 18px 4px",
        maxWidth: "90%",
        fontSize: "14.5px",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
        border: "1px solid rgba(255, 255, 255, 0.05)",
        lineHeight: "1.5"
    },
    form: {
        display: "flex",
        padding: "15px",
        background: "rgba(20, 22, 28, 0.9)",
        borderTop: "1px solid rgba(255, 255, 255, 0.05)",
        gap: "10px"
    },
    input: {
        flex: 1,
        padding: "12px 16px",
        borderRadius: "20px",
        border: "1px solid rgba(255, 255, 255, 0.1)",
        background: "rgba(255, 255, 255, 0.05)",
        color: "white",
        fontSize: "14px",
        fontFamily: "inherit",
        outline: "none",
        transition: "border 0.2s ease"
    },
    sendBtn: {
        padding: "10px 20px",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        color: "white",
        border: "none",
        borderRadius: "20px",
        cursor: "pointer",
        fontWeight: "600",
        fontSize: "14px",
        fontFamily: "inherit",
        transition: "opacity 0.2s ease"
    }
};

export default ChatBot;
