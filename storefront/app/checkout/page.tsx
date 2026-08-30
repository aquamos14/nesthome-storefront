"use client";

import { useState } from "react";
import Link from "next/link";
import { useCart } from "@/lib/cart";
import { formatPrice } from "@/lib/format";

export default function CheckoutPage() {
  const { items, subtotal, clear } = useCart();
  const [placed, setPlaced] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    province: "",
    city: "",
    address: "",
    note: "",
    pay: "wechat",
  });

  const shipping = subtotal >= 99 || subtotal === 0 ? 0 : 12;
  const total = subtotal + shipping;

  function set(k: keyof typeof form, v: string) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name || !form.phone || !form.address) {
      alert("请填写收货人、手机号与详细地址");
      return;
    }
    const orderNo =
      "NH" + Date.now().toString().slice(-10);
    clear();
    setPlaced(orderNo);
  }

  if (placed) {
    return (
      <section className="section">
        <div className="container">
          <div className="empty" style={{ padding: "60px 20px" }}>
            <div style={{ fontSize: 44, marginBottom: 12 }}>✅</div>
            <h2 style={{ fontSize: 24, marginBottom: 10 }}>订单已提交</h2>
            <p style={{ marginBottom: 6 }}>
              订单号：<strong>{placed}</strong>
            </p>
            <p className="muted" style={{ marginBottom: 24 }}>
              我们会尽快为你打包发货，感谢信任栖屋。
            </p>
            <Link href="/products" className="btn btn-primary">
              继续逛逛
            </Link>
          </div>
        </div>
      </section>
    );
  }

  if (items.length === 0) {
    return (
      <section className="section">
        <div className="container">
          <div className="empty">
            <h2 style={{ fontSize: 22, marginBottom: 12 }}>还没有可结算的商品</h2>
            <Link href="/products" className="btn btn-primary">
              去挑选
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="section">
      <div className="container">
        <h1 style={{ fontSize: 28, marginBottom: 28 }}>结算</h1>
        <form className="form-grid" onSubmit={submit}>
          <div className="panel">
            <h2>收货信息</h2>
            <div className="row-2">
              <div className="field">
                <label className="label">收货人 *</label>
                <input
                  className="input"
                  value={form.name}
                  onChange={(e) => set("name", e.target.value)}
                  placeholder="你的名字"
                />
              </div>
              <div className="field">
                <label className="label">手机号 *</label>
                <input
                  className="input"
                  value={form.phone}
                  onChange={(e) => set("phone", e.target.value)}
                  placeholder="11 位手机号"
                />
              </div>
            </div>
            <div className="field">
              <label className="label">邮箱（选填）</label>
              <input
                className="input"
                value={form.email}
                onChange={(e) => set("email", e.target.value)}
                placeholder="用于接收电子发票"
              />
            </div>
            <div className="row-2">
              <div className="field">
                <label className="label">省 / 直辖市</label>
                <input
                  className="input"
                  value={form.province}
                  onChange={(e) => set("province", e.target.value)}
                  placeholder="如：北京市"
                />
              </div>
              <div className="field">
                <label className="label">城市 / 区</label>
                <input
                  className="input"
                  value={form.city}
                  onChange={(e) => set("city", e.target.value)}
                  placeholder="如：朝阳区"
                />
              </div>
            </div>
            <div className="field">
              <label className="label">详细地址 *</label>
              <input
                className="input"
                value={form.address}
                onChange={(e) => set("address", e.target.value)}
                placeholder="街道、小区、门牌号"
              />
            </div>
            <div className="field">
              <label className="label">备注（选填）</label>
              <textarea
                className="textarea"
                rows={3}
                value={form.note}
                onChange={(e) => set("note", e.target.value)}
                placeholder="如有配送要求请告诉我们"
              />
            </div>

            <h2 style={{ marginTop: 28 }}>支付方式</h2>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              {[
                { id: "wechat", label: "微信支付" },
                { id: "alipay", label: "支付宝" },
                { id: "cod", label: "货到付款" },
              ].map((m) => (
                <label
                  key={m.id}
                  className="pill"
                  style={{
                    cursor: "pointer",
                    background: form.pay === m.id ? "var(--sage)" : "var(--surface)",
                    color: form.pay === m.id ? "#fff" : "var(--ink-soft)",
                    borderColor: form.pay === m.id ? "var(--sage)" : "var(--line-strong)",
                  }}
                >
                  <input
                    type="radio"
                    name="pay"
                    value={m.id}
                    checked={form.pay === m.id}
                    onChange={() => set("pay", m.id)}
                    style={{ display: "none" }}
                  />
                  {m.label}
                </label>
              ))}
            </div>
          </div>

          <aside className="summary" style={{ position: "sticky", top: 88 }}>
            <h3>订单摘要</h3>
            {items.map((i) => (
              <div className="summary-row" key={i.id}>
                <span>
                  {i.title}
                  <span className="muted"> × {i.quantity}</span>
                </span>
                <span>{formatPrice(i.price * i.quantity)}</span>
              </div>
            ))}
            <div className="summary-row">
              <span>运费</span>
              <span>{shipping === 0 ? "包邮" : formatPrice(shipping)}</span>
            </div>
            <div className="summary-row total">
              <span>应付</span>
              <span>{formatPrice(total)}</span>
            </div>
            <button type="submit" className="btn btn-primary btn-block" style={{ marginTop: 18 }}>
              提交订单
            </button>
            <Link
              href="/cart"
              className="muted"
              style={{ display: "block", textAlign: "center", marginTop: 12, fontSize: 13 }}
            >
              返回购物车
            </Link>
          </aside>
        </form>
      </div>
    </section>
  );
}
