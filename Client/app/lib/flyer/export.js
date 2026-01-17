import { toPng } from "html-to-image";
import jsPDF from "jspdf";

export async function exportFlyerPNG(node, { filename }) {
  const dataUrl = await toPng(node, {
    backgroundColor: "#ffffff",
    pixelRatio: 3,
  });

  download(dataUrl, `${filename}.png`);
}

export async function exportFlyerPDF(node, { filename }) {
  const dataUrl = await toPng(node, {
    backgroundColor: "#ffffff",
    pixelRatio: 3,
  });

  const pdf = new jsPDF({
    orientation: "portrait",
    unit: "px",
    format: [node.offsetWidth, node.offsetHeight],
  });

  pdf.addImage(dataUrl, "PNG", 0, 0);
  pdf.save(`${filename}.pdf`);
}

function download(dataUrl, filename) {
  const a = document.createElement("a");
  a.href = dataUrl;
  a.download = filename;
  a.click();
}
