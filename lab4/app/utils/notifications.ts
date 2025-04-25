import Constants from "expo-constants";

const ONE_SIGNAL_APP_ID = Constants?.expoConfig?.extra?.oneSignalAppId;
const ONE_SIGNAL_REST_API_KEY = Constants?.expoConfig?.extra?.oneSignalAPIKey;

export async function scheduleNotification(task: {
  title: string;
  desc?: string;
  reminderTime: Date;
}) {
  const url = "https://api.onesignal.com/notifications?c=push";
  const payload = {
    app_id: ONE_SIGNAL_APP_ID,
    contents: { en: task.desc || "No description provided" },
    headings: { en: task.title },
    send_after: task.reminderTime.toISOString(),
    included_segments: ["Active Subscriptions"],
  };

  const options = {
    method: "POST",
    headers: {
      accept: "application/json",
      Authorization: `Key ${ONE_SIGNAL_REST_API_KEY}`,
      "content-type": "application/json",
    },
    body: JSON.stringify(payload),
  };

  try {
    const res = await fetch(url, options);
    const json = await res.json();
    console.log("Notification response:", json);
    return json.id;
  } catch (error) {
    console.error("Error scheduling notification:", error);
    return null;
  }
}

export async function cancelNotification(notificationId: string) {
  const url = `https://api.onesignal.com/notifications/${notificationId}?app_id=${ONE_SIGNAL_APP_ID}`;
  const options = {
    method: "DELETE",
    headers: {
      accept: "application/json",
      Authorization: `Key ${ONE_SIGNAL_REST_API_KEY}`,
    },
  };

  try {
    const res = await fetch(url, options);
    const json = await res.json();
    console.log("Cancel notification response:", json);
  } catch (error) {
    console.error("Error canceling notification:", error);
  }
}