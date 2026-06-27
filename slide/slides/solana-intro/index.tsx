import React from "react";
import type { DesignSystem, Page, SlideMeta } from "@open-slide/core";
import { useSlidePageNumber } from "@open-slide/core";

export const design: DesignSystem = {
  palette: { bg: "#0a0a14", text: "#f0f0f5", accent: "#9945FF" },
  fonts: {
    display: 'system-ui, -apple-system, "Segoe UI", sans-serif',
    body: 'system-ui, -apple-system, "Segoe UI", sans-serif',
  },
  typeScale: { hero: 160, body: 36 },
  radius: 12,
};

const G = "#14F195";
const P = "#9945FF";
const muted = "#7a7a9a";
const card = "rgba(255,255,255,0.04)";
const border = "rgba(255,255,255,0.08)";

const fill = { width: "100%", height: "100%", fontFamily: "var(--osd-font-body)" } as const;

const EASE_OUT = "cubic-bezier(0, 0, 0.2, 1)";
const EASE_IN = "cubic-bezier(0.4, 0, 1, 1)";

export const transition = {
  duration: 240,
  exit: { duration: 160, easing: EASE_IN, keyframes: [{ opacity: 1 }, { opacity: 0 }] },
  enter: {
    duration: 240,
    delay: 80,
    easing: EASE_OUT,
    keyframes: [
      { opacity: 0, transform: "translateY(8px)" },
      { opacity: 1, transform: "translateY(0)" },
    ],
  },
};

/* ─── Anim ─── */

const a = (d = 0) => ({ animation: `su 0.5s ${d}s ease-out both` }) as React.CSSProperties;
const AF = `
@keyframes su{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:translateY(0)}}
@keyframes fi{from{opacity:0}to{opacity:1}}
@keyframes sc{from{opacity:0;transform:scale(.93)}to{opacity:1;transform:scale(1)}}
@keyframes gf{0%{background-position:0% 50%}50%{background-position:100% 50%}100%{background-position:0% 50%}}
@keyframes pu{0%,100%{opacity:.4}50%{opacity:1}}
`;

/* ─── Components ─── */

const Anim = () => <style dangerouslySetInnerHTML={{ __html: AF }} />;

const Footer = () => {
  const { current, total } = useSlidePageNumber();
  return (
    <div
      style={{
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "18px 100px",
        fontSize: 18,
        color: muted,
      }}
    >
      <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <span
          style={{
            width: 10,
            height: 10,
            borderRadius: "50%",
            background: G,
            animation: "pu 2s ease-in-out infinite",
          }}
        />
        Tìm hiểu về Solana
      </span>
      <span>
        {String(current).padStart(2, "0")} / {String(total).padStart(2, "0")}
      </span>
    </div>
  );
};

const Eye = ({ children, c = G }: { children: React.ReactNode; c?: string }) => (
  <div
    style={{
      fontSize: 18,
      color: c,
      letterSpacing: "0.2em",
      fontWeight: 600,
      textTransform: "uppercase" as const,
    }}
  >
    {children}
  </div>
);

const H = ({
  children,
  s = 52,
  st,
}: {
  children: React.ReactNode;
  s?: number;
  st?: React.CSSProperties;
}) => (
  <h2
    style={{
      fontFamily: "var(--osd-font-display)",
      fontSize: s,
      fontWeight: 800,
      margin: 0,
      lineHeight: 1.15,
      ...st,
    }}
  >
    {children}
  </h2>
);

const B = ({ children, c = "#bbb" }: { children: React.ReactNode; c?: string }) => (
  <div style={{ fontSize: 22, lineHeight: 1.55, color: c }}>{children}</div>
);

const Hl = ({ children, c = "#fff" }: { children: React.ReactNode; c?: string }) => (
  <strong style={{ color: c }}>{children}</strong>
);

const Card = ({
  t,
  tc = P,
  d = 0,
  children,
  st,
}: {
  t: string;
  tc?: string;
  d?: number;
  children: React.ReactNode;
  st?: React.CSSProperties;
}) => (
  <div
    style={{
      background: card,
      border: `1px solid ${border}`,
      borderRadius: 14,
      padding: "22px 24px",
      display: "flex",
      flexDirection: "column",
      gap: 10,
      ...a(d),
      ...st,
    }}
  >
    <div style={{ fontSize: 26, fontWeight: 700, color: tc }}>{t}</div>
    {children}
  </div>
);

const Stat = ({ v, l, c = G }: { v: string; l: string; c?: string }) => (
  <div style={{ textAlign: "center" }}>
    <div style={{ fontSize: 40, fontWeight: 900, color: c }}>{v}</div>
    <div style={{ fontSize: 18, color: "#bbb" }}>{l}</div>
  </div>
);

/* ═══════════════════════════════ PAGES ═══════════════════════════════ */

/* ─── PART I: NỀN TẢNG BLOCKCHAIN ─── */

/* 1 — COVER */
const Cover: Page = () => (
  <div
    style={{
      ...fill,
      background: "linear-gradient(160deg, #0a0a14 0%, #1a0a2e 40%, #0d0d1a 100%)",
      color: "var(--osd-text)",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      padding: "0 140px",
    }}
  >
    <Anim />
    <div style={a(0)}>
      <Eye>KHÁM PHÁ BLOCKCHAIN</Eye>
    </div>
    <h1
      style={{
        fontFamily: "var(--osd-font-display)",
        fontSize: 150,
        fontWeight: 900,
        margin: "36px 0",
        lineHeight: 1.05,
        ...a(0.15),
      }}
    >
      Tìm hiểu về{" "}
      <span
        style={{
          background: `linear-gradient(90deg,${P},${G})`,
          backgroundSize: "200% auto",
          animation: "gf 4s ease infinite, su 0.5s 0.15s ease-out both",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
      >
        Solana
      </span>
    </h1>
    <p style={{ fontSize: 36, color: muted, maxWidth: 1000, lineHeight: 1.5, ...a(0.3) }}>
      Từ nền tảng blockchain đến kiến trúc hiệu suất cao —<br />
      hiểu tại sao Solana xử lý 5,000+ giao dịch mỗi giây.
    </p>
    <div
      style={{ display: "flex", gap: 40, marginTop: 56, fontSize: 24, color: muted, ...a(0.45) }}
    >
      {[
        ["#4fc3f7", "Blockchain"],
        ["#f7931a", "Bitcoin"],
        ["#627eea", "Ethereum"],
        [G, "Solana"],
      ].map(([c, l]) => (
        <span key={l} style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ width: 8, height: 8, borderRadius: "50%", background: c }} />
          {l}
        </span>
      ))}
    </div>
    <Footer />
  </div>
);

/* 2 — AGENDA */
const Agenda: Page = () => (
  <div
    style={{
      ...fill,
      background: "var(--osd-bg)",
      color: "var(--osd-text)",
      padding: "80px 140px",
      display: "flex",
      flexDirection: "column",
      gap: 28,
    }}
  >
    <Anim />
    <div style={a(0)}>
      <Eye>NỘI DUNG</Eye>
    </div>
    <H s={60} st={{ margin: "0 0 12px", ...a(0.1) }}>
      Tổng quan hành trình
    </H>
    {[
      ["01", "Nền tảng Blockchain", "Vấn đề tin cậy, mật mã, đồng thuận", 0.15],
      ["02", "Bitcoin", "Blockchain đầu tiên — UTXO, PoW, halving", 0.22],
      ["03", "Ethereum", "Hợp đồng thông minh, EVM, Solidity", 0.29],
      ["04", "Bài toán mở rộng", "Bộ ba bất khả tri, sequencer, sharding", 0.36],
      ["05", "Solana", "PoH, song parallel, tài khoản, Rust", 0.43],
      ["06", "Hệ sinh thái Dev", "So sánh ngôn ngữ, tooling, ecosystems", 0.5],
      ["07", "Thực tế & So sánh", "DeFi, NFT, phí, TPS, closing", 0.57],
    ].map(([n, ti, de, dl]) => (
      <div
        key={n}
        style={{ display: "flex", gap: 24, alignItems: "flex-start", ...a(dl as number) }}
      >
        <div
          style={{
            minWidth: 48,
            height: 48,
            borderRadius: 12,
            background: `${P}18`,
            border: `1px solid ${P}33`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 22,
            fontWeight: 700,
            color: P,
          }}
        >
          {n}
        </div>
        <div>
          <div style={{ fontSize: 30, fontWeight: 700 }}>{ti}</div>
          <div style={{ fontSize: 21, color: muted, marginTop: 2 }}>{de}</div>
        </div>
      </div>
    ))}
    <Footer />
  </div>
);

/* 3 — SECTION: NỀN TẢNG */
const SecFoundation: Page = () => (
  <div
    style={{
      ...fill,
      background: "linear-gradient(135deg, #0a0a14 0%, #0d1a2e 50%, #0a0a14 100%)",
      color: "var(--osd-text)",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      textAlign: "center",
      padding: "0 140px",
    }}
  >
    <Anim />
    <div style={a(0)}>
      <Eye c="#4fc3f7">PHẦN I</Eye>
    </div>
    <H s={110} st={{ margin: "36px 0 0", color: "#4fc3f7", ...a(0.15) }}>
      Nền tảng Blockchain
    </H>
    <p
      style={{
        fontSize: 30,
        color: muted,
        marginTop: 24,
        maxWidth: 700,
        lineHeight: 1.5,
        ...a(0.3),
      }}
    >
      Từ vấn đề tin cậy đến sổ cái phân tán — nền tảng của mọi blockchain
    </p>
    <Footer />
  </div>
);

