export async function sendTelegramNotification(message: string) {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!botToken || !chatId) {
    console.warn(
      "TELEGRAM_BOT_TOKEN atau TELEGRAM_CHAT_ID belum diatur. Notifikasi dilewati.",
    );
    return false;
  }

  try {
    const response = await fetch(
      `https://api.telegram.org/bot${botToken}/sendMessage`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chat_id: chatId,
          text: message,
          parse_mode: "Markdown",
        }),
      },
    );

    if (!response.ok) {
      console.error("Gagal mengirim Telegram", await response.text());
      return false;
    }

    const data = await response.json();
    if (!data.ok) {
      console.error("Telegram Error:", data);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Gagal mengirim notifikasi Telegram:", error);
    return false;
  }
}

export async function sendTelegramPhoto(photoUrl: string, caption: string) {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!botToken || !chatId) {
    console.warn("TELEGRAM_BOT_TOKEN atau TELEGRAM_CHAT_ID belum diatur.");
    return false;
  }

  try {
    const response = await fetch(
      `https://api.telegram.org/bot${botToken}/sendPhoto`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chat_id: chatId,
          photo: photoUrl,
          caption: caption,
          parse_mode: "Markdown",
        }),
      },
    );

    if (!response.ok) {
      console.error("Gagal mengirim foto Telegram", await response.text());
      return false;
    }

    const data = await response.json();
    if (!data.ok) {
      console.error("Telegram Error:", data);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Gagal mengirim foto Telegram:", error);
    return false;
  }
}
