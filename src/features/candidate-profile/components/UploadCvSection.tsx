"use client"

import { useRef, useState } from "react"
import Image from "next/image"
import { Button } from "@/shared/components/ui/button"
import { File, Eye } from "lucide-react"
import CVModal from "./CVModal"

const UploadCvSection = () => {
  const [cvFile, setCvFile] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const [open, setOpen] = useState(false);

  // open file picker
  const handleUploadClick = () => {
    fileInputRef.current?.click()
    setOpen(false);
  }

  // handle file change
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // allow only PDF
    if (file.type !== "application/pdf") {
      alert("Only PDF files are allowed")
      return
    }

    setCvFile(file)
  }

  // view file
  const handleView = () => {
    if (!cvFile) return
    // const url = URL.createObjectURL(cvFile)
    // window.open(url, "_blank")
    setOpen(true);

  }

  // download file
  const handleDownload = () => {
    if (!cvFile) return
    const url = URL.createObjectURL(cvFile)

    const a = document.createElement("a")
    a.href = url
    a.download = cvFile.name
    a.click()
  }

  const handleDelete = () => {
    setCvFile(null)
  }


  return (
    <section className="flex flex-col gap-2 p-6 bg-[#09760A05]">
      {/* hidden input */}
      <input
        type="file"
        accept=".pdf"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
      />

      {!cvFile ? (
        // ================= NO CV =================
        <Button
          variant="outline"
          size="pill"
          onClick={handleUploadClick}
        >
          Upload CV
        </Button>
      ) : (
        // ================= HAS CV =================
        <>
          {/* File Info */}
          <div className="rounded-[8px] p-5 flex justify-center items-center shadow bg-white gap-2">
            <Image
              src={"/assets/pdf_file.svg"}
              alt="pdf"
              width={24}
              height={24}
            />

            <span className="text-sm">{cvFile.name}</span>

            <span className="text-primary text-sm font-semibold">
              {(cvFile.size / (1024 * 1024)).toFixed(1)}MB
            </span>
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <Button
              variant="secondary"
              onClick={handleDownload}
              className="flex-1 flex items-center justify-center gap-1 h-8 text-[12px] rounded-full"
            >
              <File className="w-3 h-3" />
              Download
            </Button>

            <Button
              variant="outline"
              onClick={handleView}
              className="flex-1 flex items-center justify-center gap-1 h-8 text-[12px] rounded-full"
            >
              <Eye className="w-3 h-3" />
              View
            </Button>
          </div>

        </>
      )}

      {cvFile && <CVModal open={open} onOpenChange={setOpen} title={"View Cv"} url={URL.createObjectURL(cvFile)} handleDownload={handleDownload} handleUploadClick={handleUploadClick}
        handleDelete={handleDelete} />}

    </section>
  )
}

export default UploadCvSection