/* 4 — VẤN ĐỀ CHI TIÊU GẤP ĐÔI */
const PgDoubleSpend: Page = () => (
  <div
    style={{
      ...fill,
      background: "var(--osd-bg)",
      color: "var(--osd-text)",
      padding: "80px 120px",
      display: "flex",
      flexDirection: "column",
    }}
  >
    <Anim />
    <div style={a(0)}>
      <Eye c="#4fc3f7">VẤN ĐỀ CƠ BẢN</Eye>
    </div>
    <H s={52} st={{ margin: "14px 0 24px", ...a(0.1) }}>
      Vấn đề chi tiêu gấp đôi
    </H>
    <div style={{ display: "flex", gap: 24, flex: 1 }}>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 14 }}>
        <Card t="Tiền vật lý vs Kỹ thuật số" tc="#4fc3f7" d={0.15}>
          <B>Tờ 20$ chỉ tồn tại ở 1 nơi. Khi bạn đưa đi, bạn không còn giữ nó.</B>
          <B>
            File MP3: cả hai đều có bản sao. Sao chép miễn phí → quyền sở hữu kỹ thuật số gần như
            không thể.
          </B>
        </Card>
        <Card t="Chi tiêu gấp đôi" tc="#4fc3f7" d={0.22}>
          <B>Alice có 100$. Gửi cho Bob mua laptop. 5 phút sau, gửi cùng 100$ cho Carol mua vé.</B>
          <B>
            <Hl c="#ff5252">Kết quả:</Hl> Cả Bob và Carol đều nghĩ mình nhận tiền. Một người mất tất
            cả.
          </B>
        </Card>
      </div>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 14 }}>
        <Card t="Ngân hàng giải quyết" tc="#4fc3f7" d={0.18}>
          <B>
            Duy trì sổ cái tập trung: kiểm tra số dư → trừ tiền → ghi có. Đảm bảo Alice không chi
            quá.
          </B>
        </Card>
        <Card t="Cái giá của tập trung hóa" tc="#ff5252" d={0.25}>
          <B>
            <Hl c="#ff5252">Phí:</Hl> 2-3% mỗi giao dịch thẻ · Chuyển quốc tế đắt hơn số tiền gửi
          </B>
          <B>
            <Hl c="#ff5252">Mất quyền riêng tư:</Hl> Ngân hàng thấy mọi giao dịch · Dữ liệu bán cho
            quảng cáo
          </B>
          <B>
            <Hl c="#ff5252">Loại trừ:</Hl> 1+ tỷ người không có tài khoản ngân hàng
          </B>
          <B>
            <Hl c="#ff5252">Điểm failure:</Hl> Síp tịch thu tiền gửi 2013 · Equifax rò rỉ 147 triệu
            người
          </B>
        </Card>
      </div>
    </div>
    <Footer />
  </div>
);

/* 5 — HÀM BĂM */
const PgHashing: Page = () => (
  <div
    style={{
      ...fill,
      background: "var(--osd-bg)",
      color: "var(--osd-text)",
      padding: "80px 120px",
      display: "flex",
      flexDirection: "column",
    }}
  >
    <Anim />
    <div style={a(0)}>
      <Eye c="#4fc3f7">MẬT MÃ</Eye>
    </div>
    <H s={52} st={{ margin: "14px 0 24px", ...a(0.1) }}>
      Hàm băm — Dấu vân tay kỹ thuật số
    </H>
    <div style={{ display: "flex", gap: 24, flex: 1 }}>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 14 }}>
        <Card t="SHA-256 hoạt động thế nào?" tc="#4fc3f7" d={0.15}>
          <B>Bất kỳ đầu vào nào → đầu ra cố định 64 ký tự hex (256 bit).</B>
          <div
            style={{
              background: `${P}0a`,
              borderRadius: 10,
              padding: "12px 16px",
              fontSize: 18,
              fontFamily: "monospace",
              color: "#aaa",
              lineHeight: 1.6,
              marginTop: 4,
            }}
          >
            SHA-256("Hello") = 185f8db3...81969
            <br />
            SHA-256("hello") = 2cf24dba...b9824
            <br />
            <span style={{ color: "#ff5252" }}>Thay đổi 1 chữ hoa = hash hoàn toàn khác</span>
          </div>
        </Card>
        <Card t="Ba tính chất quyết định" tc="#4fc3f7" d={0.22}>
          <B>
            <Hl>Xác định:</Hl> Cùng đầu vào → luôn cùng đầu ra
          </B>
          <B>
            <Hl>Không thể đảo ngược:</Hl> Tính hash mất ms. Đảo ngược mất hàng tỷ năm
          </B>
          <B>
            <Hl>Hiệu ứng avalanche:</Hl> Thay đổi 1 bit → đầu ra hoàn toàn khác
          </B>
        </Card>
      </div>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 14 }}>
        <Card t="Ứng dụng trong blockchain" tc="#4fc3f7" d={0.18}>
          <B>Mỗi khối chứa hash của khối trước → chuỗi không thể thay đổi.</B>
          <B>Sửa 1 giao dịch từ tuần trước = phá vỡ hash khối đó + tất cả khối sau.</B>
          <B>Phải tính lại nhanh hơn mạng lưới thêm khối mới → gần như không thể.</B>
        </Card>
        <Card t="Cây Merkle" tc="#4fc3f7" d={0.25}>
          <B>Cấu trúc nhị phân: mỗi lá = 1 giao dịch, mỗi nút cha = hash(2 con).</B>
          <B>Xác minh 1 giao dịch trong 1 triệu chỉ cần ~20 hash (vài KB).</B>
          <B>Máy khách nhẹ (light client) có thể xác minh mà không cần tải toàn bộ chuỗi.</B>
        </Card>
      </div>
    </div>
    <Footer />
  </div>
);

/* 6 — CHỮ KÝ SỐ */
const PgSignatures: Page = () => (
  <div
    style={{
      ...fill,
      background: "var(--osd-bg)",
      color: "var(--osd-text)",
      padding: "80px 120px",
      display: "flex",
      flexDirection: "column",
    }}
  >
    <Anim />
    <div style={a(0)}>
      <Eye c="#4fc3f7">MẬT MÃ</Eye>
    </div>
    <H s={52} st={{ margin: "14px 0 24px", ...a(0.1) }}>
      Chữ ký số — Chứng minh quyền sở hữu
    </H>
    <div style={{ display: "flex", gap: 24, flex: 1 }}>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 14 }}>
        <Card t="Mã hóa bất đối xứng" tc="#4fc3f7" d={0.15}>
          <B>
            Tạo 2 khóa liên kết toán học: <Hl>khóa riêng</Hl> (bí mật) + <Hl>khóa công khai</Hl>{" "}
            (công khai).
          </B>
          <B>
            Nhanh tính toán tiến, không thể đảo ngược. Khóa riêng → chữ ký. Khóa công khai → xác
            minh.
          </B>
        </Card>
        <Card t="Chữ ký hoạt động thế nào?" tc="#4fc3f7" d={0.22}>
          <B>Ký 1 giao dịch bằng khóa riêng → chữ ký duy nhất cho cả khóa + nội dung.</B>
          <B>Bất kỳ ai có khóa công khai đều xác minh được chữ ký hợp lệ.</B>
          <B>
            <Hl>Nonce:</Hl> Bộ đếm đơn giản ngăn phát lại giao dịch cũ.
          </B>
        </Card>
      </div>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 14 }}>
        <Card t="Trong blockchain" tc="#4fc3f7" d={0.18}>
          <B>Ví = nơi lưu trữ khóa riêng + ký giao dịch. Đó là tất cả những gì ví làm.</B>
          <B>Đồng tiền thực sự tồn tại trên blockchain dưới dạng mục sổ cái.</B>
          <B>
            <Hl>Non-repudiation:</Hl> Ký xong không thể phủ nhận — toán học chứng minh.
          </B>
        </Card>
        <Card
          t="Hành trình giao dịch"
          tc={G}
          d={0.25}
          st={{ background: `linear-gradient(135deg, ${P}10, ${G}10)`, border: `1px solid ${P}33` }}
        >
          <B>1. Ví tạo giao dịch + ký bằng khóa riêng</B>
          <B>2. Phát tán đến mạng lưới → nút kiểm tra chữ ký + số dư</B>
          <B>3. Thợ đào gom vào khối → tìm hash hợp lệ (PoW)</B>
          <B>4. Nút khác xác minh → thêm vào bản sao chuỗi</B>
          <B>5. Sau 6 khối (~60 phút BTC) → không thể đảo ngược</B>
        </Card>
      </div>
    </div>
    <Footer />
  </div>
);

/* 7 — ĐỒNG THUẬN: PoW & PoS */
const PgConsensus: Page = () => (
  <div
    style={{
      ...fill,
      background: "var(--osd-bg)",
      color: "var(--osd-text)",
      padding: "80px 120px",
      display: "flex",
      flexDirection: "column",
    }}
  >
    <Anim />
    <div style={a(0)}>
      <Eye c="#4fc3f7">ĐỒNG THUẬN</Eye>
    </div>
    <H s={52} st={{ margin: "14px 0 24px", ...a(0.1) }}>
      Bằng chứng Công việc & Cổ phần
    </H>
    <div style={{ display: "flex", gap: 24, flex: 1 }}>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 14 }}>
        <Card t="Vấn đề tướng Byzantine" tc="#4fc3f7" d={0.15}>
          <B>
            Hàng nghìn người lạ, không ai tin ai, một số có thể nói dối. Ai quyết định phiên bản
            đúng?
          </B>
          <B>
            Giải pháp toán học: cần 3f+1 người để chịu f kẻ phản bội. Nhưng không thực tế cho mạng
            mở.
          </B>
        </Card>
        <Card t="Bằng chứng Công việc (PoW)" tc="#f7931a" d={0.22}>
          <B>
            Thợ đào tìm nonce → hash phải bắt đầu bằng nhiều số 0. ~2^77 phép tính để tìm 1 khối.
          </B>
          <B>Xác minh chỉ mất ms. Viết lại lịch sử = làm lại toàn bộ công suất tính toán.</B>
          <B>Độ khó tự điều chỉnh mỗi 2,016 khối (~2 tuần) để duy trì 10 phút/khối.</B>
        </Card>
      </div>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 14 }}>
        <Card t="Bằng chứng Cổ phần (PoS)" tc="#627eea" d={0.18}>
          <B>
            Trình xác thực đặt cọc token. Được chọn ngẫu nhiên đề xuất khối, weight theo cổ phần.
          </B>
          <B>Honest → phần thưởng. Dishonest → bị cắt giảm cọc (slashing) — mất vốn.</B>
          <B>
            <Hl c="#4caf50">Lợi thế:</Hl> Hoàn thiện ~13 phút (ETH) · Tiết kiệm năng lượng · Phân
            mảnh được
          </B>
        </Card>
        <Card t="Bộ ba bất khả tri" tc="#ff5252" d={0.25}>
          <B>
            Chọn tối đa 2 trong 3: <Hl>Bảo mật</Hl> · <Hl>Mở rộng</Hl> · <Hl>Phi tập trung</Hl>
          </B>
          <B>Bitcoin: Bảo mật + Phi tập trung → 7 TPS</B>
          <B>Visa: Bảo mật + Mở rộng → Tập trung</B>
          <B>
            <Hl c={G}>Solana:</Hl> Cố gắng phá vỡ bộ ba bằng PoH + kiến trúc mới
          </B>
        </Card>
      </div>
    </div>
    <Footer />
  </div>
);

