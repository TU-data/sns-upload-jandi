const { getTodaySchedule, getKSTDateString } = require("./notion");
const { sendToJandi } = require("./jandi");

function formatDate(dateStr) {
  const [year, month, day] = dateStr.split("-");
  return `${parseInt(month)}/${parseInt(day)}`;
}

function buildMessage(schedules, today) {
  const dateLabel = formatDate(today);

  if (schedules.length === 0) {
    return `📅 오늘(${dateLabel}) SNS 업로드 일정이 없습니다.`;
  }

  const lines = [`📅 오늘(${dateLabel}) SNS 업로드 일정 — 총 ${schedules.length}건\n`];

  schedules.forEach((item, i) => {
    lines.push(`${i + 1}. ${item.title}`);
    lines.push(`   📣 계정: ${item.snsAccount}`);
    if (item.collaborator && item.collaborator !== "-") {
      lines.push(`   🤝 공동계정: ${item.collaborator}`);
    }
    lines.push(`   👤 담당자: ${item.assignees}`);
    lines.push(`   🏷 팀: ${item.team}`);
    lines.push(`   ✅ 상태: ${item.status}`);
    if (i < schedules.length - 1) lines.push("");
  });

  return lines.join("\n");
}

async function main() {
  try {
    const today = getKSTDateString();
    console.log(`[${new Date().toISOString()}] 오늘 날짜(KST): ${today}`);

    const schedules = await getTodaySchedule();
    console.log(`조회된 일정 수: ${schedules.length}`);

    const message = buildMessage(schedules, today);
    console.log("전송 메시지:\n", message);

    await sendToJandi(message);
    console.log("잔디 전송 완료");
  } catch (err) {
    console.error("오류 발생:", err);
    process.exit(1);
  }
}

main();
