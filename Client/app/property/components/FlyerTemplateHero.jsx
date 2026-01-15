"use client";

import PhotoGrid from "./PhotoGrid";

// same icons + formatPrice as your current FlyerPreview
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

function formatPrice(price) {
  if (price === null || price === undefined || price === "") return "";
  const num = Number(price);
  if (Number.isNaN(num)) return String(price);
  return num.toLocaleString("en-US");
}

export default function FlyerTemplateHero({ formData, images }) {
  // copy your current computed values exactly
  const title = formData.propertyTitle?.trim() || "New Property Listing";
  const address = formData.address?.trim() || "Address not provided";
  const priceText = formData.price ? `$${formatPrice(formData.price)}` : "";
  const typeText = formData.propertyType
    ? formData.propertyType.toUpperCase()
    : "";

  const beds = formData.bedrooms !== "" ? Number(formData.bedrooms) : null;
  const baths = formData.bathrooms !== "" ? Number(formData.bathrooms) : null;
  const size = formData.size !== "" ? Number(formData.size) : null;

  const agentName = formData.agentName?.trim() || "Agent";
  const phone = formData.agentPhone?.trim() || "";
  const email = formData.agentEmail?.trim() || "";
  const agentPhoto = formData.agentPhoto?.preview || "";
  const agentQr = formData.agentQrCode?.preview || "";

  const showStats = beds !== null || baths !== null || size !== null;

  return (
    <div className="absolute inset-0 flex flex-col gap-4 p-6">
      {/* Top bar */}
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="text-xs font-semibold tracking-wider text-gray-500">
            ANGKORLISTING
          </div>
          <div className="mt-1 truncate text-2xl leading-tight font-semibold text-gray-900">
            {title}
          </div>
          <div className="mt-1 truncate text-sm text-gray-600">{address}</div>
        </div>

        <div className="shrink-0 text-right">
          {typeText && (
            <div className="inline-flex rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-700">
              {typeText}
            </div>
          )}
          {priceText && (
            <div className="mt-2 text-2xl font-bold text-gray-900">
              {priceText}
            </div>
          )}
        </div>
      </div>

      {/* Photos */}
      <div className="flex-1">
        <PhotoGrid images={images} />
      </div>

      {/* Bottom */}
      <div className="grid grid-cols-1 gap-3">
        {showStats && (
          <div className="flex flex-wrap gap-2">
            {beds !== null && !Number.isNaN(beds) && (
              <div className="rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-800">
                <span className="font-semibold">{beds}</span> Beds
              </div>
            )}
            {baths !== null && !Number.isNaN(baths) && (
              <div className="rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-800">
                <span className="font-semibold">{baths}</span> Baths
              </div>
            )}
            {size !== null && !Number.isNaN(size) && (
              <div className="rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-800">
                <span className="font-semibold">{size}</span> sqm
              </div>
            )}
          </div>
        )}

        {/* Contact strip */}
        <div className="flex items-center justify-between gap-4 rounded-2xl bg-gray-900 p-4 text-white">
          <div className="flex min-w-0 items-center gap-3">
            {agentPhoto ? (
              <img
                src={agentPhoto}
                alt="Agent profile"
                className="h-12 w-12 rounded-full border border-white/20 bg-white object-cover"
              />
            ) : (
              <div className="flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-white/10 text-xs text-white/70">
                Photo
              </div>
            )}

            <div className="min-w-0">
              <div className="text-xs tracking-wider text-white/80 uppercase">
                Contact
              </div>
              <div className="truncate text-lg font-semibold">{agentName}</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="space-y-1 text-sm leading-tight">
              {phone && (
                <div className="flex items-center gap-2 text-white/90">
                  <PhoneIcon />
                  <span>{phone}</span>
                </div>
              )}

              {email && (
                <div className="flex items-center gap-2 text-white/90">
                  <EmailIcon />
                  <span>{email}</span>
                </div>
              )}

              {!phone && !email && (
                <div className="text-white/70">Add contact info</div>
              )}
            </div>

            {agentQr ? (
              <img
                src={agentQr}
                alt="Agent QR code"
                className="h-14 w-14 rounded-md border border-white/20 bg-white object-cover"
              />
            ) : (
              <div className="flex h-14 w-14 items-center justify-center rounded-md border border-white/10 bg-white/10 text-xs text-white/70">
                QR
              </div>
            )}
          </div>
        </div>

        {formData.description?.trim() && (
          <div className="line-clamp-3 text-sm text-gray-700">
            {formData.description.trim()}
          </div>
        )}
      </div>
    </div>
  );
}