/* ─── PART II: BITCOIN ─── */

/* 8 — SECTION: BITCOIN */
const SecBitcoin: Page = () => (
  <div
    style={{
      ...fill,
      background: "linear-gradient(135deg, #0a0a14 0%, #1a1208 50%, #0a0a14 100%)",
      color: "var(--osd-text)",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      textAlign: "center",
      padding: "0 140px",
    }}
  >
    <Anim />
    <div style={a(0)}>
      <Eye c="#f7931a">PHẦN II</Eye>
    </div>
    <H s={110} st={{ margin: "36px 0 0", color: "#f7931a", ...a(0.15) }}>
      Bitcoin
    </H>
    <p
      style={{
        fontSize: 30,
        color: muted,
        marginTop: 24,
        maxWidth: 700,
        lineHeight: 1.5,
        ...a(0.3),
      }}
    >
      Blockchain đầu tiên — tiền kỹ thuật số mà không cần ngân hàng
    </p>
    <Footer />
  </div>
);

/* 9 — BITCOIN: THIẾT KẾ & UTXO */
const PgBitcoinDesign: Page = () => (
  <div
    style={{
      ...fill,
      background: "var(--osd-bg)",
      color: "var(--osd-text)",
      padding: "80px 120px",
      display: "flex",
      flexDirection: "column",
    }}
  >
    <Anim />
    <div style={a(0)}>
      <Eye c="#f7931a">BITCOIN</Eye>
    </div>
    <H s={52} st={{ margin: "14px 0 24px", ...a(0.1) }}>
      Triết lý thiết kế & Mô hình UTXO
    </H>
    <div style={{ display: "flex", gap: 24, flex: 1 }}>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 14 }}>
        <Card t="Triết lý: Bảo mật {'>'} Tốc độ" tc="#f7931a" d={0.15}>
          <B>
            <Hl>Thời gian khối 10 phút:</Hl> Cân bằng giữa phân tách mạng và tốc độ xác nhận.
          </B>
          <B>
            <Hl>Ngôn ngữ hạn chế:</Hl> Không vòng lặp, không phép toán phức tạp → ít lỗi, ít tấn
            công.
          </B>
          <B>
            <Hl>Kích thước ~1MB:</Hl> Giữ cho nhiều người chạy nút đầy đủ → phi tập trung.
          </B>
        </Card>
        <Card t="Mô hình UTXO" tc="#f7931a" d={0.22}>
          <B>
            Không theo dõi số dư. Theo dõi từng "đồng tiền" riêng lẻ (Unspent Transaction Output).
          </B>
          <B>Giống tiền mặt: có 3 tờ 20$. Muốn mua 35$ → đưa 2 tờ, nhận 5$ tiền thừa.</B>
          <div
            style={{
              background: `${P}0a`,
              borderRadius: 10,
              padding: "12px 16px",
              fontSize: 18,
              fontFamily: "monospace",
              color: "#aaa",
              lineHeight: 1.6,
              marginTop: 4,
            }}
          >
            Alice có: UTXO#1=0.5 + UTXO#2=0.3 + UTXO#3=0.8
            <br />
            Gửi 1.0 cho Eve → tiêu UTXO#1+#3, tạo 2 UTXO mới
          </div>
        </Card>
      </div>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 14 }}>
        <Card t="Ưu điểm UTXO" tc="#f7931a" d={0.18}>
          <B>
            <Hl>Parallel:</Hl> Giao dịch dùng UTXO khác nhau → xác minh đồng thời.
          </B>
          <B>
            <Hl>Privacy:</Hl> Mỗi UTXO liên kết địa chỉ khác nhau → khó theo dõi tổng tài sản.
          </B>
          <B>
            <Hl>Đơn giản:</Hl> Giao dịch hoặc thành công hoàn toàn hoặc thất bại hoàn toàn.
          </B>
        </Card>
        <Card t="Đào & Phần thưởng" tc="#f7931a" d={0.25}>
          <B>
            Phần thưởng: 50 → 25 → 12.5 → 6.25 → 3.125 BTC/khối. Giảm một nửa mỗi 210,000 khối (~4
            năm).
          </B>
          <B>Tổng cung tối đa: 21 triệu BTC. Khoảng năm 2140 hết比特币 mới.</B>
          <B>Phí giao dịch sẽ thay thế phần thưởng khi phần thưởng về 0.</B>
        </Card>
      </div>
    </div>
    <Footer />
  </div>
);

/* 10 — BITCOIN: LIMITS */
const PgBitcoinLimits: Page = () => (
  <div
    style={{
      ...fill,
      background: "var(--osd-bg)",
      color: "var(--osd-text)",
      padding: "80px 120px",
      display: "flex",
      flexDirection: "column",
    }}
  >
    <Anim />
    <div style={a(0)}>
      <Eye c="#f7931a">BITCOIN</Eye>
    </div>
    <H s={52} st={{ margin: "14px 0 24px", ...a(0.1) }}>
      Điều Bitcoin làm được & không làm được
    </H>
    <div style={{ display: "flex", gap: 24, flex: 1 }}>
      <Card t="Làm tốt" tc="#4caf50" d={0.15} st={{ flex: 1 }}>
        <B>
          <Hl c="#4caf50">Kho lưu trữ giá trị:</Hl> Nguồn cung cố định 21M · Chưa từng bị hack ·
          Hoạt động từ 2009
        </B>
        <B>
          <Hl c="#4caf50">Kháng kiểm duyệt:</Hl> Không ai chặn giao dịch · Tắt Bitcoin = tắt
          internet toàn cầu
        </B>
        <B>
          <Hl c="#4caf50">Đơn giản:</Hl> Ít tính năng = ít lỗi · Đã được kiểm tra 15+ năm
        </B>
      </Card>
      <Card t="Hạn chế" tc="#ff5252" d={0.22} st={{ flex: 1 }}>
        <B>
          <Hl c="#ff5252">7 TPS:</Hl> Visa 65,000. Không thực tế cho giao dịch hàng ngày.
        </B>
        <B>
          <Hl c="#ff5252">Không smart contract:</Hl> Ngôn ngữ hạn chế, không thể chạy ứng dụng phức
          tạp.
        </B>
        <B>
          <Hl c="#ff5252">Xác nhận chậm:</Hl> 10 phút/khối, thường cần 6 khối (60 phút) để an toàn.
        </B>
        <B>
          <Hl c="#ff5252">Năng lượng cao:</Hl> PoW tiêu thụ điện hơn nhiều quốc gia.
        </B>
      </Card>
    </div>
    <Footer />
  </div>
);

/* ─── PART III: ETHEREUM ─── */

/* 11 — SECTION: ETHEREUM */
const SecEthereum: Page = () => (
  <div
    style={{
      ...fill,
      background: "linear-gradient(135deg, #0a0a14 0%, #0d0d2a 50%, #0a0a14 100%)",
      color: "var(--osd-text)",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      textAlign: "center",
      padding: "0 140px",
    }}
  >
    <Anim />
    <div style={a(0)}>
      <Eye c="#627eea">PHẦN III</Eye>
    </div>
    <H s={110} st={{ margin: "36px 0 0", color: "#627eea", ...a(0.15) }}>
      Ethereum
    </H>
    <p
      style={{
        fontSize: 30,
        color: muted,
        marginTop: 24,
        maxWidth: 700,
        lineHeight: 1.5,
        ...a(0.3),
      }}
    >
      Tiền có thể lập trình — hợp đồng thông minh & máy tính toàn cầu
    </p>
    <Footer />
  </div>
);

/* 12 — ETHEREUM: SMART CONTRACTS */
const PgEthSmartContract: Page = () => (
  <div
    style={{
      ...fill,
      background: "var(--osd-bg)",
      color: "var(--osd-text)",
      padding: "80px 120px",
      display: "flex",
      flexDirection: "column",
    }}
  >
    <Anim />
    <div style={a(0)}>
      <Eye c="#627eea">ETHEREUM</Eye>
    </div>
    <H s={52} st={{ margin: "14px 0 24px", ...a(0.1) }}>
      Hợp đồng thông minh & EVM
    </H>
    <div style={{ display: "flex", gap: 24, flex: 1 }}>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 14 }}>
        <Card t="Hợp đồng thông minh" tc="#627eea" d={0.15}>
          <B>Chương trình tự thực thi trên blockchain. Không cần trung gian, không thể sửa đổi.</B>
          <B>Khi đủ điều kiện → tự chạy. Không ai có thể dừng nó, kể cả người tạo.</B>
        </Card>
        <Card t="EVM — Máy ảo Ethereum" tc="#627eea" d={0.22}>
          <B>Mỗi nút chạy EVM → kết quả đồng nhất toàn mạng.</B>
          <B>Stack-based · 256-bit · Thực thi tuần tự · Trạng thái toàn cục.</B>
          <B>Opcode: ADD, MUL, SSTORE, SLOAD, CALL, RETURN...</B>
        </Card>
      </div>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 14 }}>
        <Card t="Money Legos" tc="#627eea" d={0.18}>
          <B>Hợp đồng gọi hợp đồng khác → composability. A → B → C → D, tất cả nguyên tử.</B>
          <B>Mở khóa: DeFi · NFT · DAO · Stablecoin · Thị trường dự đoán · Và nhiều hơn nữa.</B>
        </Card>
        <Card t="Gas — Phí bảo vệ" tc="#627eea" d={0.25}>
          <B>Mỗi opcode tốn gas. Phí = gas_used × gas_price.</B>
          <B>Ngăn lạm dụng: vòng lặp vô hạn = hết gas = giao dịch thất bại.</B>
          <B>
            <Hl c="#ff5252">Vấn đề:</Hl> Phí gas có thể lên $50-200 trong thời gian mạng bận.
          </B>
        </Card>
      </div>
    </div>
    <Footer />
  </div>
);

