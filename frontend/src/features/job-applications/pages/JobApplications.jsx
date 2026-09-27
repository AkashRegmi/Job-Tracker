import { useState } from "react";
import { Link } from "react-router-dom";
import {
  BriefcaseBusiness,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CircleAlert,
  Clock3,
  Pencil,
  Plus,
  Search,
  Trash2,
  X,
} from "lucide-react";
import toast from "react-hot-toast";
import Button from "../../../components/ui/Button";
import { getError } from "../../../utils/errorHandler";
import {
  useCreateJobApplication,
  useDeleteJobApplication,
  useJobApplicationDashboard,
  useJobApplications,
  useUpdateJobApplication,
  useUpdateJobApplicationStatus,
} from "../hooks/useJobApplications";
import { jobApplicationSchema } from "../schemas/jobApplication.schema";

const statuses = [
  "WISHLIST",
  "APPLIED",
  "SCREENING",
  "INTERVIEW",
  "ASSESSMENT",
  "OFFER",
  "REJECTED",
  "WITHDRAWN",
];
const employmentTypes = [
  "FULL_TIME",
  "PART_TIME",
  "CONTRACT",
  "INTERNSHIP",
  "FREELANCE",
];
const sources = [
  "LINKEDIN",
  "INDEED",
  "COMPANY_WEBSITE",
  "REFERRAL",
  "JOB_BOARD",
  "OTHER",
];
const initialForm = {
  companyName: "",
  jobTitle: "",
  jobUrl: "",
  location: "",
  employmentType: "FULL_TIME",
  status: "WISHLIST",
  appliedDate: "",
  deadline: "",
  source: "",
  notes: "",
  salary: { min: "", max: "", currency: "NPR" },
};

const statusStyle = {
  WISHLIST: "bg-slate-100 text-slate-700",
  APPLIED: "bg-sky-50 text-sky-700",
  SCREENING: "bg-indigo-50 text-indigo-700",
  INTERVIEW: "bg-violet-50 text-violet-700",
  ASSESSMENT: "bg-amber-50 text-amber-700",
  OFFER: "bg-emerald-50 text-emerald-700",
  REJECTED: "bg-rose-50 text-rose-700",
  WITHDRAWN: "bg-stone-100 text-stone-600",
};

