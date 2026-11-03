import Link from "next/link";
import { Video, MapPin } from "lucide-react";
import { formatAUD, formatDate, formatTime } from "@/lib/format";
import type { BookingRow } from "../_lib/queries";
import { JoinMeetingButton, PaymentBadge, StatusBadge, Table, tdClass } from "./ui";

/** `portal="staff"` links into the staff portal and hides admin-only columns (payment, staff, client profile). */
export default function BookingTable({ rows, showPayment = true, portal = "admin" }: {
  rows: BookingRow[];
  showPayment?: boolean;
  portal?: "admin" | "staff";
}) {
  const admin = portal === "admin";
  const payment = admin && showPayment;
  return (
    <Table head={["When", "Client", "Service", ...(admin ? ["Staff"] : []), "Status", ...(payment ? ["Payment", "Amount"] : []), ""]}>
      {rows.map((b) => (
        <tr key={b.id} className="hover:bg-slate-50">
          <td className={tdClass}>
            <div className="font-medium text-slate-900">{formatDate(b.startsAt)}</div>
            <div className="flex items-center gap-1 text-xs text-slate-500">
              {formatTime(b.startsAt)}
              {b.mode === "online" ? <Video size={12} aria-label="Online" /> : <MapPin size={12} aria-label="In person" />}
            </div>
          </td>
          <td className={tdClass}>
            {admin ? (
              <Link href={`/dashboard/clients/${b.clientId}`} className="font-medium text-slate-900 hover:text-[#2B6F6F] hover:underline">
                {b.clientName}
              </Link>
            ) : (
              <span className="font-medium text-slate-900">{b.clientName}</span>
            )}
            <div className="text-xs text-slate-500">{b.clientPhone ?? b.clientEmail}</div>
          </td>
          <td className={tdClass}>{b.serviceName}</td>
          {admin && (
            <td className={tdClass}>
              {b.staffId ? (
                <Link href={`/dashboard/staff/${b.staffId}`} className="hover:text-[#2B6F6F] hover:underline">{b.staffName}</Link>
              ) : (
                <span className="text-slate-400">Unassigned</span>
              )}
            </td>
          )}
          <td className={tdClass}><StatusBadge status={b.status} /></td>
          {payment && (
            <>
              <td className={tdClass}><PaymentBadge status={b.paymentStatus} /></td>
              <td className={`${tdClass} tabular-nums`}>{formatAUD(b.priceCents)}</td>
            </>
          )}
          <td className={`${tdClass} text-right`}>
            <div className="flex items-center justify-end gap-3">
              <JoinMeetingButton booking={b} size="sm" />
              <Link href={`${admin ? "/dashboard" : "/staff"}/bookings/${b.id}`} className="text-sm font-medium text-[#2B6F6F] hover:underline">
                View
              </Link>
            </div>
          </td>
        </tr>
      ))}
    </Table>
  );
}