/* 13 — SOLIDITY & ETH DEV */
const PgEthDev: Page = () => (
  <div
    style={{
      ...fill,
      background: "var(--osd-bg)",
      color: "var(--osd-text)",
      padding: "80px 120px",
      display: "flex",
      flexDirection: "column",
    }}
  >
    <Anim />
    <div style={a(0)}>
      <Eye c="#627eea">ETHEREUM DEV</Eye>
    </div>
    <H s={52} st={{ margin: "14px 0 24px", ...a(0.1) }}>
      Solidity & Hệ sinh thái Dev Ethereum
    </H>
    <div style={{ display: "flex", gap: 24, flex: 1 }}>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 14 }}>
        <Card t="Solidity — Ngôn ngữ chính" tc="#627eea" d={0.15}>
          <B>Syntax giống JavaScript/C++. Biên dịch → bytecode chạy trên EVM.</B>
          <B>
            <Hl>Contract:</Hl> state variables + functions + events + modifiers.
          </B>
          <B>
            <Hl>Types:</Hl> uint256, address, mapping, struct, enum, array.
          </B>
          <B>
            <Hl>Modifier:</Hl> require(), assert(), revert() — kiểm soát truy cập & lỗi.
          </B>
        </Card>
        <Card t="Tooling" tc="#627eea" d={0.22}>
          <B>
            <Hl>Hardhat:</Hl> Compile, test, deploy, debug. Plugin ecosystem rộng.
          </B>
          <B>
            <Hl>Foundry:</Hl> Forge (test) + Cast (interact) + Anvil (node). Viết bằng Rust, nhanh.
          </B>
          <B>
            <Hl>OpenZeppelin:</Hl> Library tiêu chuẩn: ERC-20, ERC-721, AccessControl, upgradeable.
          </B>
        </Card>
      </div>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 14 }}>
        <Card t="Standard: ERC & EIP" tc="#627eea" d={0.18}>
          <B>
            <Hl>ERC-20:</Hl> Fungible token (USDC, DAI, LINK).
          </B>
          <B>
            <Hl>ERC-721:</Hl> Non-fungible token (CryptoPunks, BAYC).
          </B>
          <B>
            <Hl>ERC-1155:</Hl> Multi-token — fungible + non-fungible trong 1 contract.
          </B>
          <B>
            <Hl>EIP-1559:</Hl> Fee burning · EIP-4844: Proto-danksharding.
          </B>
        </Card>
        <Card t="Hạn chế" tc="#ff5252" d={0.25}>
          <B>
            <Hl c="#ff5252">15 TPS:</Hl> Thực thi tuần tự trên EVM.
          </B>
          <B>
            <Hl c="#ff5252">Phí cao:</Hl> DeFi swap $10-50. NFT mint $20-200.
          </B>
          <B>
            <Hl c="#ff5252">Trạng thái toàn cục:</Hl> Hợp đồng A sửa data → hợp đồng B phải chờ.
          </B>
          <B>
            <Hl c="#ff5252">Bytecode:</Hl> EVM không chạy mã máy gốc → overhead thông dịch.
          </B>
        </Card>
      </div>
    </div>
    <Footer />
  </div>
);

/* ─── PART IV: MỞ RỘNG ─── */

/* 14 — SECTION: MỞ RỘNG */
const SecScalability: Page = () => (
  <div
    style={{
      ...fill,
      background: "linear-gradient(135deg, #0a0a14 0%, #1a0a0a 50%, #0a0a14 100%)",
      color: "var(--osd-text)",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      textAlign: "center",
      padding: "0 140px",
    }}
  >
    <Anim />
    <div style={a(0)}>
      <Eye c="#ff5252">PHẦN IV</Eye>
    </div>
    <H s={110} st={{ margin: "36px 0 0", color: "#ff5252", ...a(0.15) }}>
      Bài toán Mở rộng
    </H>
    <p
      style={{
        fontSize: 30,
        color: muted,
        marginTop: 24,
        maxWidth: 700,
        lineHeight: 1.5,
        ...a(0.3),
      }}
    >
      Tại sao blockchain truyền thống không thể phục vụ hàng tỷ người?
    </p>
    <Footer />
  </div>
);

/* 15 — SEQUENCER & SHARDING */
const PgScalability: Page = () => (
  <div
    style={{
      ...fill,
      background: "var(--osd-bg)",
      color: "var(--osd-text)",
      padding: "80px 120px",
      display: "flex",
      flexDirection: "column",
    }}
  >
    <Anim />
    <div style={a(0)}>
      <Eye c="#ff5252">VẤN ĐỀ</Eye>
    </div>
    <H s={52} st={{ margin: "14px 0 24px", ...a(0.1) }}>
      Thực thi tuần tự & Giải pháp
    </H>
    <div
      style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 20, marginBottom: 24 }}
    >
      {[
        ["7", "Bitcoin", "10 phút · PoW", "#f7931a"],
        ["15", "Ethereum", "12 giây · PoS", "#627eea"],
        ["65,000", "Visa", "Tập trung", "#ff5252"],
      ].map(([v, l, s, c], i) => (
        <div
          key={l}
          style={{
            background: `${c}0a`,
            border: `1px solid ${c}30`,
            borderRadius: 14,
            padding: "20px",
            textAlign: "center",
            ...a(0.15 + i * 0.06),
          }}
        >
          <div style={{ fontSize: 48, fontWeight: 900, color: c }}>{v}</div>
          <div style={{ fontSize: 21, color: "#bbb", marginTop: 2 }}>TPS — {l}</div>
          <div style={{ fontSize: 17, color: muted, marginTop: 2 }}>{s}</div>
        </div>
      ))}
    </div>
    <div style={{ display: "flex", gap: 24 }}>
      <Card t="Tại sao tuần tự?" tc="#ff5252" d={0.3} st={{ flex: 1 }}>
        <B>
          EVM xử lý 1 giao dịch/lần. Không biết trước cái nào xung đột → giả định tất cả xung đột.
        </B>
        <B>Trạng thái chia sẻ toàn cục → bộ xử lý nhanh hơn vẫn bị bottleneck.</B>
      </Card>
      <Card t="Giải pháp Layer 2" tc="#ff9800" d={0.35} st={{ flex: 1 }}>
        <B>
          <Hl>Rollup:</Hl> Thu thập giao dịch off-chain, batch, submit proof/on-chain data.
        </B>
        <B>
          <Hl>Optimistic:</Hl> Arbitrum, Optimism — giả định đúng, có challenge period.
        </B>
        <B>
          <Hl>ZK:</Hl> zkSync, StarkNet — proof toán học, finality tức thì.
        </B>
      </Card>
    </div>
    <Footer />
  </div>
);

/* ─── PART V: SOLANA ─── */

/* 16 — SECTION: SOLANA */
const SecSolana: Page = () => (
  <div
    style={{
      ...fill,
      background: "linear-gradient(135deg, #0a0a14 0%, #1a0a2e 40%, #0a1a1a 70%, #0a0a14 100%)",
      color: "var(--osd-text)",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      textAlign: "center",
      padding: "0 140px",
    }}
  >
    <Anim />
    <div style={a(0)}>
      <Eye>PHẦN V</Eye>
    </div>
    <h1
      style={{
        fontFamily: "var(--osd-font-display)",
        fontSize: 130,
        fontWeight: 900,
        margin: "36px 0 0",
        lineHeight: 1.1,
        background: `linear-gradient(90deg,${P},${G})`,
        backgroundSize: "200% auto",
        animation: "gf 4s ease infinite, su 0.5s 0.15s ease-out both",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
      }}
    >
      Solana
    </h1>
    <p
      style={{
        fontSize: 30,
        color: muted,
        marginTop: 24,
        maxWidth: 700,
        lineHeight: 1.5,
        ...a(0.3),
      }}
    >
      Kiến trúc hiệu suất cao — Proof of History, song parallel, 5,000+ TPS
    </p>
    <Footer />
  </div>
);

