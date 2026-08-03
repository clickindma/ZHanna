"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { toast } from "sonner";
import {
  AlertTriangle,
  CheckCircle2,
  Download,
  FileSpreadsheet,
  Loader2,
  UploadCloud,
  XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { IMPORT_COLUMNS } from "@/lib/product-import";

interface ImportRowError {
  name: string;
  reason: string;
}

interface ImportReport {
  total: number;
  created: number;
  failed: ImportRowError[];
  duplicateSlugs: number;
  error?: string;
}

const REQUIRED_COLUMNS = [
  "name",
  "slug",
  "price",
  "stock",
  "sku",
  "category",
  "description",
  "materials",
  "isFeatured",
  "isNewArrival",
];

const OPTIONAL_COLUMNS = ["compareAtPrice", "images", "tags", "shortDescription"];

export function BulkImportForm() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [report, setReport] = useState<ImportReport | null>(null);

  async function handleFile(file: File | undefined) {
    if (!file) return;
    setFileName(file.name);
    setReport(null);

    if (!file.name.toLowerCase().endsWith(".csv")) {
      toast.error("Please upload a .csv file");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    setUploading(true);
    try {
      const res = await fetch("/api/admin/products/import", {
        method: "POST",
        body: formData,
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) {
        toast.error(data?.error ?? "Import failed");
        return;
      }
      setReport(data.report);
      toast.success(
        data.report.created === 0
          ? "No products imported"
          : `${data.report.created} product${data.report.created === 1 ? "" : "s"} imported`
      );
    } catch {
      toast.error("Could not reach the import service");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-lg">
            <h2 className="flex items-center gap-2 font-playfair text-lg text-navy">
              <FileSpreadsheet className="h-5 w-5 text-gold-dark" />
              Upload your catalogue
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Start with our template so the columns match exactly. Every row is validated
              before anything is saved — invalid rows are reported back, never silently dropped.
            </p>

            <div className="mt-4 rounded-lg border border-slate-200 bg-ice/50 p-4">
              <p className="text-xs font-semibold tracking-wider text-slate-500 uppercase">
                Required columns
              </p>
              <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
                {REQUIRED_COLUMNS.join(", ")}
              </p>
              <p className="mt-3 text-xs font-semibold tracking-wider text-slate-500 uppercase">
                Optional columns
              </p>
              <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
                {OPTIONAL_COLUMNS.join(", ")}
              </p>
              <p className="mt-3 text-xs text-slate-500">
                All {IMPORT_COLUMNS.length} template columns are shown below.
              </p>
            </div>
          </div>

          <div className="w-full shrink-0 lg:w-72">
            <Button
              render={<a href="/api/admin/products/template" download />}
              variant="outline"
              className="w-full border-slate-200 text-slate-600 hover:border-gold/40 hover:text-gold-dark"
            >
              <Download className="h-4 w-4" />
              Download CSV template
            </Button>
          </div>
        </div>

        <div
          className="mt-8 flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-300 bg-snow/60 px-6 py-12 text-center transition-colors hover:border-gold/50 hover:bg-snow"
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            handleFile(e.dataTransfer.files?.[0]);
          }}
        >
          <UploadCloud className="h-10 w-10 text-gold-dark" />
          <p className="mt-3 text-sm font-medium text-navy">
            {fileName ? fileName : "Drag & drop your CSV here"}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            or <span className="font-medium text-gold-dark underline">browse files</span> — up to 5 MB
          </p>
          <input
            ref={inputRef}
            type="file"
            accept=".csv,text/csv"
            className="hidden"
            onChange={(e) => handleFile(e.target.files?.[0])}
          />
        </div>

        {uploading && (
          <div className="mt-6 flex items-center justify-center gap-2 text-sm text-slate-500">
            <Loader2 className="h-4 w-4 animate-spin text-gold-dark" />
            Importing and validating rows…
          </div>
        )}
      </div>

      {report && !uploading && <ImportReportCard report={report} />}
    </div>
  );
}

function ImportReportCard({ report }: { report: ImportReport }) {
  const success = report.created;
  const failed = report.failed.length;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-100 p-6">
        <h2 className="flex items-center gap-2 font-playfair text-lg text-navy">
          {failed === 0 ? (
            <CheckCircle2 className="h-5 w-5 text-emerald-600" />
          ) : (
            <AlertTriangle className="h-5 w-5 text-amber-600" />
          )}
          Import report
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          {report.total} row{report.total === 1 ? "" : "s"} processed.
        </p>
      </div>

      <div className="grid gap-4 p-6 sm:grid-cols-3">
        <div className="rounded-xl bg-ice/60 p-4">
          <p className="text-2xl font-bold text-navy">{report.total}</p>
          <p className="text-xs text-muted-foreground">Rows in file</p>
        </div>
        <div className="rounded-xl bg-emerald-50 p-4">
          <p className="text-2xl font-bold text-emerald-700">{success}</p>
          <p className="text-xs text-muted-foreground">Products created</p>
        </div>
        <div className="rounded-xl bg-red-50 p-4">
          <p className="text-2xl font-bold text-red-600">{failed}</p>
          <p className="text-xs text-muted-foreground">
            Rows skipped
            {report.duplicateSlugs > 0 && (
              <span className="block text-[11px]">({report.duplicateSlugs} duplicate slug{report.duplicateSlugs === 1 ? "" : "s"})</span>
            )}
          </p>
        </div>
      </div>

      {failed > 0 && (
        <div className="border-t border-slate-100 p-6">
          <h3 className="flex items-center gap-2 text-sm font-semibold text-navy">
            <XCircle className="h-4 w-4 text-red-500" />
            Failed rows &amp; reasons
          </h3>
          <ul className="mt-3 max-h-72 space-y-2 overflow-y-auto pr-2">
            {report.failed.map((row, index) => (
              <li
                key={`${row.name}-${index}`}
                className="rounded-lg border border-slate-100 bg-snow px-3 py-2 text-sm"
              >
                <span className="font-medium text-navy">{row.name || "Unnamed row"}</span>
                <span className="text-muted-foreground"> — {row.reason}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="flex justify-end border-t border-slate-100 p-6">
        <Button render={<Link href="/admin/products" />} className="bg-navy text-white hover:bg-navy-mid">
          Back to products
        </Button>
      </div>
    </div>
  );
}
