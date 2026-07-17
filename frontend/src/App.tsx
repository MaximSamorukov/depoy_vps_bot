import { useEffect, useState } from "react";
import styles from "./App.module.scss";
interface Message {
  id: number;
  message: string;
}
function App() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    fetch(import.meta.env.VITE_API_URL + "/messages")
      .then((r) => r.json())
      .then(setMessages)
      .catch(() => setMessages([]));
  }, []);

  const handleSave = async () => {
    if (!input.trim()) return;
    try {
      const res = await fetch(import.meta.env.VITE_API_URL + "/messages", {
        method: "POST",
        body: JSON.stringify({ message: input }),
      });
      const created = await res.json();
      setMessages([...messages, created]);
      setInput("");
    } catch {}
  };

  const handleDelete = async (id: number) => {
    await fetch(import.meta.env.VITE_API_URL + `/messages/${id}`, {
      method: "DELETE",
    });
    setMessages(messages.filter((m) => m.id !== id));
  };

  const isButtonDisabled = !input.trim();
  return (
    <div className={styles.container}>
      <h1>Сообщения</h1>

      <div className={styles.form}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Введите сообщение..."
        />
        <button onClick={handleSave} disabled={isButtonDisabled}>
          Сохранить
        </button>
      </div>

      <ul className={styles.messageList}>
        {messages.length === 0 ? (
          <li className={styles.emptyMessage}>Нет сообщений</li>
        ) : (
          messages.map((m) => (
            <li key={m.id} className={styles.messageItem}>
              <span className={styles.messageText}>{m.message}</span>
              <button
                className={styles.deleteButton}
                onClick={() => handleDelete(m.id)}
              >
                Удалить
              </button>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}

export default App;