function formatStatus(status) {
  return status
    .toLowerCase()
    .replace("_", " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}
function dateValue(value) {
  return value ? new Date(value).toISOString().slice(0, 10) : "";
}
function formFromApplication(application) {
  return {
    ...initialForm,
    ...application,
    appliedDate: dateValue(application.appliedDate),
    deadline: dateValue(application.deadline),
    source: application.source || "",
    jobUrl: application.jobUrl || "",
    salary: {
      ...initialForm.salary,
      ...(application.salary || {}),
      min: application.salary?.min ?? "",
      max: application.salary?.max ?? "",
    },
  };
}
function fieldClass() {
  return "w-full rounded-lg border border-emerald-950/10 bg-white px-3 py-2.5 text-sm text-finance-text outline-none transition focus:border-[#176b87] focus:ring-2 focus:ring-[#176b87]/15";
}

function ApplicationForm({ application, onClose }) {
  const [form, setForm] = useState(
    application ? formFromApplication(application) : initialForm,
  );
  const createMutation = useCreateJobApplication();
  const updateMutation = useUpdateJobApplication();
  const mutation = application ? updateMutation : createMutation;
  const setField = (name, value) =>
    setForm((current) => ({ ...current, [name]: value }));
  const submit = async (event) => {
    event.preventDefault();
    const payload = {
      ...form,
      salary: {
        ...form.salary,
        min: form.salary.min === "" ? undefined : Number(form.salary.min),
        max: form.salary.max === "" ? undefined : Number(form.salary.max),
      },
      source: form.source || undefined,
    };
    const validation = jobApplicationSchema.safeParse(payload);

    if (!validation.success) {
      toast.error(
        validation.error.issues[0]?.message || "Please check the form.",
      );
      return;
    }

    try {
      await mutation.mutateAsync(
        application
          ? { applicationId: application._id, data: validation.data }
          : validation.data,
      );
      toast.success(
        application ? "Application updated." : "Application added.",
      );
      onClose();
    } catch (error) {
      toast.error(getError(error));
    }
  };
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/40 p-4">
      <div className="mx-auto my-8 max-w-3xl rounded-xl bg-white p-6 shadow-xl">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-[#176b87]">
              Application details
            </p>
            <h2 className="mt-1 text-2xl font-bold text-finance-dark">
              {application ? "Edit application" : "Add application"}
            </h2>
          </div>
          <button
            className="rounded-lg p-2 text-finance-muted hover:bg-finance-bg"
            onClick={onClose}
            aria-label="Close form"
          >
            <X size={20} />
          </button>
        </div>
        <form onSubmit={submit} className="mt-6 grid gap-4 sm:grid-cols-2">
          <label className="text-sm font-medium text-finance-text">
            Company name
            <input
              required
              className={fieldClass()}
              value={form.companyName}
              onChange={(event) => setField("companyName", event.target.value)}
            />
          </label>
          <label className="text-sm font-medium text-finance-text">
            Job title
            <input
              required
              className={fieldClass()}
              value={form.jobTitle}
              onChange={(event) => setField("jobTitle", event.target.value)}
            />
          </label>
          <label className="text-sm font-medium text-finance-text">
            Location
            <input
              className={fieldClass()}
              value={form.location}
              onChange={(event) => setField("location", event.target.value)}
            />
          </label>
          <label className="text-sm font-medium text-finance-text">
            Job URL
            <input
              type="url"
              className={fieldClass()}
              value={form.jobUrl}
              onChange={(event) => setField("jobUrl", event.target.value)}
            />
          </label>
          <label className="text-sm font-medium text-finance-text">
            Employment type
            <select
              className={fieldClass()}
              value={form.employmentType}
              onChange={(event) =>
                setField("employmentType", event.target.value)
              }
            >
              {employmentTypes.map((type) => (
                <option key={type}>{type}</option>
              ))}
            </select>
          </label>
          <label className="text-sm font-medium text-finance-text">
            Source
            <select
              className={fieldClass()}
              value={form.source}
              onChange={(event) => setField("source", event.target.value)}
            >
              <option value="">Select source</option>
              {sources.map((source) => (
                <option key={source}>{source}</option>
              ))}
            </select>
          </label>
          <label className="text-sm font-medium text-finance-text">
            Applied date
            <input
              type="date"
              className={fieldClass()}
              value={form.appliedDate}
              onChange={(event) => setField("appliedDate", event.target.value)}
            />
          </label>
          <label className="text-sm font-medium text-finance-text">
            Deadline
            <input
              type="date"
              className={fieldClass()}
              value={form.deadline}
              onChange={(event) => setField("deadline", event.target.value)}
            />
          </label>
          <label className="text-sm font-medium text-finance-text sm:col-span-2">
            Notes
            <textarea
              className={`${fieldClass()} min-h-24`}
              value={form.notes}
              onChange={(event) => setField("notes", event.target.value)}
            />
          </label>
          <div className="flex justify-end gap-3 sm:col-span-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" loading={mutation.isPending}>
              {application ? "Save changes" : "Add application"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Summary({ dashboard }) {
  const cards = [
    ["Total applications", dashboard?.totalJobs ?? 0, BriefcaseBusiness],
    ["Interviews", dashboard?.interviews ?? 0, Clock3],
    ["Offers", dashboard?.offers ?? 0, CheckCircle2],
    [
      "Needs attention",
      (dashboard?.screening ?? 0) + (dashboard?.assessments ?? 0),
      CircleAlert,
    ],
  ];
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map(([label, value, Icon]) => (
        <div
          className="rounded-xl border border-emerald-950/10 bg-white p-5"
          key={label}
        >
          <div className="flex items-center justify-between">
            <span className="text-sm text-finance-muted">{label}</span>
            <Icon className="h-5 w-5 text-[#176b87]" />
          </div>
          <strong className="mt-3 block text-3xl text-finance-dark">
            {value}
          </strong>
        </div>
      ))}
    </div>
  );
}

export default function JobApplications() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const [editing, setEditing] = useState(null);
  const [formOpen, setFormOpen] = useState(false);
  const params = {
    search: search || undefined,
    status: status || undefined,
    page,
    limit: 20,
  };
  const applicationsQuery = useJobApplications(params);
  const dashboardQuery = useJobApplicationDashboard({});
  const statusMutation = useUpdateJobApplicationStatus();
  const deleteMutation = useDeleteJobApplication();
  const applications = applicationsQuery.data?.data || [];
  const totalPages = applicationsQuery.data?.pagination?.totalPage || 1;
  const changeStatus = async (applicationId, nextStatus) => {
    try {
      await statusMutation.mutateAsync({ applicationId, status: nextStatus });
      toast.success("Application status updated.");
    } catch (error) {
      toast.error(getError(error));
    }
  };
  const remove = async (application) => {
    if (!window.confirm(`Delete ${application.companyName}?`)) return;
    try {
      await deleteMutation.mutateAsync(application._id);
      toast.success("Application deleted.");
    } catch (error) {
      toast.error(getError(error));
    }
  };
  return (
    <div className="mx-auto max-w-7xl space-y-7">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-[#176b87]">Your pipeline</p>
          <h1 className="mt-1 text-3xl font-bold text-finance-dark">
            Job applications
          </h1>
          <p className="mt-2 text-sm text-finance-muted">
            Keep every application and next step in view.
          </p>
        </div>
        <Button
          onClick={() => {
            setEditing(null);
            setFormOpen(true);
          }}
        >
          <Plus size={17} /> Add application
        </Button>
      </header>
      <Summary dashboard={dashboardQuery.data?.data} />
      <section className="rounded-xl border border-emerald-950/10 bg-white p-4">
        <div className="flex flex-wrap gap-3">
          <label className="relative min-w-60 flex-1">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-finance-muted" />
            <input
              className={`${fieldClass()} pl-9`}
              placeholder="Search company, role, or location"
              value={search}
              onChange={(event) => {
                setSearch(event.target.value);
                setPage(1);
              }}
            />
          </label>
          <label className="relative">
            <ChevronDown className="pointer-events-none absolute right-3 top-2.5 h-4 w-4 text-finance-muted" />
            <select
              className={`${fieldClass()} min-w-44 appearance-none pr-9`}
              value={status}
              onChange={(event) => {
                setStatus(event.target.value);
                setPage(1);
              }}
            >
              <option value="">All statuses</option>
              {statuses.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </label>
        </div>
      </section>
      {applicationsQuery.isPending ? (
        <p className="py-12 text-center text-sm text-finance-muted">
          Loading applications...
        </p>
      ) : applicationsQuery.isError ? (
        <p className="py-12 text-center text-sm text-rose-600">
          {getError(applicationsQuery.error)}
        </p>
      ) : applications.length === 0 ? (
        <div className="rounded-xl border border-dashed border-emerald-950/20 bg-white py-16 text-center">
          <BriefcaseBusiness className="mx-auto h-9 w-9 text-[#176b87]" />
          <h2 className="mt-3 text-lg font-semibold text-finance-dark">
            No applications yet
          </h2>
          <p className="mt-1 text-sm text-finance-muted">
            Add your first opportunity to start tracking.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-emerald-950/10 bg-white">
          <table className="w-full min-w-212.5 border-collapse text-left">
            <thead className="border-b border-emerald-950/10 bg-finance-bg">
              <tr className="text-xs uppercase tracking-wide text-finance-muted">
                <th className="px-5 py-4 font-semibold">Company</th>
                <th className="px-5 py-4 font-semibold">Role</th>
                <th className="px-5 py-4 font-semibold">Status</th>
                <th className="px-5 py-4 font-semibold">Employment</th>
                <th className="px-5 py-4 font-semibold">Deadline</th>
                <th className="px-5 py-4 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-emerald-950/10">
              {applications.map((application) => (
                <tr
                  className="text-sm text-finance-text transition hover:bg-[#f8fbfb]"
                  key={application._id}
                >
                  <td className="px-5 py-4">
                    <strong className="block font-semibold text-finance-dark">
                      {application.companyName}
                    </strong>
                    {application.location && (
                      <span className="mt-1 block text-xs text-finance-muted">
                        {application.location}
                      </span>
                    )}
                  </td>
                  <td className="px-5 py-4 font-medium">
                    {application.jobTitle}
                  </td>
                  <td className="px-5 py-4">
                    <select
                      className={`rounded-full border-0 px-3 py-1.5 text-xs font-semibold outline-none ${statusStyle[application.status]}`}
                      value={application.status}
                      disabled={
                        application.status === "OFFER" ||
                        statusMutation.isPending
                      }
                      onChange={(event) =>
                        changeStatus(application._id, event.target.value)
                      }
                      aria-label={`Change status for ${application.companyName}`}
                    >
                      {statuses.map((item) => (
                        <option key={item} value={item}>
                          {formatStatus(item)}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-5 py-4 text-xs text-finance-muted">
                    {formatStatus(application.employmentType)}
                  </td>
                  <td className="px-5 py-4 text-xs text-finance-muted">
                    {application.deadline ? (
                      <span className="flex items-center gap-1.5">
                        <CalendarDays size={14} />
                        {new Date(application.deadline).toLocaleDateString()}
                      </span>
                    ) : (
                      "No deadline"
                    )}
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex justify-end gap-1">
                      <button
                        className="rounded-lg p-2 text-finance-muted hover:bg-finance-bg hover:text-[#176b87]"
                        title="Edit application"
                        onClick={() => {
                          setEditing(application);
                          setFormOpen(true);
                        }}
                      >
                        <Pencil size={17} />
                      </button>
                      <button
                        className="rounded-lg p-2 text-finance-muted hover:bg-rose-50 hover:text-rose-600"
                        title="Delete application"
                        onClick={() => remove(application)}
                      >
                        <Trash2 size={17} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex items-center justify-between border-t border-emerald-950/10 px-5 py-3">
            <p className="text-xs text-finance-muted">
              Page {page} of {totalPages}
            </p>
            <div className="flex items-center gap-2">
              <button
                type="button"
                className="inline-flex items-center gap-1 rounded-lg border border-emerald-950/10 px-3 py-2 text-xs font-semibold text-finance-text transition hover:bg-finance-bg disabled:cursor-not-allowed disabled:opacity-40"
                disabled={page === 1 || applicationsQuery.isFetching}
                onClick={() => setPage((currentPage) => currentPage - 1)}
              >
                <ChevronLeft size={15} /> Previous
              </button>
              <button
                type="button"
                className="inline-flex items-center gap-1 rounded-lg border border-emerald-950/10 px-3 py-2 text-xs font-semibold text-finance-text transition hover:bg-finance-bg disabled:cursor-not-allowed disabled:opacity-40"
                disabled={page >= totalPages || applicationsQuery.isFetching}
                onClick={() => setPage((currentPage) => currentPage + 1)}
              >
                Next <ChevronRight size={15} />
              </button>
            </div>
          </div>
        </div>
      )}
      {formOpen && (
        <ApplicationForm
          application={editing}
          onClose={() => setFormOpen(false)}
        />
      )}
      <Link className="hidden" to="/applications" aria-hidden="true" />
    </div>
  );
}
