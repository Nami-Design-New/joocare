"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import { useTranslations } from "next-intl";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface PdfViewerProps {
  url: string;
}

export default function PdfViewer({ url }: PdfViewerProps) {
  const t = useTranslations();
  const [numPages, setNumPages] = useState<number>(0);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [containerWidth, setContainerWidth] = useState(0);
  const fileUrl = useMemo(() => {
    if (url.startsWith("blob:") || url.startsWith("data:") || url.startsWith("/api/")) {
      return url;
    }

    if (/^https?:\/\//i.test(url)) {
      return `/api/pdf-proxy?url=${encodeURIComponent(url)}`;
    }

    return url;
  }, [url]);

  useEffect(() => {
    const element = containerRef.current;
    if (!element) return;

    const update = () => setContainerWidth(element.clientWidth);
    update();

    const observer = new ResizeObserver(() => update());
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  const pageWidth = Math.max(0, containerWidth);

  return (
    <div
      ref={containerRef}
      className="no-scrollbar mt-6 flex h-125 w-full flex-col items-center overflow-y-auto overflow-x-hidden text-4xl "
    >
      <Document
        file={fileUrl}
        onLoadSuccess={({ numPages }) => setNumPages(numPages)}
        loading={<p>{t("common.loading-pdf")}</p>}
        error={<p>{t("common.failed-load-pdf")}</p>}
      >
        {Array.from({ length: numPages }, (_, i) => (
          <Page
            key={i + 1}
            pageNumber={i + 1}
            className="mb-4"
            width={Math.min(pageWidth, 1000)}
          />
        ))}
      </Document>
    </div>
  );
}
