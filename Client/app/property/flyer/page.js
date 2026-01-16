"use client";

import { useMemo, useRef, useState } from "react";
import Link from "next/link";
import { usePropertyStore } from "@/app/lib/propertyStore";
import FlyerPreview from "../components/FlyerPreview";
import { toPng } from "html-to-image";
import jsPDF from "jspdf";

export default function FlyerPage() {
  const [template, setTemplate] = useState("hero");

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
        pixelRatio: 3,
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

      const dataUrl = await toPng(node, {
        backgroundColor: "#ffffff",
        pixelRatio: 3,
      });

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
      <div className="rounded-lg bg-white p-8 ring-1 ring-gray-200">
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
    <div className="min-h-[calc(100vh-73px)]">
      <div>
        {/* Top controls bar */}
        <div className="sticky top-0 z-20 rounded-lg bg-white/90 px-4 py-4 ring-1 ring-gray-200 backdrop-blur lg:static lg:rounded-xl">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            {/* Title + template */}
            <div className="min-w-0">
              <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:gap-6">
                <div className="min-w-0">
                  <h1 className="truncate text-xl font-semibold text-gray-900">
                    Flyer Builder
                  </h1>
                  <p className="text-sm text-gray-600">Portrait (1080×1350)</p>
                </div>

                <div className="flex items-center gap-2">
                  <div className="text-sm font-medium text-gray-700">
                    Template
                  </div>
                  <div className="flex rounded-lg border border-gray-200 p-1">
                    <button
                      type="button"
                      onClick={() => setTemplate("hero")}
                      className={[
                        "rounded-md px-3 py-1.5 text-sm transition",
                        template === "hero"
                          ? "bg-blue-600 text-white"
                          : "text-gray-700 hover:bg-gray-50",
                      ].join(" ")}
                    >
                      Hero
                    </button>
                    <button
                      type="button"
                      onClick={() => setTemplate("grid")}
                      className={[
                        "rounded-md px-3 py-1.5 text-sm transition",
                        template === "grid"
                          ? "bg-blue-600 text-white"
                          : "text-gray-700 hover:bg-gray-50",
                      ].join(" ")}
                    >
                      Grid
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-end">
              <button
                type="button"
                onClick={exportPNG}
                disabled={isExporting}
                className="inline-flex w-full justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-60 sm:w-auto"
              >
                {isExporting ? "Exporting..." : "Export PNG"}
              </button>

              <button
                type="button"
                onClick={exportPDF}
                disabled={isExporting}
                className="inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-800 hover:bg-gray-50 disabled:opacity-60 sm:w-auto"
              >
                {isExporting ? "Exporting..." : "Export PDF"}
              </button>

              <Link
                href="/property/general"
                className="inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-800 hover:bg-gray-50 sm:w-auto"
              >
                Back to General Info
              </Link>
            </div>
          </div>
        </div>

        {/* Flyer preview below */}
        <div className="mt-8 flex w-full justify-center overflow-auto">
          <div className="w-full">
            <FlyerPreview
              ref={flyerRef}
              formData={formData}
              images={images}
              template={template}
            />
          </div>
        </div>

        <div className="mt-3 text-center text-xs text-gray-500">
          Preview scales to your screen. Exports remain 1080×1350.
        </div>
      </div>
    </div>
  );
}
