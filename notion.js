const { Client } = require("@notionhq/client");

const notion = new Client({ auth: process.env.NOTION_TOKEN });

function getKSTDateString() {
  const now = new Date();
  // UTC 기준으로 KST(+9) 날짜 계산
  const kst = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  return kst.toISOString().slice(0, 10); // "YYYY-MM-DD"
}

async function getTodaySchedule() {
  const today = getKSTDateString();

  const response = await notion.databases.query({
    database_id: process.env.NOTION_DATABASE_ID,
    filter: {
      property: "일시",
      date: {
        equals: today,
      },
    },
    sorts: [
      {
        property: "일시",
        direction: "ascending",
      },
    ],
  });

  return response.results.map((page) => {
    const props = page.properties;

    const title =
      props["이름"]?.title?.[0]?.plain_text ||
      props["제목"]?.title?.[0]?.plain_text ||
      Object.values(props).find((p) => p.type === "title")?.title?.[0]
        ?.plain_text ||
      "(제목 없음)";

    const status =
      props["상태"]?.status?.name ||
      props["상태"]?.select?.name ||
      "미설정";

    const team =
      props["담당 팀"]?.select?.name ||
      props["담당 팀"]?.multi_select?.map((s) => s.name).join(", ") ||
      "-";

    const snsAccount =
      props["SNS(메인계정)"]?.select?.name ||
      props["SNS(메인계정)"]?.multi_select?.map((s) => s.name).join(", ") ||
      "-";

    const collaborator =
      props["공동작업자계정"]?.select?.name ||
      props["공동작업자계정"]?.multi_select?.map((s) => s.name).join(", ") ||
      "-";

    const assignees =
      props["담당자"]?.people?.map((p) => p.name).join(", ") || "-";

    return {
      title,
      status,
      team,
      snsAccount,
      collaborator,
      assignees,
    };
  });
}

module.exports = { getTodaySchedule, getKSTDateString };
