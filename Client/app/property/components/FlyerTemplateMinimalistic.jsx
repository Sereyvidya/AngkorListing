"use client";

import React, { useMemo } from "react";

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

function pickImageSrc(img) {
  if (!img) return "";
  // support a few common shapes (adjust if your store differs)
  return (
    img.url ||
    img.src ||
    img.preview ||
    (typeof img === "string" ? img : "") ||
    ""
  );
}

/* ---------- icons ---------- */

const PhoneIcon = () => (
  <svg
    className="h-4 w-4"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
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
    className="h-4 w-4"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l9 6 9-6" />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M5 6h14a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2z"
    />
  </svg>
);

const PinIcon = () => (
  <svg
    className="h-4 w-4"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 21s7-4.4 7-11a7 7 0 10-14 0c0 6.6 7 11 7 11z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 10a2 2 0 100-4 2 2 0 000 4z"
    />
  </svg>
);

/* ---------- component ---------- */

export default function FlyerTemplateMinimalistic({ formData, images }) {
  const title = cleanText(formData.propertyTitle) || "Dream Home";
  const address = cleanText(formData.address) || "Address not provided";

  const priceText = cleanText(formData.price)
    ? `$${formatPrice(formData.price)}`
    : "$—";

  const description =
    cleanText(formData.description) ||
    "Welcome to your dream home! This stunning property blends modern living with timeless comfort in a peaceful neighborhood.";

  const beds = formData.bedrooms !== "" ? Number(formData.bedrooms) : null;
  const baths = formData.bathrooms !== "" ? Number(formData.bathrooms) : null;
  const size = formData.size !== "" ? Number(formData.size) : null;

  const agentName = cleanText(formData.agentName) || "Agent";
  const phone = cleanText(formData.agentPhone) || "Add phone";
  const email = cleanText(formData.agentEmail) || "Add email";

  const { heroSrc, sideSrcs } = useMemo(() => {
    const srcs = (images || []).map(pickImageSrc).filter(Boolean);
    return {
      heroSrc: srcs[0] || "",
      sideSrcs: [srcs[1], srcs[2], srcs[3]].filter(Boolean),
    };
  }, [images]);

  const features = useMemo(() => {
    // “Good enough” feature list using your existing fields (no new form required)
    const out = [];

    if (beds !== null && !Number.isNaN(beds))
      out.push(`${beds} Bed Room${beds === 1 ? "" : "s"}`);
    if (baths !== null && !Number.isNaN(baths))
      out.push(`${baths} Bath Room${baths === 1 ? "" : "s"}`);
    if (size !== null && !Number.isNaN(size)) out.push(`${size} sqm`);

    const type = cleanText(formData.propertyType);
    if (type) out.push(type);

    // Pad to look “flyer-like” without inventing specific amenities
    // (generic, safe, and still reasonable)
    const fillers = ["Living Area", "Dining Area", "Kitchen"];
    for (const f of fillers) {
      if (out.length >= 6) break;
      out.push(f);
    }

    return out.slice(0, 6);
  }, [beds, baths, size, formData.propertyType]);

  return (
    <div className="absolute inset-0 bg-[#f7f3ee] p-6">
      <div className="h-full w-full overflow-hidden rounded-[28px] bg-white ring-1 ring-black/5">
        {/* Inner padding */}
        <div className="h-full p-8">
          {/* 2-column grid */}
          <div className="grid h-full grid-cols-[320px_1fr] gap-8">
            {/* LEFT COLUMN */}
            <div className="flex h-full flex-col gap-6">
              {/* Promo box */}
              <div className="rounded-2xl bg-[#c8a27d] p-6 text-white">
                <div className="text-xs font-semibold tracking-[0.18em] opacity-90">
                  COME AND GET YOUR
                </div>
                <div className="mt-2 text-5xl leading-[0.95] font-extrabold">
                  DREAM
                  <br />
                  HOME
                </div>

                <div className="my-5 h-px w-full bg-white/70" />

                <div className="text-sm opacity-90">We offered at</div>
                <div className="mt-1 text-4xl font-extrabold">{priceText}</div>
              </div>

              {/* Side photos */}
              <div className="flex min-h-0 flex-1 flex-col gap-6">
                {Array.from({ length: 3 }).map((_, idx) => {
                  const src = sideSrcs[idx] || "";
                  return (
                    <div
                      key={idx}
                      className="flex-1 overflow-hidden rounded-2xl bg-gray-100 ring-1 ring-black/5"
                    >
                      {src ? (
                        <img
                          src={src}
                          alt={`Property photo ${idx + 2}`}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-sm text-gray-400">
                          Add more photos
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* RIGHT COLUMN */}
            <div className="flex h-full flex-col">
              {/* Title */}
              <div className="flex items-end justify-between gap-4">
                <div className="min-w-0">
                  <div className="text-6xl font-extrabold tracking-[0.14em] text-[#c8a27d]">
                    MINIMALISTIC
                  </div>
                </div>
              </div>

              {/* Hero photo */}
              <div className="mt-4 overflow-hidden rounded-2xl bg-gray-100 ring-1 ring-black/5">
                {heroSrc ? (
                  <img
                    src={heroSrc}
                    alt="Hero property photo"
                    className="h-[560px] w-full object-cover"
                  />
                ) : (
                  <div className="flex h-[560px] w-full items-center justify-center text-sm text-gray-400">
                    Add a hero photo
                  </div>
                )}
              </div>

              {/* Content blocks */}
              <div className="mt-6 flex min-h-0 flex-1 flex-col gap-6">
                {/* About */}
                <div>
                  <div className="flex items-center gap-3">
                    <div className="text-xl font-extrabold text-[#c8a27d]">
                      About The Property
                    </div>
                    <div className="h-px flex-1 bg-[#c8a27d]/60" />
                  </div>
                  <div className="mt-2 text-base leading-relaxed text-gray-700">
                    {description}
                  </div>
                </div>

                {/* Features */}
                <div>
                  <div className="flex items-center gap-3">
                    <div className="text-xl font-extrabold text-[#c8a27d]">
                      Property Features
                    </div>
                    <div className="h-px flex-1 bg-[#c8a27d]/60" />
                  </div>

                  <div className="mt-3 grid grid-cols-2 gap-x-10 gap-y-2 text-base text-gray-800">
                    {features.map((f) => (
                      <div key={f} className="flex items-start gap-2">
                        <div className="mt-2 h-2 w-2 shrink-0 rounded-full bg-[#c8a27d]" />
                        <div className="leading-snug">{f}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Contact */}
                <div className="mt-auto overflow-hidden rounded-2xl bg-[#c8a27d] text-white">
                  <div className="px-6 py-5">
                    <div className="text-lg font-extrabold">
                      Contact Information :
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                      <div className="flex items-start gap-3">
                        <div className="mt-0.5 rounded-full bg-white/15 p-2">
                          <PhoneIcon />
                        </div>
                        <div>
                          <div className="text-white/85">
                            Call us for information
                          </div>
                          <div className="mt-0.5 font-semibold">{phone}</div>
                          <div className="mt-1 text-white/85">{agentName}</div>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <div className="mt-0.5 rounded-full bg-white/15 p-2">
                          <EmailIcon />
                        </div>
                        <div>
                          <div className="text-white/85">E-mail us</div>
                          <div className="mt-0.5 font-semibold">{email}</div>
                        </div>
                      </div>

                      <div className="col-span-2 flex items-start gap-3">
                        <div className="mt-0.5 rounded-full bg-white/15 p-2">
                          <PinIcon />
                        </div>
                        <div className="min-w-0">
                          <div className="text-white/85">Location</div>
                          <div className="mt-0.5 truncate font-semibold">
                            {address}
                          </div>
                          <div className="mt-0.5 truncate text-white/80">
                            {title}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
