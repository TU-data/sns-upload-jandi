const https = require("https");

const token = process.env.NOTION_TOKEN || "";
const dbId = process.env.NOTION_DATABASE_ID || "";

console.log("=== 환경변수 진단 ===");
console.log(`NOTION_TOKEN 설정됨: ${token.length > 0}`);
console.log(`NOTION_TOKEN 길이: ${token.length}`);
console.log(`NOTION_TOKEN prefix: ${token.slice(0, 7)}`);
console.log(`NOTION_DATABASE_ID 설정됨: ${dbId.length > 0}`);
console.log(`NOTION_DATABASE_ID 길이: ${dbId.length}`);
console.log("");

if (token.length === 0) {
  console.error("NOTION_TOKEN이 비어 있습니다. GitHub Secret 등록을 확인하세요.");
  process.exit(1);
}

console.log("=== Notion API 직접 호출 테스트 ===");

const options = {
  hostname: "api.notion.com",
  path: "/v1/users/me",
  method: "GET",
  headers: {
    Authorization: `Bearer ${token}`,
    "Notion-Version": "2022-06-28",
  },
};

const req = https.request(options, (res) => {
  let body = "";
  res.on("data", (chunk) => (body += chunk));
  res.on("end", () => {
    console.log(`HTTP 상태코드: ${res.statusCode}`);
    try {
      const parsed = JSON.parse(body);
      console.log("응답 object:", parsed.object);
      if (parsed.object === "error") {
        console.error("에러 코드:", parsed.code);
        console.error("에러 메시지:", parsed.message);
      } else {
        console.log("인증 성공! bot id:", parsed.bot?.id || parsed.id);
      }
    } catch {
      console.log("응답 원문:", body);
    }
  });
});

req.on("error", (e) => console.error("요청 실패:", e));
req.end();