/* 17 — PROOF OF HISTORY */
const PgPoH: Page = () => (
  <div
    style={{
      ...fill,
      background: "var(--osd-bg)",
      color: "var(--osd-text)",
      padding: "80px 120px",
      display: "flex",
      flexDirection: "column",
    }}
  >
    <Anim />
    <div style={a(0)}>
      <Eye>SOLANA</Eye>
    </div>
    <H s={52} st={{ margin: "14px 0 24px", ...a(0.1) }}>
      Proof of History — Đồng hồ Mật mã
    </H>
    <div style={{ display: "flex", gap: 24, flex: 1 }}>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 14 }}>
        <Card t="Vấn đề thứ tự" tc={G} d={0.15}>
          <B>
            Blockchain cần đồng ý về thứ tự giao dịch trên hàng nghìn nút — không có đồng hồ chung.
          </B>
          <B>
            Ethereum: thu thập → sắp xếp → đồng thuận → thực thi. Đồng thuận TRƯỚC thực thi =
            bottleneck.
          </B>
        </Card>
        <Card t="PoH hoạt động thế nào?" tc={G} d={0.22}>
          <B>Hàm băm liên tục: output trước → input sau. 160,000 hash/giây.</B>
          <B>Giao dịch được băm vào chuỗi → vị trí = proof of time bằng mật mã.</B>
          <div
            style={{
              background: `${G}0a`,
              borderRadius: 10,
              padding: "12px 16px",
              fontSize: 18,
              fontFamily: "monospace",
              color: G,
              lineHeight: 1.6,
              marginTop: 4,
            }}
          >
            hash(output_42) → output_43
            <br />
            hash(output_43 + tx_A) → output_44
            <br />
            <span style={{ color: muted }}>→ tx_A ở vị trí 44, đến trước tx_B ở 46</span>
          </div>
        </Card>
      </div>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 14 }}>
        <Card t="Song parallel tự nhiên" tc={G} d={0.18}>
          <B>Biết trước thứ tự + biết giao dịch nào xung đột → chạy không xung đột đồng thời.</B>
          <B>
            <Hl c="#ff5252">Tuần tự (ETH):</Hl> A → B → C → D. Tổng = tổng thời gian.
          </B>
          <B>
            <Hl c={G}>Song song (Solana):</Hl> A & B chạy cùng lúc. C chờ A. D chạy ngay.
          </B>
        </Card>
        <Card t="Khai báo tài khoản" tc={G} d={0.25}>
          <B>Mỗi giao dịch khai báo trước: đọc account nào, ghi account nào, gọi program nào.</B>
          <B>Runtime xây đồ thị phụ thuộc → lập lịch tự động trên nhiều lõi CPU.</B>
        </Card>
        <div
          style={{
            background: `linear-gradient(135deg,${P}12,${G}12)`,
            border: `1px solid ${P}33`,
            borderRadius: 14,
            padding: "18px 22px",
            ...a(0.35),
          }}
        >
          <div style={{ display: "flex", gap: 32 }}>
            {[
              ["5,000+", "TPS thực tế"],
              ["400ms", "Khối"],
              ["<1s", "Finality"],
            ].map(([v, l]) => (
              <div key={l} style={{ textAlign: "center" }}>
                <div style={{ fontSize: 36, fontWeight: 900, color: G }}>{v}</div>
                <div style={{ fontSize: 17, color: "#bbb" }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
    <Footer />
  </div>
);

/* 18 — ACCOUNTS */
const PgAccounts: Page = () => (
  <div
    style={{
      ...fill,
      background: "var(--osd-bg)",
      color: "var(--osd-text)",
      padding: "80px 120px",
      display: "flex",
      flexDirection: "column",
    }}
  >
    <Anim />
    <div style={a(0)}>
      <Eye>KIẾN TRÚC</Eye>
    </div>
    <H s={52} st={{ margin: "14px 0 24px", ...a(0.1) }}>
      Mọi thứ là một Tài khoản
    </H>
    <div style={{ display: "flex", gap: 24, flex: 1 }}>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 14 }}>
        <Card t="Mô hình tài khoản" tc={P} d={0.15}>
          <B>Ví = tài khoản · Chương trình = tài khoản · Token = tài khoản · NFT = tài khoản.</B>
          <B>
            Mỗi tài khoản: <Hl>data</Hl> (tối đa 10MB) + <Hl>lamports</Hl> + <Hl>owner</Hl> +{" "}
            <Hl>executable</Hl>
          </B>
        </Card>
        <Card t="SVM vs EVM" tc={P} d={0.22}>
          <B>
            <Hl c="#627eea">EVM:</Hl> Stack-based · tuần tự · trạng thái toàn cục
          </B>
          <B>
            <Hl c={G}>SVM:</Hl> Register-based · song parallel · trạng thái theo tài khoản
          </B>
          <B>Biên dịch BPF → mã máy gốc → loại bỏ overhead thông dịch</B>
        </Card>
      </div>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 14 }}>
        <Card t="Program phi trạng thái" tc={P} d={0.18}>
          <B>
            <Hl c="#627eea">ETH:</Hl> Hợp đồng chứa mã + dữ liệu trong cùng tài khoản.
          </B>
          <B>
            <Hl c={G}>SOL:</Hl> Program chỉ chứa mã. Dữ liệu ở tài khoản riêng.
          </B>
          <B>Hai giao dịch gọi cùng program, dữ liệu khác → chạy song song được.</B>
        </Card>
        <Card t="Phí giao dịch" tc={G} d={0.25}>
          <B>Phí cơ bản: 5,000 lamports/chữ ký (~$0.00025).</B>
          <B>
            Rẻ hơn hàng nghìn lần so với Ethereum. Giao dịch nguyên tử: hoặc tất cả thành công hoặc
            hoàn tác.
          </B>
        </Card>
      </div>
    </div>
    <Footer />
  </div>
);

/* 19 — PROGRAMS, PDAs, CPI */
const PgPrograms: Page = () => (
  <div
    style={{
      ...fill,
      background: "var(--osd-bg)",
      color: "var(--osd-text)",
      padding: "80px 120px",
      display: "flex",
      flexDirection: "column",
    }}
  >
    <Anim />
    <div style={a(0)}>
      <Eye>CHƯƠNG TRÌNH</Eye>
    </div>
    <H s={52} st={{ margin: "14px 0 24px", ...a(0.1) }}>
      Programs, PDAs & CPI
    </H>
    <div style={{ display: "flex", gap: 24, flex: 1 }}>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 14 }}>
        <Card t="Program: Bộ xử lý phi trạng thái" tc={P} d={0.15}>
          <B>Nhận accounts + instruction_data → xác thực → sửa đổi data → trả kết quả.</B>
          <B>Không có khóa riêng — là mã, không phải người dùng. PDAs giải quyết ủy quyền.</B>
        </Card>
        <Card t="PDA — Program Derived Address" tc={P} d={0.22}>
          <B>Địa chỉ deterministic từ seeds + program ID. Không có khóa riêng.</B>
          <B>Chỉ program tạo ra mới ký được → an toàn cho kho tiền, trạng thái, token account.</B>
        </Card>
      </div>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 14 }}>
        <Card t="CPI — Cross-Program Invocation" tc={P} d={0.18}>
          <B>Program gọi program khác trong cùng 1 giao dịch. Lồng tối đa 4 cấp.</B>
          <B>
            <Hl>invoke_signed:</Hl> Ký thay cho PDA. Runtime xác minh seeds.
          </B>
          <B>Tất cả nguyên tử: hoặc thành công cùng nhau, hoặc hoàn tác cùng nhau.</B>
        </Card>
        <Card t="Giao dịch Solana" tc={G} d={0.25}>
          <B>
            Kích thước tối đa: 1,232 byte. Instructions + account_keys + signatures + blockhash.
          </B>
          <B>Mỗi instruction: program_id + accounts (signer/writable) + data.</B>
        </Card>
      </div>
    </div>
    <Footer />
  </div>
);

/* 20 — SPL TOKENS */
const PgTokens: Page = () => (
  <div
    style={{
      ...fill,
      background: "var(--osd-bg)",
      color: "var(--osd-text)",
      padding: "80px 120px",
      display: "flex",
      flexDirection: "column",
    }}
  >
    <Anim />
    <div style={a(0)}>
      <Eye>SPL TOKENS</Eye>
    </div>
    <H s={52} st={{ margin: "14px 0 24px", ...a(0.1) }}>
      Token Standard & Token Extensions
    </H>
    <div style={{ display: "flex", gap: 24, flex: 1 }}>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 14 }}>
        <Card t="SPL Token là gì?" tc={G} d={0.15}>
          <B>SPL (Solana Program Library) — tiêu chuẩn token, tương tự ERC-20/ERC-721.</B>
          <B>Mỗi token là tài khoản riêng do Chương trình Token sở hữu.</B>
        </Card>
        <Card t="Associated Token Account" tc={G} d={0.22}>
          <B>ATA: deterministic — ví address + mint address → 1 địa chỉ duy nhất.</B>
          <B>Ví tự tìm USDC của bạn. Chương trình biết nơi gửi token.</B>
        </Card>
      </div>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 14 }}>
        <Card t="Token Extensions (Token-2022)" tc={G} d={0.18}>
          <B>
            <Hl>Transfer Fees:</Hl> Tự động thu phí khi chuyển
          </B>
          <B>
            <Hl>Confidential:</Hl> ẩn số tiền giao dịch
          </B>
          <B>
            <Hl>Non-Transferable:</Hl> token không chuyển được (danh tính, bằng cấp)
          </B>
          <B>
            <Hl>Permanent Delegate:</Hl> delegate vĩnh viễn
          </B>
        </Card>
        <Card t="Tại sao SPL?" tc={G} d={0.25}>
          <B>
            Phí thấp → thanh toán vi mô. Tốc độ → trải nghiệm tức thì. Song parallel → hàng nghìn
            giao dịch đồng thời.
          </B>
        </Card>
      </div>
    </div>
    <Footer />
  </div>
);

/* ─── PART VI: HỆ SINH THÁI DEV ─── */

/* 21 — SECTION: DEV ECOSYSTEM */
const SecDevEco: Page = () => (
  <div
    style={{
      ...fill,
      background: "linear-gradient(135deg, #0a0a14 0%, #0a1a2e 40%, #1a0a2e 70%, #0a0a14 100%)",
      color: "var(--osd-text)",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      textAlign: "center",
      padding: "0 140px",
    }}
  >
    <Anim />
    <div style={a(0)}>
      <Eye>PHẦN VI</Eye>
    </div>
    <H s={100} st={{ margin: "36px 0 0", ...a(0.15) }}>
      Hệ sinh thái Dev
    </H>
    <p
      style={{
        fontSize: 30,
        color: muted,
        marginTop: 24,
        maxWidth: 800,
        lineHeight: 1.5,
        ...a(0.3),
      }}
    >
      Bitcoin có gì? Ethereum có Solidity? Solana có Rust!
    </p>
    <Footer />
  </div>
);

