
"use client";

import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
  ExternalLink,
  ShieldCheck,
  ShieldAlert,
  Loader2,
  XCircle,
} from "lucide-react";

import {
  approveDealer,
  rejectDealer,
} from "@/app/(admin)/admin-dashboard/verification/action";

type VerificationRequest = {
  id: string;
  legalName: string;
  idUrl: string;
  cardUrl: string;
  status: "SUBMITTED" | "APPROVED" | "REJECTED"  | "UNDER_REVIEW";
};

export function VerificationTable({
  requests,
}: {
  requests: VerificationRequest[];
}) {
  const [loadingId, setLoadingId] =
    useState<string | null>(null);

  const router = useRouter();

  const handleApprove = async (
    requestId: string
  ) => {
    setLoadingId(requestId);

    try {
      await approveDealer(requestId);

      toast.success(
        "Dealer approved successfully."
      );

      router.refresh();
    } catch (error) {
      console.error(
        "[APPROVE_DEALER]",
        error
      );

      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to approve dealer."
      );
    } finally {
      setLoadingId(null);
    }
  };


  const handleReject = async (
    requestId: string
  ) => {
    const notes = window.prompt(
      "Enter a reason for rejecting this application:"
    );

    if (notes === null) {
      return;
    }

    if (!notes.trim()) {
      toast.error(
        "A rejection reason is required."
      );

      return;
    }

    setLoadingId(requestId);

    try {
      await rejectDealer(
        requestId,
        notes
      );

      toast.success(
        "Dealer application rejected."
      );

      router.refresh();
    } catch (error) {
      console.error(
        "[REJECT_DEALER]",
        error
      );

      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to reject dealer."
      );
    } finally {
      setLoadingId(null);
    }
  };

  function capitalizeName(name: string) {
    if (!name) return "";

    return name
      .trim()
      .toLowerCase()
      .split(/\s+/)
      .map(
        (word) =>
          word.charAt(0).toUpperCase() +
          word.slice(1)
      )
      .join(" ");
  }


  function renderStatus(
    status: VerificationRequest["status"]
  ) {
    switch (status) {
      case "APPROVED":
        return (
          <span className="flex items-center gap-1 font-bold text-emerald-500">
            <ShieldCheck size={16} />
            Approved
          </span>
        );

      case "REJECTED":
        return (
          <span className="flex items-center gap-1 font-bold text-red-500">
            <XCircle size={16} />
            Rejected
          </span>
        );

      case "SUBMITTED":
        return (
          <span className="flex items-center gap-1 font-bold text-amber-500">
            <ShieldAlert size={16} />
            Pending
          </span>
        );

      default:
        return null;
    }
  }


  return (
    <div className="overflow-hidden rounded-md border border-slate-800 bg-slate-950">
      <table className="w-full text-left text-sm">
        <thead className="bg-slate-900 text-xs uppercase text-slate-400">
          <tr>
            <th className="px-6 py-4">
              Legal Name
            </th>

            <th className="px-6 py-4">
              Documents
            </th>

            <th className="px-6 py-4">
              Status
            </th>

            <th className="px-6 py-4">
              Action
            </th>
          </tr>
        </thead>

        <tbody className="divide-y divide-slate-800">
          {requests.map((request) => {
            const isLoading =
              loadingId === request.id;

            const isPending =
              request.status === "SUBMITTED";

            return (
              <tr
                key={request.id}
                className="transition-colors hover:bg-slate-900/50"
              >
                {/* Legal Name */}
                <td className="px-6 py-4 font-medium text-white">
                  {capitalizeName(
                    request.legalName
                  )}
                </td>

                {/* Documents */}
                <td className="space-x-3 px-6 py-4">
                  <a
                    href={request.idUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-blue-400 hover:underline"
                  >
                    Gov ID
                    <ExternalLink size={14} />
                  </a>

                  <a
                    href={request.cardUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-blue-400 hover:underline"
                  >
                    Card
                    <ExternalLink size={14} />
                  </a>
                </td>

                {/* Status */}
                <td className="px-6 py-4">
                  {renderStatus(
                    request.status
                  )}
                </td>

                {/* Actions */}
                <td className="px-6 py-4">
                  {isPending ? (
                    <div className="flex gap-x-2">
                      {/* Approve */}
                      <button
                        type="button"
                        disabled={isLoading}
                        onClick={() =>
                          handleApprove(
                            request.id
                          )
                        }
                        className="inline-flex items-center gap-2 rounded-lg bg-emerald-500/10 px-4 py-2 text-xs font-bold text-emerald-500 transition-all hover:bg-emerald-500/20 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {isLoading ? (
                          <Loader2
                            size={14}
                            className="animate-spin"
                          />
                        ) : (
                          <ShieldCheck size={14} />
                        )}

                        Approve
                      </button>

                      {/* Reject */}
                      <button
                        type="button"
                        disabled={isLoading}
                        onClick={() =>
                          handleReject(
                            request.id
                          )
                        }
                        className="inline-flex items-center gap-2 rounded-lg bg-red-500/10 px-4 py-2 text-xs font-bold text-red-500 transition-all hover:bg-red-500/20 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {isLoading ? (
                          <Loader2
                            size={14}
                            className="animate-spin"
                          />
                        ) : (
                          <XCircle size={14} />
                        )}

                        Reject
                      </button>
                    </div>
                  ) : (
                    <span className="text-xs text-slate-500">
                      Processed
                    </span>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
