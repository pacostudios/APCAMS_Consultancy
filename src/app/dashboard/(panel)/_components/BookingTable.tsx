import Link from "next/link";
import { Video, MapPin } from "lucide-react";
import { formatAUD, formatDate, formatTime } from "@/lib/format";
import type { BookingRow } from "../_lib/queries";
import { PaymentBadge, StatusBadge, Table, tdClass } from "./ui";

export default function BookingTable({ rows, showPayment = true }: { rows: BookingRow[]; showPayment?: boolean }) {
  return (
    <Table head={["When", "Client", "Service", "Status", ...(showPayment ? ["Payment", "Amount"] : []), ""]}>
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
            <Link href={`/dashboard/clients/${b.clientId}`} className="font-medium text-slate-900 hover:text-[#2B6F6F] hover:underline">
              {b.clientName}
            </Link>
            <div className="text-xs text-slate-500">{b.clientPhone ?? b.clientEmail}</div>
          </td>
          <td className={tdClass}>{b.serviceName}</td>
          <td className={tdClass}><StatusBadge status={b.status} /></td>
          {showPayment && (
            <>
              <td className={tdClass}><PaymentBadge status={b.paymentStatus} /></td>
              <td className={`${tdClass} tabular-nums`}>{formatAUD(b.priceCents)}</td>
            </>
          )}
          <td className={`${tdClass} text-right`}>
            <Link href={`/dashboard/bookings/${b.id}`} className="text-sm font-medium text-[#2B6F6F] hover:underline">
              View
            </Link>
          </td>
        </tr>
      ))}
    </Table>
  );
}
