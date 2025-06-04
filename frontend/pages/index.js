import { useEffect, useState, useRef } from 'react';

export default function Home() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [status, setStatus] = useState('Connecting...');
  const ws = useRef(null);

  useEffect(() => {
    ws.current = new WebSocket('ws://localhost:3001');

    ws.current.onopen = () => {
      console.log('Connected to WebSocket server');
      setStatus('Connected');
    };

    ws.current.onmessage = async (event) => {
      try {
        let messageData;
        
    
        if (event.data instanceof Blob) {
         
          messageData = await event.data.text();
        } else {
         
          messageData = event.data;
        }
        
        const message = JSON.parse(messageData);
        setMessages((prev) => [...prev, message]);
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
        console.log('Raw event data:', event.data);
      }
    };

    ws.current.onclose = () => {
      console.log('Disconnected from WebSocket server');
      setStatus('Disconnected');
    };

    ws.current.onerror = (error) => {
      console.error('WebSocket error:', error);
      setStatus('Error');
    };

    return () => {
      ws.current.close();
    };
  }, []);

  const sendMessage = () => {
    if (input.trim() === '') return;

    if (ws.current.readyState !== WebSocket.OPEN) {
      console.log('WebSocket not open yet.');
      return;
    }

    const messageObj = {
      text: input,
      timestamp: new Date().toLocaleTimeString(),
    };

    ws.current.send(JSON.stringify(messageObj));
    setMessages((prev) => [...prev, messageObj]);
    setInput('');
  };

  return (
    <div style={{ maxWidth: 600, margin: 'auto', padding: 20 }}>
      <h1>Hangout Chat</h1>
      <p>Status: <strong>{status}</strong></p>

      <div
        style={{
          border: '1px solid #ccc',
          height: 400,
          overflowY: 'scroll',
          padding: 10,
          marginBottom: 10,
        }}
      >
        {messages.map((msg, idx) => (
          <div key={idx} style={{ marginBottom: 8 }}>
            <span style={{ fontWeight: 'bold' }}>{msg.timestamp}: </span>
            <span>{msg.text}</span>
          </div>
        ))}
      </div>

      <input
        type="text"
        placeholder="Type your message..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
        style={{ width: '80%', padding: 10, marginRight: 10 }}
      />

      <button onClick={sendMessage} style={{ padding: '10px 20px' }}>
        Send
      </button>
    </div>
  );
}