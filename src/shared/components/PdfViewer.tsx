"use client";

import { useMemo, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface PdfViewerProps {
  url: string;
}

export default function PdfViewer({ url }: PdfViewerProps) {
  const [numPages, setNumPages] = useState<number>(0);
  const fileUrl = useMemo(() => {
    if (url.startsWith("blob:") || url.startsWith("data:") || url.startsWith("/api/")) {
      return url;
    }

    if (/^https?:\/\//i.test(url)) {
      return `/api/pdf-proxy?url=${encodeURIComponent(url)}`;
    }

    return url;
  }, [url]);

  return (
    <div className="no-scrollbar mt-10 flex h-125 flex-col items-center overflow-scroll">
      <Document
        file={fileUrl}
        onLoadSuccess={({ numPages }) => setNumPages(numPages)}
        loading={<p>Loading PDF...</p>}
        error={<p>Failed to load PDF.</p>}
      >
        {Array.from({ length: numPages }, (_, i) => (
          <Page key={i + 1} pageNumber={i + 1} className="mb-4" />
        ))}
      </Document>
    </div>
  );
}
