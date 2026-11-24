/**
 * ============================================================
 * QUERY CARD — Premium query display with accent strip
 * ============================================================
 */

"use client";

import { Clock } from "lucide-react";
import StatusBadge from "@/components/ui/StatusBadge";
import Button from "@/components/ui/Button";
import {
  getPriorityClasses,
  getQueryStatusClasses,
  formatQueryStatus,
} from "@/utils/helpers";

export default function QueryCard({ query, onUpdateStatus }) {
  return (
    <article className="
      bg-surface rounded-xl border border-border overflow-hidden
      shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-card-hover)]
      transition-all duration-300 ease-out
      group
    ">
      <div className="flex">
        {/* Left accent strip */}
        <div className={`w-1 flex-shrink-0 ${
          query.status === "OPEN" ? "bg-blue-500" :
          query.status === "IN_PROGRESS" ? "bg-amber-500" :
          "bg-slate-300"
        }`} />

        <div className="flex-1 p-5">
          {/* Top row: title + badges */}
          <div className="flex justify-between items-start gap-3">
            <div className="flex gap-3 min-w-0">
              <div className="w-9 h-9 rounded-lg bg-accent-light flex items-center justify-center flex-shrink-0 mt-0.5">
                <Clock className="w-4 h-4 text-accent" />
              </div>
              <div className="min-w-0">
                <h3 className="font-semibold text-text-primary truncate">{query.title}</h3>
                <p className="text-sm text-text-secondary mt-0.5">
                  {query.employee || "Unknown Employee"} •{" "}
                  {query.asset || "Unknown Asset"}
                </p>
              </div>
            </div>

            <div className="flex gap-2 flex-shrink-0">
              <StatusBadge
                text={query.priority}
                className={getPriorityClasses(query.priority)}
              />
              <StatusBadge
                text={formatQueryStatus(query.status)}
                className={getQueryStatusClasses(query.status)}
              />
            </div>
          </div>

          {/* Description */}
          <p className="text-sm text-text-secondary mt-3 line-clamp-2">{query.description}</p>

          {/* Footer */}
          <div className="flex justify-between items-center mt-4 pt-3 border-t border-border-light">
            <span className="text-xs text-text-muted">Created: {query.date}</span>

            <div className="flex gap-2">
              {query.status === "OPEN" && (
                <Button
                  variant="secondary"
                  onClick={() => onUpdateStatus(query.id, "In Progress")}
                  className="text-xs px-3 py-1.5"
                >
                  Start Progress
                </Button>
              )}
              {query.status === "IN_PROGRESS" && (
                <Button
                  variant="secondary"
                  onClick={() => onUpdateStatus(query.id, "Closed")}
                  className="text-xs px-3 py-1.5"
                >
                  Mark Resolved
                </Button>
              )}
              {query.status !== "CLOSED" && (
                <Button
                  variant="ghost"
                  onClick={() => onUpdateStatus(query.id, "Closed")}
                  className="text-xs px-3 py-1.5"
                >
                  Close
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
