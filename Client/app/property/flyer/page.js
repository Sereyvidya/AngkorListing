"use client";

import { useMemo, useRef, useState } from "react";
import Link from "next/link";
import { usePropertyStore } from "@/app/lib/propertyStore";
import FlyerPreview from "../components/FlyerPreview";
import { toPng } from "html-to-image";
import jsPDF from "jspdf";

export default function FlyerPage() {
  const [template, setTemplate] = useState("hero");
  const [mobileView, setMobileView] = useState("preview");

  const formData = usePropertyStore((s) => s.formData);
  const images = usePropertyStore((s) => s.images);

  const flyerRef = useRef(null);
  const [isExporting, setIsExporting] = useState(false);

  const hasData = useMemo(() => {
    return (
      (formData.propertyTitle && formData.propertyTitle.trim() !== "") ||
      (formData.address && formData.address.trim() !== "") ||
      images.length > 0
    );
  }, [formData, images]);

  const safeFileBase = useMemo(() => {
    const base = (formData.propertyTitle || "flyer")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
    return base || "flyer";
  }, [formData.propertyTitle]);

  const downloadDataUrl = (dataUrl, filename) => {
    const a = document.createElement("a");
    a.href = dataUrl;
    a.download = filename;
    a.click();
  };

  const exportPNG = async () => {
    if (!flyerRef.current) return;
    try {
      setIsExporting(true);

      const dataUrl = await toPng(flyerRef.current, {
        backgroundColor: "#ffffff",
        pixelRatio: 3, // higher = sharper
      });

      downloadDataUrl(dataUrl, `${safeFileBase}.png`);
    } finally {
      setIsExporting(false);
    }
  };

  const exportPDF = async () => {
    if (!flyerRef.current) return;
    try {
      setIsExporting(true);

      const node = flyerRef.current;

      // render to png
      const dataUrl = await toPng(node, {
        backgroundColor: "#ffffff",
        pixelRatio: 3,
      });

      // use DOM size to make a perfectly-fit PDF page
      const width = node.offsetWidth;
      const height = node.offsetHeight;

      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "px",
        format: [width, height],
      });

      pdf.addImage(dataUrl, "PNG", 0, 0, width, height);
      pdf.save(`${safeFileBase}.pdf`);
    } finally {
      setIsExporting(false);
    }
  };

  if (!hasData) {
    return (
      <div className="rounded-lg bg-white p-8 shadow-md">
        <h1 className="mb-2 text-2xl font-semibold text-gray-900">
          Flyer Builder
        </h1>
        <p className="mb-6 text-gray-600">
          No listing data yet. Start with General Info.
        </p>
        <Link
          href="/property/general"
          className="inline-flex rounded-md bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700"
        >
          Go to General Info
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-73px)] overflow-x-hidden">
      {/* Mobile top toggle bar */}
      <div className="sticky top-0 z-20 border-b bg-white px-4 py-3 lg:hidden">
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <div className="truncate text-base font-semibold text-gray-900">
              Flyer Builder
            </div>
            <div className="text-xs text-gray-600">Portrait (1080×1350)</div>
          </div>

          <div className="flex rounded-lg border p-1">
            <button
              type="button"
              onClick={() => setMobileView("controls")}
              className={`rounded-md px-3 py-1.5 text-sm ${
                mobileView === "controls"
                  ? "bg-blue-600 text-white"
                  : "text-gray-700"
              }`}
            >
              Controls
            </button>
            <button
              type="button"
              onClick={() => setMobileView("preview")}
              className={`rounded-md px-3 py-1.5 text-sm ${
                mobileView === "preview"
                  ? "bg-blue-600 text-white"
                  : "text-gray-700"
              }`}
            >
              Preview
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto w-full max-w-6xl px-4 py-4 lg:px-0 lg:py-8">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 lg:gap-8">
          {/* Controls */}
          <div
            className={`rounded-xl bg-white p-6 ring-1 ring-gray-200 lg:block ${
              mobileView === "controls" ? "block" : "hidden"
            } lg:sticky lg:top-6 lg:self-start`}
          >
            <div className="hidden lg:block">
              <h1 className="text-xl font-semibold text-gray-900">
                Flyer Builder
              </h1>
              <p className="mt-1 text-sm text-gray-600">Portrait (1080×1350)</p>
            </div>

            <div className="mt-0 space-y-3 lg:mt-6">
              <div>
                <div className="mb-2 text-sm font-medium text-gray-700">
                  Template
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setTemplate("hero")}
                    className={`rounded-md border px-3 py-2 text-sm ${
                      template === "hero"
                        ? "border-blue-600 bg-blue-50 text-blue-700"
                        : "border-gray-300 text-gray-800 hover:bg-gray-50"
                    }`}
                  >
                    Hero
                  </button>
                  <button
                    type="button"
                    onClick={() => setTemplate("grid")}
                    className={`rounded-md border px-3 py-2 text-sm ${
                      template === "grid"
                        ? "border-blue-600 bg-blue-50 text-blue-700"
                        : "border-gray-300 text-gray-800 hover:bg-gray-50"
                    }`}
                  >
                    Grid
                  </button>
                </div>
              </div>

              <button
                type="button"
                onClick={exportPNG}
                disabled={isExporting}
                className="w-full rounded-md bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700 disabled:opacity-60"
              >
                {isExporting ? "Exporting..." : "Export PNG"}
              </button>

              <button
                type="button"
                onClick={exportPDF}
                disabled={isExporting}
                className="w-full rounded-md border border-gray-300 px-4 py-2 text-gray-800 hover:bg-gray-50 disabled:opacity-60"
              >
                {isExporting ? "Exporting..." : "Export PDF"}
              </button>

              <Link
                href="/property/general"
                className="inline-flex w-full justify-center rounded-md border border-gray-300 px-4 py-2 text-gray-800 hover:bg-gray-50"
              >
                Back to General Info
              </Link>
            </div>

            <p className="mt-4 text-xs text-gray-500">
              Tip: Use high-quality images for sharper exports.
            </p>
          </div>

          {/* Preview */}
          <div
            className={`lg:col-span-2 ${
              mobileView === "preview" ? "block" : "hidden"
            } lg:block`}
          >
            <div className="rounded-xl bg-white p-3 ring-1 ring-gray-200 sm:p-4">
              <div className="flex w-full justify-center overflow-auto">
                <div className="w-full max-w-[1080px]">
                  <FlyerPreview
                    ref={flyerRef}
                    formData={formData}
                    images={images}
                    template={template}
                  />
                </div>
              </div>
            </div>

            <div className="mt-3 text-center text-xs text-gray-500">
              Preview scales to your screen. Exports remain 1080×1350.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
