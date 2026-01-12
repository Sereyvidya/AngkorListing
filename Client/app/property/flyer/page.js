"use client";

import { useMemo, useRef, useState } from "react";
import Link from "next/link";
import { usePropertyStore } from "@/app/lib/propertyStore";
import FlyerPreview from "../components/FlyerPreview";
import { toPng } from "html-to-image";
import jsPDF from "jspdf";

export default function FlyerPage() {
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

      // 1) render to png
      const dataUrl = await toPng(node, {
        backgroundColor: "#ffffff",
        pixelRatio: 3,
      });

      // 2) use DOM size to make a perfectly-fit PDF page
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
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      {/* Controls */}
      <div className="h-fit rounded-lg bg-white p-6 shadow-md">
        <h1 className="text-xl font-semibold text-gray-900">Flyer Builder</h1>
        <p className="mt-1 text-sm text-gray-600">Portrait (1080×1350)</p>

        <div className="mt-6 space-y-3">
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
      <div className="lg:col-span-2">
        <FlyerPreview ref={flyerRef} formData={formData} images={images} />
      </div>
    </div>
  );
}
