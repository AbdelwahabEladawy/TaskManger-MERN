import React from 'react'
import moment from 'moment';
import { LuPaperclip } from 'react-icons/lu';
import Progress from '../Progress/Progress';

function TaskCard({
    title,
    description,
    priority,
    status,
    progress,
    createdAt,
    dueDate,
    assignedTo,
    attachmentCount = 0,
    completedTodoCount,
    todoChecklist,
    onClick,
}) {

    const normalizedPriority = priority ? priority.toLowerCase() : "low";
    const normalizedStatus = status ? status.toLowerCase() : "pending";
    const totalChecklist = Array.isArray(todoChecklist) ? todoChecklist.length : 0;
    const derivedCompletedCount =
        typeof completedTodoCount === "number"
            ? completedTodoCount
            : (todoChecklist?.filter((item) => typeof item === "object" && item.completed)?.length || 0);

    const derivedProgress =
        typeof progress === "number"
            ? progress
            : totalChecklist > 0
                ? Math.round((derivedCompletedCount / totalChecklist) * 100)
                : 0;

    const assignees = Array.isArray(assignedTo) ? assignedTo : [];
    const visibleAssignees = assignees.slice(0, 3);
    const remainingAssignees = assignees.length - visibleAssignees.length;

    const dueDateLabel = dueDate ? moment(dueDate).format("DD MMM, YYYY") : "No due date";
    const isOverdue = dueDate && moment(dueDate).isBefore(moment(), "day") && normalizedStatus !== "completed";

    const createdLabel = createdAt ? moment(createdAt).fromNow() : "";

    const formatPriorityLabel = () => {
        switch (normalizedPriority) {
            case "medium":
                return "Medium";
            case "high":
                return "High";
            default:
                return "Low";
        }
    };

    const formatStatusLabel = () => {
        switch (normalizedStatus) {
            case "in progress":
                return "In Progress";
            case "completed":
                return "Completed";
            default:
                return "Pending";
        }
    };

    const getPriorityTagColor = () => {
        switch (normalizedPriority) {
            case "low":
                return "text-emerald-500 bg-emerald-50 border border-emerald-500/10";
            case "medium":
                return "text-amber-500 bg-amber-50 border border-amber-500/10";
            default:
                return "text-rose-500 bg-rose-50 border border-rose-500/10";
        }
    };

    const getStatusTagColor = () => {
        switch (normalizedStatus) {
            case "in progress":
                return "text-cyan-500 bg-cyan-50 border border-cyan-500/10";
            case "completed":
                return "text-lime-500 bg-lime-50 border border-lime-500/20";
            default:
                return "text-violet-500 bg-violet-50 border border-violet-500/10";
        }
    };

    const renderAvatar = (user, index) => {
        const name = typeof user === "object" ? user.name : "";
        const profileImage = typeof user === "object" ? user.profileImage : "";
        const initials = name
            ? name
                .split(" ")
                .map((part) => part.charAt(0).toUpperCase())
                .slice(0, 2)
                .join("")
            : "NA";

        return profileImage ? (
            <img
                key={user?._id || index}
                src={profileImage}
                alt={name}
                className="w-9 h-9 rounded-full border-2 border-white object-cover shadow-sm"
            />
        ) : (
            <div
                key={user?._id || index}
                className="w-9 h-9 rounded-full border-2 border-white bg-slate-200 flex items-center justify-center text-[11px] font-bold text-slate-600"
            >
                {initials}
            </div>
        );
    };

    return (
        <div
            role="button"
            tabIndex={0}
            onClick={onClick}
            onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                    onClick?.();
                }
            }}
            className="h-full rounded-2xl border border-slate-100 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 cursor-pointer"
        >
            <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                    <p className="text-sm font-semibold text-slate-900 line-clamp-2">{title}</p>
                    <p className="mt-1 text-xs text-slate-500 line-clamp-3">
                        {description?.trim() || "No description provided"}
                    </p>
                </div>

                <div className="flex flex-col items-end gap-2 text-[11px] font-semibold">
                    <span className={`rounded-full px-3 py-1 capitalize ${getPriorityTagColor()}`}>
                        {formatPriorityLabel()}
                    </span>
                    <span className={`rounded-full px-3 py-1 capitalize ${getStatusTagColor()}`}>
                        {formatStatusLabel()}
                    </span>
                </div>
            </div>

            <div className="mt-4 flex items-center gap-3">
                <Progress progress={derivedProgress} status={status} />
                <span className="text-[11px] font-medium text-slate-500 whitespace-nowrap">
                    {derivedCompletedCount}/{totalChecklist || derivedCompletedCount} Checklist
                </span>
            </div>

            <div className="mt-4 flex items-center justify-between text-xs text-slate-500">
                <div className="flex items-center gap-1.5">
                    <LuPaperclip className="text-base text-slate-400" />
                    <span>{attachmentCount} Attachments</span>
                </div>

                <div className="text-right">
                    <p className={`font-semibold ${isOverdue ? "text-rose-500" : "text-slate-600"}`}>
                        {dueDateLabel}
                    </p>
                    <p className="text-[11px]">{createdLabel ? `Created ${createdLabel}` : ""}</p>
                </div>
            </div>

            <div className="mt-4 flex items-center justify-between">
                <div className="flex -space-x-2">
                    {visibleAssignees.length > 0 ? (
                        visibleAssignees.map((user, index) => renderAvatar(user, index))
                    ) : (
                        <div className="rounded-full bg-slate-100 px-3 py-1 text-[11px] font-semibold text-slate-500">
                            Unassigned
                        </div>
                    )}

                    {remainingAssignees > 0 && (
                        <div className="w-9 h-9 rounded-full border-2 border-white bg-slate-900 text-white text-[11px] font-semibold flex items-center justify-center">
                            +{remainingAssignees}
                        </div>
                    )}
                </div>

                <span className="text-xs font-semibold text-primary">View Details</span>
            </div>
        </div>
    )
}

export default TaskCard