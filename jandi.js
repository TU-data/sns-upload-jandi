async function sendToJandi(message) {
  const { default: fetch } = await import("node-fetch");

  const payload = {
    body: message,
  };

  const response = await fetch(process.env.JANDI_WEBHOOK_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/vnd.tosslab.jandi-v2+json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`잔디 Webhook 전송 실패: ${response.status} ${response.statusText}`);
  }

  return response;
}

module.exports = { sendToJandi };
