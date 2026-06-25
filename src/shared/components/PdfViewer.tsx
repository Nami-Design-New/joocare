"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import mammoth from "mammoth";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import { useTranslations } from "next-intl";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface PdfViewerProps {
  url: string;
  fileName?: string;
}

function getFileExtension(source: string) {
  const cleanSource = source.split(/[?#]/)[0];
  const fileName = cleanSource.split("/").filter(Boolean).pop() ?? "";
  const dotIndex = fileName.lastIndexOf(".");

  if (dotIndex === -1) {
    return "";
  }

  return fileName.slice(dotIndex).toLowerCase();
}

function buildDocxSrcDoc(bodyHtml: string) {
  return `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <style>
      :root {
        color-scheme: light;
      }

      html,
      body {
        margin: 0;
        padding: 0;
        background: #fff;
        color: #111827;
        font-family: Arial, Helvetica, sans-serif;
        line-height: 1.6;
      }

      body {
        padding: 24px;
      }

      .docx-page {
        max-width: 900px;
        margin: 0 auto;
      }

      img {
        max-width: 100%;
        height: auto;
      }

      table {
        width: 100%;
        border-collapse: collapse;
      }

      td,
      th {
        border: 1px solid #e5e7eb;
        padding: 8px;
        vertical-align: top;
      }

      a {
        color: #2563eb;
      }
    </style>
  </head>
  <body>
    <div class="docx-page">${bodyHtml}</div>
  </body>
</html>`;
}

export default function PdfViewer({ url, fileName }: PdfViewerProps) {
  const t = useTranslations();
  const [numPages, setNumPages] = useState<number>(0);
  const [docxHtml, setDocxHtml] = useState<string | null>(null);
  const [docxSourceUrl, setDocxSourceUrl] = useState<string | null>(null);
  const [docxPreviewStatus, setDocxPreviewStatus] = useState<
    "loading" | "ready" | "unavailable"
  >("loading");
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
  const fileExtension = useMemo(
    () => getFileExtension(fileName ?? url) || getFileExtension(url) || getFileExtension(fileUrl),
    [fileName, url, fileUrl],
  );
  const isDocx = fileExtension === ".docx";

  useEffect(() => {
    const element = containerRef.current;
    if (!element) return;

    const update = () => setContainerWidth(element.clientWidth);
    update();

    const observer = new ResizeObserver(() => update());
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    let cancelled = false;

    queueMicrotask(() => {
      if (cancelled || !isDocx) {
        return;
      }

      setDocxPreviewStatus("loading");
      setDocxHtml(null);

      void (async () => {
        try {
          const response = await fetch(fileUrl, { cache: "no-store" });

          if (!response.ok) {
            throw new Error("Failed to load document.");
          }

          const arrayBuffer = await response.arrayBuffer();
          const result = await mammoth.convertToHtml({ arrayBuffer });

          if (cancelled) {
            return;
          }

          setDocxHtml(buildDocxSrcDoc(result.value));
          setDocxSourceUrl(fileUrl);
          setDocxPreviewStatus("ready");
        } catch {
          if (cancelled) {
            return;
          }

          setDocxHtml(null);
          setDocxSourceUrl(null);
          setDocxPreviewStatus("unavailable");
        }
      })();
    });

    return () => {
      cancelled = true;
    };
  }, [fileUrl, isDocx]);

  const pageWidth = Math.max(0, containerWidth);
  const isDocxReady = docxPreviewStatus === "ready" && docxHtml && docxSourceUrl === fileUrl;
  const isDocxLoading =
    docxPreviewStatus === "loading" ||
    (docxPreviewStatus === "ready" && docxSourceUrl !== fileUrl);

  if (isDocx) {
    return (
      <div
        ref={containerRef}
        className="no-scrollbar mt-6 flex h-125 w-full flex-col items-center overflow-y-auto overflow-x-hidden text-4xl"
      >
        {isDocxReady ? (
          <iframe
            title="DOCX preview"
            srcDoc={docxHtml}
            sandbox=""
            className="h-full min-h-125 w-full rounded-2xl  bg-background"
          />
        ) : isDocxLoading ? (
          <p className="text-muted-foreground flex h-125 w-full items-center justify-center rounded-2xl border border-dashed p-6 text-sm">
            {t("common.loading-document")}
          </p>
        ) : (
          <div className="text-muted-foreground flex h-125 w-full items-center justify-center rounded-2xl border border-dashed p-6 text-sm">
            {t("common.failed-load-document")}
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="no-scrollbar mt-6 flex h-125 w-full flex-col items-center overflow-y-auto overflow-x-hidden text-4xl"
    >
      <Document
        file={fileUrl}
        onLoadSuccess={({ numPages }) => setNumPages(numPages)}
        loading={<p>{t("common.loading-document")}</p>}
        error={<p>{t("common.failed-load-document")}</p>}
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
