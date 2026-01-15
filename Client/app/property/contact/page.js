"use client";

import { useMemo } from "react";
import { useSearchParams } from "next/navigation";

function LinkButton({ href, label }) {
  if (!href) return null;
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="flex w-full items-center justify-center rounded-md bg-gray-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-black"
    >
      {label}
    </a>
  );
}

export default function ContactPage() {
  const sp = useSearchParams();

  const data = useMemo(() => {
    const get = (k) => (sp.get(k) || "").trim();
    return {
      name: get("name"),
      phone: get("phone"),
      email: get("email"),
      facebook: get("facebook"),
      telegram: get("telegram"),
      instagram: get("instagram"),
      tiktok: get("tiktok"),
    };
  }, [sp]);

  return (
    <div className="mx-auto max-w-md p-6">
      <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-200">
        <h1 className="text-2xl font-semibold text-gray-900">
          {data.name ? data.name : "Contact Agent"}
        </h1>
        <p className="mt-1 text-sm text-gray-600">
          Choose how you’d like to reach out.
        </p>

        <div className="mt-6 space-y-3">
          {data.phone && (
            <LinkButton
              href={`tel:${data.phone}`}
              label={`Call: ${data.phone}`}
            />
          )}
          {data.email && (
            <LinkButton
              href={`mailto:${data.email}`}
              label={`Email: ${data.email}`}
            />
          )}

          <div className="pt-2" />

          <LinkButton href={data.telegram} label="Telegram" />
          <LinkButton href={data.facebook} label="Facebook" />
          <LinkButton href={data.instagram} label="Instagram" />
          <LinkButton href={data.tiktok} label="TikTok" />
        </div>

        {!data.phone &&
          !data.email &&
          !data.facebook &&
          !data.telegram &&
          !data.instagram &&
          !data.tiktok && (
            <p className="mt-6 text-sm text-gray-600">
              No contact methods were provided.
            </p>
          )}
      </div>
    </div>
  );
}
