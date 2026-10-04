// ─────────────────────────────────────────────────────────────
// (선택) 새 주문, 새 문의가 들어오면 관리자 이메일로 알림을 보냅니다.
// Gmail 앱 비밀번호를 사용합니다. 비밀번호는 코드나 저장소에 넣지 않고
// `firebase functions:secrets:set GMAIL_APP_PASSWORD` 로 서버 비밀 저장소에만 둡니다.
// 설정 방법은 README의 11단계를 보세요.
// ─────────────────────────────────────────────────────────────
const { onDocumentCreated } = require("firebase-functions/v2/firestore");
const { defineSecret, defineString } = require("firebase-functions/params");
const nodemailer = require("nodemailer");

const GMAIL_USER = defineString("GMAIL_USER");               // 보내는 Gmail 주소
const NOTIFY_TO = defineString("NOTIFY_TO");                 // 알림 받을 주소 (같아도 됨)
const GMAIL_APP_PASSWORD = defineSecret("GMAIL_APP_PASSWORD"); // Gmail 앱 비밀번호 16자리

const REGION = "asia-northeast3"; // 서울. Firestore 데이터베이스 위치와 같게 맞춰 주세요.
const won = n => (Number(n) || 0).toLocaleString("ko-KR") + "원";
const line = (label, v) => (v ? `${label}: ${String(v).slice(0, 2000)}\n` : "");

async function send(subject, text) {
  const t = nodemailer.createTransport({
    service: "gmail",
    auth: { user: GMAIL_USER.value(), pass: GMAIL_APP_PASSWORD.value() }
  });
  // 고객이 입력한 내용은 HTML이 아닌 일반 텍스트로만 보냅니다.
  await t.sendMail({ from: GMAIL_USER.value(), to: NOTIFY_TO.value(), subject, text });
}

exports.notifyOrder = onDocumentCreated(
  { document: "orders/{orderId}", region: REGION, secrets: [GMAIL_APP_PASSWORD] },
  async event => {
    const o = event.data && event.data.data(); if (!o) return;
    const items = (o.items || []).map(i => `- ${i.name} × ${i.qty} (${won(i.price)})`).join("\n");
    const b = o.buyer || {};
    await send(
      `[새 주문] ${event.params.orderId} ${won(o.total)}`,
      `새 주문이 들어왔어요.\n\n주문번호: ${event.params.orderId}\n결제 금액: ${won(o.total)} (무통장 입금 대기)\n\n${items}\n\n` +
      line("주문자", b.name) + line("연락처", b.phone) + line("이메일", b.email) +
      line("주소", [b.zip, b.address, b.address2].filter(Boolean).join(" ")) + line("메모", b.memo) +
      "\n입금 확인 후 관리자 화면에서 상태를 '결제완료'로 바꿔 주세요."
    );
  }
);

exports.notifyInquiry = onDocumentCreated(
  { document: "inquiries/{id}", region: REGION, secrets: [GMAIL_APP_PASSWORD] },
  async event => {
    const q = event.data && event.data.data(); if (!q) return;
    const kind = q.kind === "business" ? "협업·비즈니스" : "공연·워크숍";
    await send(
      `[새 문의] ${kind} ${q.type || ""} ${q.name || ""}`.trim(),
      `새 문의가 들어왔어요. (${kind})\n\n` +
      line("종류", q.type) + line("희망 레퍼토리", q.rep) + line("기관, 회사", q.org) + line("이름", q.name) +
      line("연락처", q.phone) + line("이메일", q.email) + line("희망 일자", q.eventDate) + line("장소", q.place) +
      line("예상 인원", q.audience) + line("예산", q.budget) + line("참고 링크", q.link) + "\n" + line("내용", q.message)
    );
  }
);