/* 22 — NGÔN NGỮ LẬP TRÌNH */
const PgLangCompare: Page = () => (
  <div
    style={{
      ...fill,
      background: "var(--osd-bg)",
      color: "var(--osd-text)",
      padding: "80px 100px",
      display: "flex",
      flexDirection: "column",
    }}
  >
    <Anim />
    <div style={a(0)}>
      <Eye>NGÔN NGỮ</Eye>
    </div>
    <H s={48} st={{ margin: "14px 0 20px", ...a(0.1) }}>
      So sánh ngôn ngữ lập trình Blockchain
    </H>
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "140px repeat(3,1fr)",
        gap: 0,
        flex: 1,
        ...a(0.15),
      }}
    >
      <div />
      <div
        style={{
          textAlign: "center",
          padding: "10px",
          fontSize: 20,
          fontWeight: 700,
          color: "#f7931a",
        }}
      >
        Bitcoin
      </div>
      <div
        style={{
          textAlign: "center",
          padding: "10px",
          fontSize: 20,
          fontWeight: 700,
          color: "#627eea",
        }}
      >
        Ethereum
      </div>
      <div
        style={{ textAlign: "center", padding: "10px", fontSize: 20, fontWeight: 700, color: G }}
      >
        Solana
      </div>
      {[
        ["Ngôn ngữ", "Script (Bitcoin)", "-", "Rust + BPF"],
        ["Kiểu", "Stack-based", "Object-oriented", "Systems-level"],
        ["Độ phức tạp", "Rất thấp", "Trung bình", "Cao"],
        ["Smart contract", "Không có", "Solidity / Vyper", "Rust programs"],
        ["Compile to", "Opcode", "EVM bytecode", "SBF (BPF)"],
        ["Runtime", "Bitcoin Core", "EVM (mọi nút)", "SVM (Sealevel)"],
        ["Composability", "Không", "ERC standards", "CPI + PDAs"],
        ["Learning curve", "Dễ", "Trung bình", "Khó hơn"],
      ].map(([l, b, e, s]) => (
        <React.Fragment key={l}>
          <div
            style={{
              padding: "8px 8px",
              fontSize: 18,
              fontWeight: 600,
              color: "#ddd",
              borderBottom: `1px solid ${border}`,
            }}
          >
            {l}
          </div>
          <div
            style={{
              padding: "8px 8px",
              fontSize: 18,
              color: "#bbb",
              textAlign: "center",
              borderBottom: `1px solid ${border}`,
            }}
          >
            {b}
          </div>
          <div
            style={{
              padding: "8px 8px",
              fontSize: 18,
              color: "#bbb",
              textAlign: "center",
              borderBottom: `1px solid ${border}`,
            }}
          >
            {e}
          </div>
          <div
            style={{
              padding: "8px 8px",
              fontSize: 18,
              color: G,
              textAlign: "center",
              borderBottom: `1px solid ${border}`,
              fontWeight: 600,
            }}
          >
            {s}
          </div>
        </React.Fragment>
      ))}
    </div>
    <Footer />
  </div>
);

/* 23 — BITCOIN SCRIPT */
const PgBitcoinScript: Page = () => (
  <div
    style={{
      ...fill,
      background: "var(--osd-bg)",
      color: "var(--osd-text)",
      padding: "80px 120px",
      display: "flex",
      flexDirection: "column",
    }}
  >
    <Anim />
    <div style={a(0)}>
      <Eye c="#f7931a">BITCOIN</Eye>
    </div>
    <H s={52} st={{ margin: "14px 0 24px", ...a(0.1) }}>
      Bitcoin Script — Ngôn ngữ hạn chế
    </H>
    <div style={{ display: "flex", gap: 24, flex: 1 }}>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 14 }}>
        <Card t="Script là gì?" tc="#f7931a" d={0.15}>
          <B>Ngôn ngữ stack-based,反向波兰, không có vòng lặp.</B>
          <B>Được thiết kế để xác minh giao dịch, không phải để chạy ứng dụng.</B>
        </Card>
        <Card t="Opcode cơ bản" tc="#f7931a" d={0.22}>
          <B>
            <Hl>OP_DUP:</Hl> Sao chép phần tử trên stack
          </B>
          <B>
            <Hl>OP_HASH160:</Hl> Băm SHA-256 rồi RIPEMD-160
          </B>
          <B>
            <Hl>OP_CHECKSIG:</Hl> Xác minh chữ ký
          </B>
          <B>
            <Hl>OP_IF / OP_ELSE:</Hl> Điều kiện đơn giản (không có loop)
          </B>
        </Card>
      </div>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 14 }}>
        <Card t="Ví đa chữ ký" tc="#f7931a" d={0.18}>
          <B>2-of-3 multisig: cần 2 trong 3 khóa riêng để chi tiêu.</B>
          <B>Timelock: giao dịch chỉ hợp lệ sau thời điểm nhất định.</B>
          <B>Đây là "smart contract" đơn giản nhất của Bitcoin.</B>
        </Card>
        <Card t="Tại sao hạn chế?" tc="#f7931a" d={0.25}>
          <B>
            <Hl>Bảo mật:</Hl> Ít opcode = ít vectors tấn công.
          </B>
          <B>
            <Hl>Deterministic:</Hl> Kết quả luôn giống nhau, không có side effect.
          </B>
          <B>
            <Hl>Formal verification:</Hl> Dễ chứng minh program đúng.
          </B>
          <B>
            <Hl>Hạn chế:</Hl> Không thể build DEX, lending, NFT trên lớp cơ sở.
          </B>
        </Card>
      </div>
    </div>
    <Footer />
  </div>
);

/* 24 — SOLIDITY DEEP DIVE */
const PgSolidity: Page = () => (
  <div
    style={{
      ...fill,
      background: "var(--osd-bg)",
      color: "var(--osd-text)",
      padding: "80px 120px",
      display: "flex",
      flexDirection: "column",
    }}
  >
    <Anim />
    <div style={a(0)}>
      <Eye c="#627eea">ETHEREUM</Eye>
    </div>
    <H s={52} st={{ margin: "14px 0 24px", ...a(0.1) }}>
      Solidity — Ngôn ngữ hợp đồng thông minh
    </H>
    <div style={{ display: "flex", gap: 24, flex: 1 }}>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 14 }}>
        <Card t="Cú pháp" tc="#627eea" d={0.15}>
          <div
            style={{
              background: "#0d1117",
              borderRadius: 10,
              padding: "12px 16px",
              fontSize: 17,
              fontFamily: "monospace",
              color: "#aaa",
              lineHeight: 1.6,
            }}
          >
            <span style={{ color: "#c678dd" }}>pragma</span> solidity ^0.8.20;
            <br />
            <span style={{ color: "#c678dd" }}>contract</span>{" "}
            <span style={{ color: "#e5c07b" }}>Token</span> {"{"}
            <br />
            &nbsp;&nbsp;<span style={{ color: "#c678dd" }}>mapping</span>(address {"=>"} uint){" "}
            <span style={{ color: "#e06c75" }}>balances</span>;<br />
            &nbsp;&nbsp;<span style={{ color: "#c678dd" }}>function</span>{" "}
            <span style={{ color: "#61afef" }}>transfer</span>(address to, uint amt) {"{"}
            <br />
            &nbsp;&nbsp;&nbsp;&nbsp;<span style={{ color: "#c678dd" }}>require</span>
            (balances[msg.sender] {">="} amt);
            <br />
            &nbsp;&nbsp;&nbsp;&nbsp;balances[msg.sender] -= amt;
            <br />
            &nbsp;&nbsp;&nbsp;&nbsp;balances[to] += amt;
            <br />
            &nbsp;&nbsp;{"}"}
            <br />
            {"}"}
          </div>
        </Card>
        <Card t="Types chính" tc="#627eea" d={0.22}>
          <B>
            <Hl>uint256:</Hl> Số nguyên không dấu 256-bit
          </B>
          <B>
            <Hl>address:</Hl> Địa chỉ 20-byte
          </B>
          <B>
            <Hl>mapping(K→V):</Hl> Bảng băm hash
          </B>
          <B>
            <Hl>struct:</Hl> Nhóm dữ liệu tùy chỉnh
          </B>
        </Card>
      </div>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 14 }}>
        <Card t="Pattern phổ biến" tc="#627eea" d={0.18}>
          <B>
            <Hl>Access control:</Hl> modifier onlyOwner · Role-based
          </B>
          <B>
            <Hl>Reentrancy guard:</Hl> nonReentrant modifier chống tấn công reentrancy
          </B>
          <B>
            <Hl>Upgradeable:</Hl> Proxy pattern · UUPS · Transparent
          </B>
          <B>
            <Hl>Factory:</Hl> Tạo contract mới on-chain
          </B>
        </Card>
        <Card t="Hạn chế của EVM" tc="#ff5252" d={0.25}>
          <B>
            <Hl c="#ff5252">Gas:</Hl> Mỗi opcode tốn gas. Loop vô hạn = hết gas.
          </B>
          <B>
            <Hl c="#ff5252">256-bit:</Hl> int256, uint256. Không có float, không có string indexing.
          </B>
          <B>
            <Hl c="#ff5252">No native float:</Hl> Phải dùng fixed-point (18 decimals).
          </B>
          <B>
            <Hl c="#ff5252">Bytecode:</Hl> Phải thông dịch → chậm hơn mã máy gốc.
          </B>
        </Card>
      </div>
    </div>
    <Footer />
  </div>
);

