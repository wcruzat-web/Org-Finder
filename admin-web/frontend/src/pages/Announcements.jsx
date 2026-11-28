
import { useCallback, useEffect, useState } from "react";
import supabase from "../lib/supabase";

const REMOVAL_REASONS = [
  "Spam",
  "Inappropriate content",
  "Misleading information",
  "Violation of organization guidelines",
  "Duplicate announcement",
  "Other",
];

function Announcements() {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);
  const [selectedReason, setSelectedReason] = useState("");
  const [customReason, setCustomReason] = useState("");

  const fetchAnnouncements = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from("announcements")
        .select(`
          id,
          organization_id,
          author_id,
          audience,
          title,
          body,
          removed_at,
          created_at,
          organization:organizations!announcements_organization_id_fkey (
            name
          )
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;

      setAnnouncements(data ?? []);
      setErrorMessage("");
    } catch (error) {
      console.error("error fetching announcements:", error);
      setErrorMessage(error.message || "Unable to fetch announcements.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchAnnouncements();
    }, 0);

    return () => clearTimeout(timer);
  }, [fetchAnnouncements]);

  const openDeleteModal = (announcement) => {
    setSelectedAnnouncement(announcement);
    setSelectedReason("");
    setCustomReason("");
    setErrorMessage("");
  };

  const closeDeleteModal = () => {
    if (deletingId !== null) return;

    setSelectedAnnouncement(null);
    setSelectedReason("");
    setCustomReason("");
  };

  const handleDelete = async () => {
    if (!selectedAnnouncement || !selectedReason) {
      setErrorMessage("Please select a removal reason.");
      return;
    }

    const finalReason =
      selectedReason === "Other" ? customReason.trim() : selectedReason;

    if (!finalReason) {
      setErrorMessage("Please provide a custom removal reason.");
      return;
    }

    try {
      setDeletingId(selectedAnnouncement.id);
      setErrorMessage("");

      const { error } = await supabase.rpc("admin_remove_announcement", {
        p_announcement_id: selectedAnnouncement.id,
        p_removal_reason: finalReason,
      });

      if (error) throw error;

      setAnnouncements((current) =>
        current.filter((item) => item.id !== selectedAnnouncement.id),
      );

      setSelectedAnnouncement(null);
      setSelectedReason("");
      setCustomReason("");
    } catch (error) {
      console.error("error deleting announcement:", error);
      setErrorMessage(error.message || "Unable to delete announcement.");
    } finally {
      setDeletingId(null);
    }
  };

  const formatDate = (date) => {
    if (!date) return "Unknown date";

    return new Date(date).toLocaleString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  return (
    <div className="space-y-5 pb-6 text-white">
      <div>
        <h2 className="text-xl font-semibold">Announcements</h2>
        <p className="mt-1 text-sm text-[#AEB8D5]">
          Manage announcements published by organizations.
        </p>
      </div>

      <div className="rounded-xl bg-[#383C55] p-4 md:p-5">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h3 className="font-semibold">Organization announcements</h3>
            <p className="mt-1 text-xs text-[#AEB8D5]">
              {announcements.length} announcement
              {announcements.length !== 1 ? "s" : ""}
            </p>
          </div>

          <button
            onClick={() => {
              setLoading(true);
              fetchAnnouncements();
            }}
            disabled={loading}
            className="rounded-lg bg-[#484D68] px-3 py-2 text-xs font-medium text-white transition hover:bg-[#555B78] disabled:opacity-50"
          >
            {loading ? "Loading..." : "Refresh"}
          </button>
        </div>

        {errorMessage && !selectedAnnouncement && (
          <div className="mb-4 rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-300">
            {errorMessage}
          </div>
        )}

        {loading ? (
          <p className="py-10 text-center text-sm text-[#AEB8D5]">
            Loading announcements...
          </p>
        ) : announcements.length === 0 ? (
          <p className="py-10 text-center text-sm text-[#AEB8D5]">
            No announcements found.
          </p>
        ) : (
          <div className="space-y-3">
            {announcements.map((announcement) => (
              <div
                key={announcement.id}
                className="rounded-lg border border-[#50546C] bg-[#30344B] p-4"
              >
                <div className="flex flex-col justify-between gap-4 sm:flex-row">
                  <div className="min-w-0 flex-1">
                    <div className="mb-2 flex flex-wrap items-center gap-2">
                      <span className="rounded-full bg-[#484D68] px-2.5 py-1 text-[10px] font-semibold text-[#D9B77D]">
                        {announcement.organization?.name ??
                          "Unknown organization"}
                      </span>

                      <span className="rounded-full bg-[#484D68] px-2.5 py-1 text-[10px] text-[#C5CDE2]">
                        {announcement.audience}
                      </span>
                    </div>

                    <h4 className="text-base font-semibold text-white">
                      {announcement.title}
                    </h4>

                    <p className="mt-2 whitespace-pre-wrap break-words text-sm leading-relaxed text-[#C5CDE2]">
                      {announcement.body}
                    </p>

                    <p className="mt-3 text-xs text-[#AEB8D5]">
                      Published: {formatDate(announcement.created_at)}
                    </p>
                  </div>

                  <div className="flex shrink-0 items-start">
                    <button
                      onClick={() => openDeleteModal(announcement)}
                      className="rounded-lg bg-[#713D4A] px-4 py-2 text-xs font-semibold text-[#FF9A9A] transition hover:bg-[#854958]"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedAnnouncement && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="w-full max-w-md rounded-xl border border-[#50546C] bg-[#383C55] p-5 shadow-xl">
            <h3 className="text-lg font-semibold text-white">
              Remove announcement
            </h3>

            <p className="mt-2 text-sm text-[#C5CDE2]">
              You are about to permanently delete:
            </p>

            <p className="mt-2 rounded-lg bg-[#30344B] p-3 text-sm font-semibold text-white">
              {selectedAnnouncement.title}
            </p>

            <label className="mt-5 block text-sm font-medium text-white">
              Reason for removal
            </label>

            <select
              value={selectedReason}
              onChange={(event) => {
                setSelectedReason(event.target.value);
                setErrorMessage("");
              }}
              className="mt-2 w-full rounded-lg border border-[#50546C] bg-[#30344B] px-3 py-3 text-sm text-white outline-none focus:border-[#D9B77D]"
            >
              <option value="" disabled>
                Select a reason
              </option>

              {REMOVAL_REASONS.map((reason) => (
                <option key={reason} value={reason}>
                  {reason}
                </option>
              ))}
            </select>

            {selectedReason === "Other" && (
              <textarea
                value={customReason}
                onChange={(event) => setCustomReason(event.target.value)}
                placeholder="Enter the reason for removal..."
                rows={3}
                className="mt-3 w-full resize-none rounded-lg border border-[#50546C] bg-[#30344B] px-3 py-3 text-sm text-white outline-none placeholder:text-[#8992AD] focus:border-[#D9B77D]"
              />
            )}

            {errorMessage && (
              <p className="mt-3 text-sm text-red-300">
                {errorMessage}
              </p>
            )}

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={closeDeleteModal}
                disabled={deletingId !== null}
                className="rounded-lg bg-[#484D68] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#555B78] disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                onClick={handleDelete}
                disabled={
                  deletingId !== null ||
                  !selectedReason ||
                  (selectedReason === "Other" && !customReason.trim())
                }
                className="rounded-lg bg-[#713D4A] px-4 py-2.5 text-sm font-semibold text-[#FF9A9A] transition hover:bg-[#854958] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {deletingId !== null
                  ? "Removing..."
                  : "Confirm deletion"}
              </button>
            </div>

            <p className="mt-4 text-xs text-[#AEB8D5]">
              This action is permanent. The organization will receive a
              notification explaining the removal.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default Announcements;
