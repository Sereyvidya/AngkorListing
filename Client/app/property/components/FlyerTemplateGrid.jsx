"use client";

import PhotoGrid from "./PhotoGrid";

/* ---------- helpers ---------- */

function cleanText(v) {
  return (v ?? "").toString().trim();
}

function formatPrice(price) {
  if (price === null || price === undefined || price === "") return "";
  const num = Number(price);
  if (Number.isNaN(num)) return String(price);
  return num.toLocaleString("en-US");
}

/* ---------- icons ---------- */

const PhoneIcon = () => (
  <svg
    className="h-4 w-4 shrink-0"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M3 5a2 2 0 012-2h2.28a1 1 0 01.95.68l1.1 3.3a1 1 0 01-.24 1.02l-1.27 1.27a16 16 0 006.59 6.59l1.27-1.27a1 1 0 011.02-.24l3.3 1.1a1 1 0 01.68.95V19a2 2 0 01-2 2h-1C9.82 21 3 14.18 3 6V5z"
    />
  </svg>
);

const EmailIcon = () => (
  <svg
    className="h-4 w-4 shrink-0"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M3 8l9 6 9-6M5 6h14a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2z"
    />
  </svg>
);

const FacebookIcon = () => (
  <svg className="h-4 w-4 shrink-0" fill="currentColor" viewBox="0 0 24 24">
    <path d="M22 12a10 10 0 10-11.56 9.87v-6.99H7.9V12h2.54V9.8c0-2.5 1.49-3.88 3.77-3.88 1.1 0 2.26.2 2.26.2v2.46h-1.27c-1.25 0-1.64.78-1.64 1.57V12h2.79l-.45 2.88h-2.34v6.99A10 10 0 0022 12z" />
  </svg>
);

const TelegramIcon = () => (
  <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="currentColor">
    <path d="M21.9 4.7c.3-1.2-.9-2.2-2-1.7L2.7 10.1c-1.2.5-1.1 2.2.2 2.5l4.6 1.2 1.8 5.2c.3 1 1.6 1.2 2.2.4l2.6-3.1 4.9 3.6c.9.7 2.2.2 2.4-.9l2.5-14.3zM8.6 13.3l9.5-6c.2-.1.4.2.2.4l-7.8 7.2-.3 3.4-1.5-4.3-3.2-.8c-.3-.1-.3-.5.1-.6z" />
  </svg>
);

const InstagramIcon = () => (
  <svg
    className="h-4 w-4 shrink-0"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    viewBox="0 0 24 24"
  >
    <rect x="3" y="3" width="18" height="18" rx="5" ry="5" />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M16 11.37a4 4 0 11-7.89 1.26A4 4 0 0116 11.37z"
    />
    <path strokeLinecap="round" strokeLinejoin="round" d="M17.5 6.5h.01" />
  </svg>
);

const TikTokIcon = () => (
  <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="currentColor">
    <path d="M16.5 3c.4 2.2 1.8 3.9 3.9 4.4v3.1c-1.7.1-3.2-.5-4.4-1.5V15c0 3.3-2.7 6-6 6s-6-2.7-6-6 2.7-6 6-6c.4 0 .9.1 1.3.2v3.3c-.4-.2-.8-.3-1.3-.3-1.6 0-2.9 1.3-2.9 2.9S8.4 18 10 18s2.9-1.3 2.9-2.9V3h3.6z" />
  </svg>
);

