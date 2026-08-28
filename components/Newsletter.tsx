"use client";

import { useState } from "react";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.includes("@")) return;
    setDone(true);
    setEmail("");
  }

  return (
    <div className="newsletter">
      <h2>订阅栖屋来信</h2>
      <p>新品上架、限定礼遇与居家灵感，第一时间送达你的邮箱。</p>
      {done ? (
        <div className="success-box" style={{ maxWidth: 440, margin: "0 auto" }}>
          已订阅，感谢你愿意听我们聊聊家。✿
        </div>
      ) : (
        <form className="newsletter-form" onSubmit={submit}>
          <input
            className="input"
            type="email"
            required
            placeholder="你的邮箱地址"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button type="submit" className="btn btn-primary">
            订阅
          </button>
        </form>
      )}
    </div>
  );
}
