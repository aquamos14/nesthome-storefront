"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function AccountPage() {
  const [name, setName] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const n = localStorage.getItem("nesthome_name");
    if (n) setName(n);
  }, []);

  function save() {
    localStorage.setItem("nesthome_name", name);
    setSaved(true);
    setTimeout(() => setSaved(false), 1800);
  }

  return (
    <section className="section">
      <div className="container">
        <h1 style={{ fontSize: 28, marginBottom: 28 }}>我的账户</h1>

        <div className="form-grid">
          <div className="panel">
            <h2>个人资料</h2>
            <div className="field">
              <label className="label">昵称</label>
              <input
                className="input"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="怎么称呼你都行"
              />
            </div>
            <button className="btn btn-primary" onClick={save}>
              保存
            </button>
            {saved && (
              <span className="success-box" style={{ display: "inline-block", marginLeft: 12 }}>
                已保存 ✓
              </span>
            )}

            <h2 style={{ marginTop: 36 }}>我的订单</h2>
            <div className="notice">
              你还没有订单。下单后，订单会显示在这里，方便你追踪物流。
            </div>

            <h2 style={{ marginTop: 36 }}>收货地址</h2>
            <div className="notice">还没有保存的地址，结算时填写即可。</div>
          </div>

          <aside className="summary">
            <h3>快捷入口</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <Link href="/cart" className="btn btn-ghost btn-block">
                我的购物车
              </Link>
              <Link href="/products" className="btn btn-ghost btn-block">
                继续购物
              </Link>
              <Link href="/" className="btn btn-ghost btn-block">
                回到首页
              </Link>
            </div>
            <hr className="divider" style={{ margin: "20px 0" }} />
            <p className="muted" style={{ fontSize: 13 }}>
              数据说明：当前为演示站点，账户与订单仅保存在你的浏览器本地，
              不会上传服务器。
            </p>
          </aside>
        </div>
      </div>
    </section>
  );
}