/* 25 — RUST ON SOLANA */
const PgRustSolana: Page = () => (
  <div
    style={{
      ...fill,
      background: "var(--osd-bg)",
      color: "var(--osd-text)",
      padding: "80px 120px",
      display: "flex",
      flexDirection: "column",
    }}
  >
    <Anim />
    <div style={a(0)}>
      <Eye>SOLANA DEV</Eye>
    </div>
    <H s={52} st={{ margin: "14px 0 24px", ...a(0.1) }}>
      Rust trên Solana
    </H>
    <div style={{ display: "flex", gap: 24, flex: 1 }}>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 14 }}>
        <Card t="Tại sao Rust?" tc={G} d={0.15}>
          <B>
            <Hl>Máy gốc:</Hl> Biên dịch Rust → BPF bytecode → chạy trên SVM. Không thông dịch.
          </B>
          <B>
            <Hl>An toàn bộ nhớ:</Hl> Ownership + Borrow checker → không null pointer, không buffer
            overflow.
          </B>
          <B>
            <Hl>Hiệu suất:</Hl> gần C/C++ nhưng an toàn hơn. Phù hợp cho blockchain.
          </B>
        </Card>
        <Card t="Anchor Framework" tc={G} d={0.22}>
          <B>Framework cao cấp cho Solana programs. Giống Hardhat/Foundry cho Ethereum.</B>
          <B>
            <Hl>#[account]:</Hl> Deserialize account data tự động.
          </B>
          <B>
            <Hl>#[instruction]:</Hl> Parse instruction data.
          </B>
          <B>
            <Hl>Constraints:</Hl> Kiểm tra signer, owner, seed, bump trong attribute macro.
          </B>
        </Card>
      </div>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 14 }}>
        <Card t="Ví dụ Anchor" tc={G} d={0.18}>
          <div
            style={{
              background: "#0d1117",
              borderRadius: 10,
              padding: "12px 16px",
              fontSize: 17,
              fontFamily: "monospace",
              color: "#aaa",
              lineHeight: 1.6,
            }}
          >
            <span style={{ color: "#c678dd" }}>#[program]</span>
            <br />
            <span style={{ color: "#c678dd" }}>pub mod</span>{" "}
            <span style={{ color: "#e5c07b" }}>my_app</span> {"{"}
            <br />
            &nbsp;&nbsp;<span style={{ color: "#c678dd" }}>pub fn</span>{" "}
            <span style={{ color: "#61afef" }}>initialize</span>(<br />
            &nbsp;&nbsp;&nbsp;&nbsp;ctx: Context{"<"}Initialize{">"}
            <br />
            &nbsp;&nbsp;<span style={{ color: "#c678dd" }}>{"->"}</span>{" "}
            <span style={{ color: "#c678dd" }}>Result</span>
            {"<"}(){">"} {"{"}
            <br />
            &nbsp;&nbsp;&nbsp;&nbsp;msg!("Hello {}", ctx.accounts.user.key());
            <br />
            &nbsp;&nbsp;&nbsp;&nbsp;<span style={{ color: "#c678dd" }}>Ok</span>(())
            <br />
            &nbsp;&nbsp;{"}"}
            <br />
            {"}"}
          </div>
        </Card>
        <Card t="Tooling Solana" tc={G} d={0.25}>
          <B>
            <Hl>solana-test-validator:</Hl> Local testnet, chạy tức thì
          </B>
          <B>
            <Hl>solana CLI:</Hl> Deploy, interact, inspect
          </B>
          <B>
            <Hl>Anchor:</Hl> Build, test, deploy, IDL generation
          </B>
          <B>
            <Hl>Solana Playground:</Hl> IDE browser-based, deploy 1 click
          </B>
        </Card>
      </div>
    </div>
    <Footer />
  </div>
);

/* 26 — TOOLING COMPARISON */
const PgTooling: Page = () => (
  <div
    style={{
      ...fill,
      background: "var(--osd/bg)",
      color: "var(--osd-text)",
      padding: "80px 100px",
      display: "flex",
      flexDirection: "column",
    }}
  >
    <Anim />
    <div style={a(0)}>
      <Eye>TOOLING</Eye>
    </div>
    <H s={48} st={{ margin: "14px 0 20px", ...a(0.1) }}>
      So sánh Developer Tooling
    </H>
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "160px repeat(2,1fr)",
        gap: 0,
        flex: 1,
        ...a(0.15),
      }}
    >
      <div />
      <div
        style={{
          textAlign: "center",
          padding: "10px",
          fontSize: 20,
          fontWeight: 700,
          color: "#627eea",
        }}
      >
        Ethereum
      </div>
      <div
        style={{ textAlign: "center", padding: "10px", fontSize: 20, fontWeight: 700, color: G }}
      >
        Solana
      </div>
      {[
        ["Framework", "Hardhat, Foundry", "Anchor"],
        ["Test runner", "Forge, Hardhat test", "anchor test"],
        ["Local node", "Anvil, Hardhat node", "solana-test-validator"],
        ["Deploy", "hardhat deploy", "anchor deploy"],
        ["IDE", "Remix, VS Code", "Solana Playground"],
        ["Package mgr", "npm (OpenZeppelin)", "Cargo (crates.io)"],
        ["Explorer", "Etherscan", "Solscan, Solana FM"],
        ["RPC providers", "Infura, Alchemy", "Helius, QuickNode"],
        ["Indexer", "The Graph, Moralis", "Helius DAS, Golden"],
        ["Wallet", "MetaMask", "Phantom, Solflare"],
      ].map(([l, e, s]) => (
        <React.Fragment key={l}>
          <div
            style={{
              padding: "7px 8px",
              fontSize: 18,
              fontWeight: 600,
              color: "#ddd",
              borderBottom: `1px solid ${border}`,
            }}
          >
            {l}
          </div>
          <div
            style={{
              padding: "7px 8px",
              fontSize: 18,
              color: "#bbb",
              textAlign: "center",
              borderBottom: `1px solid ${border}`,
            }}
          >
            {e}
          </div>
          <div
            style={{
              padding: "7px 8px",
              fontSize: 18,
              color: G,
              textAlign: "center",
              borderBottom: `1px solid ${border}`,
              fontWeight: 600,
            }}
          >
            {s}
          </div>
        </React.Fragment>
      ))}
    </div>
    <Footer />
  </div>
);

/* ─── PART VII: THỰC TẾ & SO SÁNH ─── */

/* 27 — SECTION: THỰC TẾ */
const SecUseCases: Page = () => (
  <div
    style={{
      ...fill,
      background: "linear-gradient(135deg, #0a0a14 0%, #0a1a2e 50%, #0a0a14 100%)",
      color: "var(--osd-text)",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      textAlign: "center",
      padding: "0 140px",
    }}
  >
    <Anim />
    <div style={a(0)}>
      <Eye>PHẦN VII</Eye>
    </div>
    <H s={100} st={{ margin: "36px 0 0", ...a(0.15) }}>
      Ứng dụng Thực tế
    </H>
    <p
      style={{
        fontSize: 30,
        color: muted,
        marginTop: 24,
        maxWidth: 700,
        lineHeight: 1.5,
        ...a(0.3),
      }}
    >
      DeFi, NFT, Gaming, Payments — Solana dùng để làm gì?
    </p>
    <Footer />
  </div>
);

/* 28 — USE CASES */
const PgUseCases: Page = () => (
  <div
    style={{
      ...fill,
      background: "var(--osd/bg)",
      color: "var(--osd-text)",
      padding: "80px 120px",
      display: "flex",
      flexDirection: "column",
    }}
  >
    <Anim />
    <div style={a(0)}>
      <Eye>THỰC TẾ</Eye>
    </div>
    <H s={52} st={{ margin: "14px 0 24px", ...a(0.1) }}>
      Solana dùng để làm gì?
    </H>
    <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 20, flex: 1 }}>
      {[
        ["⚡", "DeFi", "Raydium, Jupiter — swap, yield, lending. Phí $0.00025/lệnh.", 0.15],
        ["🖼", "NFT", "Mad Lads, Tensor — đúc hàng loạt, marketplace. Tiền bản quyền.", 0.22],
        ["🌐", "DePIN", "Helium, Render — mạng phi tập trung. IoT, GPU computing.", 0.29],
        ["💳", "Payments", "Solana Pay, USDC — thanh toán toàn cầu, <1 giây.", 0.36],
        ["🎮", "Gaming", "On-chain games. Object model cho asset ownership.", 0.43],
        ["🏛", "DAO", "Quản trị on-chain, danh tính, bằng cấp không chuyển được.", 0.5],
      ].map(([ic, ti, de, dl]) => (
        <Card key={ti} t={`${ic} ${ti}`} tc={G} d={dl as number}>
          <B>{de}</B>
        </Card>
      ))}
    </div>
    <Footer />
  </div>
);

/* 29 — ECOSYSTEM STATS */
const PgEcoStats: Page = () => (
  <div
    style={{
      ...fill,
      background: "var(--osd/bg)",
      color: "var(--osd-text)",
      padding: "80px 120px",
      display: "flex",
      flexDirection: "column",
    }}
  >
    <Anim />
    <div style={a(0)}>
      <Eye>SỐ LIỆU</Eye>
    </div>
    <H s={52} st={{ margin: "14px 0 24px", ...a(0.1) }}>
      Hệ sinh thái Solana
    </H>
    <div
      style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 20, marginBottom: 24 }}
    >
      {[
        ["5,000+", "TPS thực tế"],
        ["400ms", "Thời gian khối"],
        ["<1s", "Finality"],
        ["$0.00025", "Phí giao dịch"],
      ].map(([v, l], i) => (
        <div
          key={l}
          style={{
            background: `${G}0a`,
            border: `1px solid ${G}30`,
            borderRadius: 14,
            padding: "24px",
            textAlign: "center",
            ...a(0.15 + i * 0.06),
          }}
        >
          <div style={{ fontSize: 40, fontWeight: 900, color: G }}>{v}</div>
          <div style={{ fontSize: 20, color: "#bbb", marginTop: 4 }}>{l}</div>
        </div>
      ))}
    </div>
    <div style={{ display: "flex", gap: 24 }}>
      <Card t="Ecosystem highlights" tc={P} d={0.3} st={{ flex: 1 }}>
        <B>
          <Hl>Jupiter:</Hl> DEX aggregator lớn nhất — tổng hợp thanh khoản từ mọi nguồn
        </B>
        <B>
          <Hl>Raydium:</Hl> AMM + order book. liquidity pools & farming
        </B>
        <B>
          <Hl>Marinade:</Hl> Liquid staking — stake SOL nhưng vẫn dùng được
        </B>
        <B>
          <Hl>Pyth:</Hl> Oracle network — giá real-time cho DeFi
        </B>
      </Card>
      <Card t="Dev Community" tc={P} d={0.35} st={{ flex: 1 }}>
        <B>
          <Hl>Solana Foundation:</Hl> Grants, hackathon, education
        </B>
        <B>
          <Hl>Solana Accelerator:</Hl> Hỗ trợ startup builds on Solana
        </B>
        <B>
          <Hl>Colosseum:</Hl> Rust bootcamp + fellowship cho developer mới
        </B>
        <B>
          <Hl>Solana Breakpoint:</Hl> Hội nghị developer hàng năm
        </B>
      </Card>
    </div>
    <Footer />
  </div>
);