export default function FlyerTemplateGrid({ formData, images }) {
  const title = cleanText(formData.propertyTitle) || "New Property Listing";
  const address = cleanText(formData.address) || "Address not provided";

  const priceText = cleanText(formData.price)
    ? `$${formatPrice(formData.price)}`
    : "";
  const typeText = cleanText(formData.propertyType)
    ? cleanText(formData.propertyType).toUpperCase()
    : "";

  const beds = formData.bedrooms !== "" ? Number(formData.bedrooms) : null;
  const baths = formData.bathrooms !== "" ? Number(formData.bathrooms) : null;
  const size = formData.size !== "" ? Number(formData.size) : null;
  const showStats = beds !== null || baths !== null || size !== null;

  const agentName = cleanText(formData.agentName) || "Agent";
  const agentPhoto = formData.agentPhoto?.preview || "";

  const contactItems = [
    {
      key: "phone",
      value: cleanText(formData.agentPhone),
      Icon: PhoneIcon,
    },
    {
      key: "email",
      value: cleanText(formData.agentEmail),
      Icon: EmailIcon,
    },
    {
      key: "facebook",
      value: cleanText(formData.agentFacebook),
      Icon: FacebookIcon,
    },
    {
      key: "telegram",
      value: cleanText(formData.agentTelegram),
      Icon: TelegramIcon,
    },
    {
      key: "instagram",
      value: cleanText(formData.agentInstagram),
      Icon: InstagramIcon,
    },
    { key: "tiktok", value: cleanText(formData.agentTiktok), Icon: TikTokIcon },
  ].filter((s) => s.value);

  const description = cleanText(formData.description);

  const mid = Math.ceil(contactItems.length / 2); // top has at most 1 more
  const topRow = contactItems.slice(0, mid);
  const bottomRow = contactItems.slice(mid);

  return (
    <div className="absolute inset-0 flex flex-col gap-5 p-6">
      {/* Header */}
      <div className="shrink-0">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="text-xs font-semibold tracking-wider text-gray-500">
              ANGKORLISTING
            </div>

            <div className="mt-1 line-clamp-2 text-[32px] leading-[1.1] font-semibold text-gray-900">
              {title}
            </div>

            <div className="mt-2 line-clamp-1 text-base text-gray-600">
              {address}
            </div>
          </div>

          <div className="shrink-0 text-right">
            {typeText && (
              <div className="inline-flex rounded-full bg-gray-100 px-3 py-1 text-sm font-semibold text-gray-700">
                {typeText}
              </div>
            )}
            {priceText && (
              <div className="mt-2 text-3xl font-extrabold text-gray-900">
                {priceText}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Photos (≈58% height) */}
      <div className="min-h-0 flex-[0_0_62%]">
        <PhotoGrid images={images} />
      </div>

      {/* Bottom content (≈42% height) */}
      <div className="flex min-h-0 flex-[0_0_38%] flex-col gap-4">
        {(showStats || description) && (
          <div className="rounded-2xl border border-gray-200 bg-white p-5">
            {showStats && (
              <div className="mb-3 flex flex-wrap gap-2">
                {beds !== null && !Number.isNaN(beds) && (
                  <div className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-2 text-base text-gray-800">
                    <span className="font-semibold">{beds}</span> Beds
                  </div>
                )}
                {baths !== null && !Number.isNaN(baths) && (
                  <div className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-2 text-base text-gray-800">
                    <span className="font-semibold">{baths}</span> Baths
                  </div>
                )}
                {size !== null && !Number.isNaN(size) && (
                  <div className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-2 text-base text-gray-800">
                    <span className="font-semibold">{size}</span> sqm
                  </div>
                )}
              </div>
            )}

            {description && (
              <div className="line-clamp-3 text-base leading-snug text-gray-700">
                {description}
              </div>
            )}
          </div>
        )}

        {/* Contact strip */}
        <div className="rounded-2xl bg-gray-900 px-6 py-5 text-white">
          <div className="flex items-center gap-6">
            {/* Agent */}
            <div className="flex min-w-0 items-center gap-3">
              {agentPhoto ? (
                <img
                  src={agentPhoto}
                  alt="Agent profile"
                  className="h-12 w-12 rounded-full border border-white/20 bg-white object-cover"
                />
              ) : (
                <div className="flex h-12 w-12 items-center justify-center rounded-full border border-white/20 bg-white/10 text-xs text-white/70">
                  Photo
                </div>
              )}

              <div className="min-w-0">
                <div className="text-xs tracking-wider text-white/70 uppercase">
                  Contact
                </div>
                <div className="truncate text-lg font-semibold">
                  {agentName}
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="h-6 w-px bg-white/20" />

            {/* Contact details */}
            <div className="flex min-w-0 flex-col gap-2 text-sm text-white/90">
              {/* Top row */}
              <div className="flex min-w-0 items-center gap-5">
                {topRow.map(({ key, value, Icon }) => (
                  <div
                    key={key}
                    className="flex min-w-0 items-center gap-2 whitespace-nowrap"
                  >
                    <Icon />
                    <span className="max-w-[220px] truncate">{value}</span>
                  </div>
                ))}
              </div>

              {/* Bottom row */}
              {bottomRow.length > 0 && (
                <div className="flex min-w-0 items-center gap-5 text-white/80">
                  {bottomRow.map(({ key, value, Icon }) => (
                    <div
                      key={key}
                      className="flex min-w-0 items-center gap-2 whitespace-nowrap"
                    >
                      <Icon />
                      <span className="max-w-[220px] truncate">{value}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
