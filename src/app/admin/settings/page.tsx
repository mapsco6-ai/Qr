"use client";

import { useEffect, useRef, useState } from "react";
import FlameLogo from "@/components/FlameLogo";

export default function AdminSettingsPage() {
  const [siteName, setSiteName] = useState("");
  const [tagline, setTagline] = useState("");
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch("/api/admin/settings")
      .then(
        (res) =>
          res.json() as Promise<{ siteName?: string; tagline?: string; logoUrl?: string | null }>
      )
      .then((data) => {
        setSiteName(data.siteName ?? "");
        setTagline(data.tagline ?? "");
        setLogoUrl(data.logoUrl ?? null);
      })
      .finally(() => setLoading(false));
  }, []);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError("");
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
      const data = (await res.json()) as { url?: string; error?: string };
      if (!res.ok || !data.url) throw new Error(data.error);
      setLogoUrl(data.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "تعذر رفع الشعار");
    } finally {
      setUploading(false);
    }
  }

  async function handleSave() {
    setSaving(true);
    setSaved(false);
    setError("");
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ siteName, tagline, logoUrl }),
      });
      if (!res.ok) throw new Error();
      setSaved(true);
    } catch {
      setError("تعذر حفظ الإعدادات");
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <p className="text-charcoal-400">جاري التحميل...</p>;

  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-lg font-extrabold text-charcoal-800">إعدادات المطعم والهوية</h2>

      <div className="max-w-lg rounded-2xl bg-white p-5 shadow-sm">
        <div className="mb-5 flex items-center gap-4">
          <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-charcoal-900">
            {logoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={logoUrl} alt="" className="h-full w-full object-contain p-1" />
            ) : (
              <FlameLogo className="h-12 w-12" />
            )}
          </div>
          <div className="flex flex-col gap-1">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="rounded-lg border border-cream-200 px-3 py-1.5 text-sm font-semibold text-charcoal-600"
            >
              {uploading ? "جاري الرفع..." : "رفع شعار المطعم"}
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
            {logoUrl && (
              <button
                type="button"
                onClick={() => setLogoUrl(null)}
                className="text-xs text-red-500"
              >
                إزالة الشعار (استخدام الشعار الافتراضي)
              </button>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <label className="flex flex-col gap-1 text-xs text-charcoal-500">
            اسم المطعم
            <input
              value={siteName}
              onChange={(e) => setSiteName(e.target.value)}
              className="rounded-xl border border-cream-200 px-3 py-2 text-sm outline-none focus:border-ember-600"
            />
          </label>
          <label className="flex flex-col gap-1 text-xs text-charcoal-500">
            الشعار الفرعي (Tagline)
            <input
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              className="rounded-xl border border-cream-200 px-3 py-2 text-sm outline-none focus:border-ember-600"
            />
          </label>

          {error && <p className="text-sm text-red-600">{error}</p>}
          {saved && <p className="text-sm text-green-600">تم الحفظ بنجاح</p>}

          <button
            onClick={handleSave}
            disabled={saving}
            className="mt-1 rounded-xl bg-ember-600 py-2.5 font-bold text-white transition hover:bg-ember-700 disabled:opacity-60"
          >
            {saving ? "جاري الحفظ..." : "حفظ الإعدادات"}
          </button>
        </div>
      </div>
    </div>
  );
}