/* 30 — SO SÁNH TOÀN DIỆN */
const PgComparison: Page = () => (
  <div
    style={{
      ...fill,
      background: "var(--osd/bg)",
      color: "var(--osd-text)",
      padding: "80px 100px",
      display: "flex",
      flexDirection: "column",
    }}
  >
    <Anim />
    <div style={a(0)}>
      <Eye>SO SÁNH</Eye>
    </div>
    <H s={48} st={{ margin: "14px 0 20px", ...a(0.1) }}>
      So sánh toàn diện
    </H>
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "160px repeat(3,1fr)",
        gap: 0,
        flex: 1,
        ...a(0.15),
      }}
    >
      <div />
      <div
        style={{
          textAlign: "center",
          padding: "10px",
          fontSize: 20,
          fontWeight: 700,
          color: "#f7931a",
        }}
      >
        Bitcoin
      </div>
      <div
        style={{
          textAlign: "center",
          padding: "10px",
          fontSize: 20,
          fontWeight: 700,
          color: "#627eea",
        }}
      >
        Ethereum
      </div>
      <div
        style={{ textAlign: "center", padding: "10px", fontSize: 20, fontWeight: 700, color: G }}
      >
        Solana
      </div>
      {[
        ["TPS", "7", "15", "5,000+"],
        ["Khối", "10 phút", "12 giây", "400ms"],
        ["Finality", "60 phút", "~13 phút", "<1 giây"],
        ["Phí", "$1-50", "$2-200", "~$0.00025"],
        ["Consensus", "PoW", "PoS", "PoH + Tower BFT"],
        ["Thực thi", "Tuần tự", "Tuần tự", "Song parallel"],
        ["Ngôn ngữ", "Script", "Solidity", "Rust (BPF)"],
        ["Smart contract", "Không", "Có (EVM)", "Có (SVM)"],
        ["Token standard", "N/A", "ERC-20/721", "SPL Token"],
        ["Mô hình", "UTXO", "Account", "Account"],
      ].map(([l, b, e, s]) => (
        <React.Fragment key={l}>
          <div
            style={{
              padding: "7px 8px",
              fontSize: 18,
              fontWeight: 600,
              color: "#ddd",
              borderBottom: `1px solid ${border}`,
            }}
          >
            {l}
          </div>
          <div
            style={{
              padding: "7px 8px",
              fontSize: 18,
              color: "#bbb",
              textAlign: "center",
              borderBottom: `1px solid ${border}`,
            }}
          >
            {b}
          </div>
          <div
            style={{
              padding: "7px 8px",
              fontSize: 18,
              color: "#bbb",
              textAlign: "center",
              borderBottom: `1px solid ${border}`,
            }}
          >
            {e}
          </div>
          <div
            style={{
              padding: "7px 8px",
              fontSize: 18,
              color: G,
              textAlign: "center",
              borderBottom: `1px solid ${border}`,
              fontWeight: 600,
            }}
          >
            {s}
          </div>
        </React.Fragment>
      ))}
    </div>
    <div
      style={{
        marginTop: 12,
        background: card,
        border: `1px solid ${border}`,
        borderRadius: 14,
        padding: "14px 22px",
        fontSize: 20,
        color: "#bbb",
        lineHeight: 1.5,
        ...a(0.3),
      }}
    >
      <Hl>Solana</Hl> xử lý nhiều giao dịch hơn ba blockchain khác cộng lại — phí gần bằng 0, xác
      nhận dưới 1 giây.
    </div>
    <Footer />
  </div>
);

/* 31 — PHÍ GIAO DỊCH */
const PgFees: Page = () => (
  <div
    style={{
      ...fill,
      background: "var(--osd/bg)",
      color: "var(--osd-text)",
      padding: "80px 120px",
      display: "flex",
      flexDirection: "column",
    }}
  >
    <Anim />
    <div style={a(0)}>
      <Eye>PHÍ</Eye>
    </div>
    <H s={52} st={{ margin: "14px 0 24px", ...a(0.1) }}>
      Phí giao dịch — Tại sao Solana rẻ?
    </H>
    <div style={{ display: "flex", gap: 24, flex: 1 }}>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 14 }}>
        <Card t="Phí = Base fee + Priority fee" tc={G} d={0.15}>
          <B>
            <Hl>Base fee:</Hl> 5,000 lamports/chữ ký (~$0.00025). Cố định cho mọi giao dịch.
          </B>
          <B>
            <Hl>Priority fee:</Hl> Tùy chọn. Thêm lamports → giao dịch được xử lý nhanh hơn.
          </B>
          <B>
            <Hl>Burn:</Hl> 50% base fee bị đốt → giảm phát token SOL.
          </B>
        </Card>
        <Card t="So sánh chi phí" tc={G} d={0.22}>
          <B>Bitcoin: $1-50/giao dịch · phụ thuộc vào congestion</B>
          <B>Ethereum: $2-200/giao dịch · DeFi swap $10-50 · NFT mint $20-200</B>
          <B>
            <Hl c={G}>Solana:</Hl> $0.00025/giao dịch · bất kể phức tạp hay đơn giản
          </B>
        </Card>
      </div>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 14 }}>
        <Card t="Tại sao rẻ?" tc={G} d={0.18}>
          <B>
            <Hl>Song parallel:</Hl> Nhiều giao dịch chạy đồng thời → hạ chi phí mỗi giao dịch.
          </B>
          <B>
            <Hl>Mã máy gốc:</Hl> BPF bytecode → không overhead thông dịch.
          </B>
          <B>
            <Hl>Hardware efficient:</Hl> Server tiêu chuẩn, không cần GPU mining.
          </B>
        </Card>
        <Card t="Impact" tc={G} d={0.25}>
          <B>
            <Hl>Thanh toán vi mô:</Hl> Gửi $0.01 vẫn khả thi (trên ETH phí cao hơn số tiền gửi).
          </B>
          <B>
            <Hl>High-frequency:</Hl> Limit orders, DCA, auto-compound → chi phí nhỏ.
          </B>
          <B>
            <Hl>Mass adoption:</Hl> Phí phải chăng → barrier to entry thấp.
          </B>
        </Card>
      </div>
    </div>
    <Footer />
  </div>
);

/* 32 — CLOSING */
const Closing: Page = () => (
  <div
    style={{
      ...fill,
      background: "linear-gradient(160deg, #0a0a14 0%, #1a0a2e 40%, #0d0d1a 100%)",
      color: "var(--osd-text)",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      textAlign: "center",
      padding: "0 140px",
    }}
  >
    <Anim />
    <div style={a(0)}>
      <Eye>TÓM TẮT</Eye>
    </div>
    <H s={84} st={{ margin: "28px 0", ...a(0.1) }}>
      Solana — Hiệu suất cao
    </H>
    <div
      style={{
        display: "flex",
        gap: 20,
        marginBottom: 36,
        flexWrap: "wrap",
        justifyContent: "center",
        ...a(0.2),
      }}
    >
      {[
        ["⏱", "Proof of History", "Đồng hồ mật mã sắp xếp trước"],
        ["⚡", "Song song", "Nhiều giao dịch đồng thời"],
        ["💰", "$0.00025", "Phí gần bằng 0"],
        ["🔗", "Tài khoản", "Kiến trúc cho parallel"],
        ["🦀", "Rust", "Hệ sinh thái dev mạnh"],
        ["📦", "SPL", "Token standard linh hoạt"],
      ].map(([ic, ti, de], i) => (
        <div
          key={ti}
          style={{
            background: card,
            border: `1px solid ${P}33`,
            borderRadius: 14,
            padding: "18px 24px",
            minWidth: 180,
            maxWidth: 220,
            ...a(0.25 + i * 0.07),
          }}
        >
          <div style={{ fontSize: 32, marginBottom: 6 }}>{ic}</div>
          <div style={{ fontSize: 22, fontWeight: 700, color: G, marginBottom: 4 }}>{ti}</div>
          <div style={{ fontSize: 18, color: "#bbb" }}>{de}</div>
        </div>
      ))}
    </div>
    <p style={{ fontSize: 28, color: muted, maxWidth: 800, lineHeight: 1.5, ...a(0.5) }}>
      Solana không chỉ nhanh hơn — nó là cách tiếp cận mới:{" "}
      <span style={{ color: G }}>sắp xếp trước, thực thi song parallel</span>.
    </p>
    <Footer />
  </div>
);

/* ═══════════════════════════════ EXPORT ═══════════════════════════════ */

export const meta: SlideMeta = {
  title: "Tìm hiểu về Solana",
  createdAt: "2026-06-25T03:27:24.666Z",
};

export default [
  /* Part I: Nền tảng */
  Cover,
  Agenda,
  SecFoundation,
  PgDoubleSpend,
  PgHashing,
  PgSignatures,
  PgConsensus,
  /* Part II: Bitcoin */
  SecBitcoin,
  PgBitcoinDesign,
  PgBitcoinLimits,
  /* Part III: Ethereum */
  SecEthereum,
  PgEthSmartContract,
  PgEthDev,
  /* Part IV: Mở rộng */
  SecScalability,
  PgScalability,
  /* Part V: Solana */
  SecSolana,
  PgPoH,
  PgAccounts,
  PgPrograms,
  PgTokens,
  /* Part VI: Dev Ecosystem */
  SecDevEco,
  PgLangCompare,
  PgBitcoinScript,
  PgSolidity,
  PgRustSolana,
  PgTooling,
  /* Part VII: Thực tế */
  SecUseCases,
  PgUseCases,
  PgEcoStats,
  PgComparison,
  PgFees,
  Closing,
] satisfies Page[];
