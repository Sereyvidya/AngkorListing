"use client";

import React, { forwardRef, useEffect, useRef, useState } from "react";
import PhotoGrid from "./PhotoGrid";

const BASE_WIDTH = 1080;
const BASE_HEIGHT = 1350;
const PREVIEW_ZOOM = 1;

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

const FlyerPreview = forwardRef(function FlyerPreview(
  { formData, images },
  exportRef
) {
  const containerRef = useRef(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const ro = new ResizeObserver(([entry]) => {
      const w = entry.contentRect.width;
      const fit = Math.min(1, w / BASE_WIDTH);
      setScale(fit * PREVIEW_ZOOM);
    });

    ro.observe(el);
    return () => ro.disconnect();
  }, []);

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
    <div ref={containerRef} className="w-full">
      {/* UI spacer — fluid */}
      <div
        className="relative"
        style={{
          width: BASE_WIDTH * scale,
          height: BASE_HEIGHT * scale,
        }}
      >
        {/* Scaled preview stage */}
        <div
          className="absolute inset-0"
          style={{
            width: BASE_WIDTH,
            height: BASE_HEIGHT,
            transform: `scale(${scale})`,
            transformOrigin: "top left",
          }}
        >
          {/* 🔒 EXPORT NODE — NEVER FLUID */}
          <div
            ref={exportRef}
            className="overflow-hidden rounded-2xl border-1 border-gray-200 bg-white"
            style={{ width: BASE_WIDTH, height: BASE_HEIGHT }}
          >
            <div className="flex h-full w-full flex-col gap-[28px] p-[48px]">
              <div className="flex items-start justify-between gap-[24px]">
                <div className="min-w-0">
                  <div className="text-[16px] font-semibold tracking-[0.18em] text-gray-500">
                    ANGKORLISTING
                  </div>
                  <div className="mt-[8px] truncate text-[46px] leading-[1.05] font-semibold text-gray-900">
                    {title}
                  </div>
                  <div className="mt-[10px] truncate text-[22px] text-gray-600">
                    {address}
                  </div>
                </div>

                <div className="shrink-0 text-right">
                  {typeText && (
                    <div className="inline-flex rounded-full bg-gray-100 px-[16px] py-[8px] text-[16px] font-semibold text-gray-700">
                      {typeText}
                    </div>
                  )}
                  {priceText && (
                    <div className="mt-[14px] text-[44px] font-bold text-gray-900">
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
              <div className="grid grid-cols-1 gap-[18px]">
                {showStats && (
                  <div className="flex flex-wrap gap-[12px]">
                    {beds !== null && !Number.isNaN(beds) && (
                      <div className="rounded-xl border border-gray-200 bg-gray-50 px-[18px] py-[12px] text-[20px] text-gray-800">
                        <span className="font-semibold">{beds}</span> Beds
                      </div>
                    )}
                    {baths !== null && !Number.isNaN(baths) && (
                      <div className="rounded-xl border border-gray-200 bg-gray-50 px-[18px] py-[12px] text-[20px] text-gray-800">
                        <span className="font-semibold">{baths}</span> Baths
                      </div>
                    )}
                    {size !== null && !Number.isNaN(size) && (
                      <div className="rounded-xl border border-gray-200 bg-gray-50 px-[18px] py-[12px] text-[20px] text-gray-800">
                        <span className="font-semibold">{size}</span> sqm
                      </div>
                    )}
                  </div>
                )}

                {/* Contact strip */}
                <div className="flex items-center justify-between gap-[20px] rounded-2xl bg-gray-900 p-[22px] text-white">
                  <div className="flex min-w-0 items-center gap-[16px]">
                    {agentPhoto ? (
                      <img
                        src={agentPhoto}
                        alt="Agent profile"
                        className="h-[64px] w-[64px] rounded-full border border-white/20 bg-white object-cover"
                      />
                    ) : (
                      <div className="flex h-[64px] w-[64px] items-center justify-center rounded-full border border-white/10 bg-white/10 text-[14px] text-white/70">
                        Photo
                      </div>
                    )}

                    <div className="min-w-0">
                      <div className="text-[14px] tracking-[0.18em] text-white/80 uppercase">
                        Contact
                      </div>
                      <div className="truncate text-[28px] font-semibold">
                        {agentName}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-[18px]">
                    <div className="space-y-[8px] text-[20px] leading-tight">
                      {phone && (
                        <div className="flex items-center gap-[10px] text-white/90">
                          <PhoneIcon />
                          <span>{phone}</span>
                        </div>
                      )}
                      {email && (
                        <div className="flex items-center gap-[10px] text-white/90">
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
                        className="h-[76px] w-[76px] rounded-md border border-white/20 bg-white object-cover"
                      />
                    ) : (
                      <div className="flex h-[76px] w-[76px] items-center justify-center rounded-md border border-white/10 bg-white/10 text-[14px] text-white/70">
                        QR
                      </div>
                    )}
                  </div>
                </div>

                {formData.description?.trim() && (
                  <div className="line-clamp-3 text-[20px] text-gray-700">
                    {formData.description.trim()}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

export default FlyerPreview;
