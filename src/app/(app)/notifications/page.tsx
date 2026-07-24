import { Bell, TrendingUp } from "lucide-react";
import { getNotifications, markAllNotificationsRead } from "@/lib/notifications";

function formatDate(iso: string) {
  return new Date(iso).toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export default async function NotificationsPage() {
  const notifications = await getNotifications();
  if (notifications.some((n) => !n.read)) {
    await markAllNotificationsRead();
  }

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-semibold tracking-tight">Notifications</h1>
      <p className="mt-1 text-sm text-muted">Updates about your portfolio.</p>

      {notifications.length === 0 ? (
        <div className="panel mt-6 flex flex-col items-center gap-3 rounded-3xl p-10 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-accent to-accent-2">
            <Bell size={20} className="text-white" />
          </div>
          <p className="text-base font-semibold">No notifications yet</p>
          <p className="max-w-sm text-sm text-muted">
            We&apos;ll let you know here every time your total portfolio value climbs by $10 or
            more — add some holdings on the{" "}
            <span className="text-text">Portfolio</span> page to start getting updates.
          </p>
        </div>
      ) : (
        <div className="mt-6 flex flex-col gap-2">
          {notifications.map((n) => (
            <div key={n.id} className="panel flex items-start gap-3 rounded-2xl p-4">
              <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-positive/15 text-positive">
                <TrendingUp size={16} />
              </div>
              <div>
                <p className="text-sm">{n.message}</p>
                <p className="mt-1 text-xs text-muted">{formatDate(n.created_at)}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
