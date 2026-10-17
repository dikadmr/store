"use client";

import { useState, useEffect, useCallback } from "react";
import { WebsiteType } from "./website-type";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { clientServices, type Client } from "@/services/client";
import { orderServices } from "@/services/order";
import { projectServices } from "@/services/project";
import { useSession } from "next-auth/react";
import { uploadServices } from "@/services/upload";
import { useRouter } from "next/navigation";

export interface PageSection {
  id: number;
  name: string;
  description: string;
}

export interface BasicOrderData {
  sections: PageSection[];
  selectedFooterElements: string[];
  whatsappButton: boolean | null;
  googleMaps: boolean | null;
  assets: File[];
}

export type ExportType = "pdf" | "excel" | "none";

export interface ProfessionalOrderData {
  needsAdminPanel: boolean | null;
  adminManagedContent: string;
  needsAdminLogin: boolean | null;
  exportType: ExportType | null;
}

export interface EnterpriseOrderData {
  systemDescription: string;
  businessProblem: string;
  mainModules: string;
  userRoles: string;
  apiIntegrations: string;
}

interface FooterElement {
  value: string;
  label: string;
  description: string;
}

const FOOTER_OPTIONS: FooterElement[] = [
  {
    value: "contact",
    label: "Kontak singkat",
    description: "Nomor telepon, email, atau alamat bisnis",
  },
  {
    value: "social",
    label: "Sosial media",
    description: "Link ke Instagram, Facebook, TikTok, dll.",
  },
  {
    value: "logo",
    label: "Logo & tagline",
    description: "Identitas brand Anda di bagian footer",
  },
  {
    value: "nav",
    label: "Navigasi singkat",
    description: "Link cepat ke halaman-halaman utama",
  },
  {
    value: "hours",
    label: "Jam operasional",
    description: "Tampilkan jam buka/tutup bisnis Anda",
  },
  {
    value: "whatsapp",
    label: "Tombol WhatsApp",
    description: "CTA langsung ke WhatsApp bisnis Anda",
  },
  {
    value: "copyright",
    label: "Copyright",
    description: "Teks hak cipta dan nama bisnis/tahun",
  },
  {
    value: "map",
    label: "Google Maps mini",
    description: "Peta lokasi bisnis Anda di footer",
  },
];

const MAX_SECTIONS = 6;
const MIN_FOOTER = 2;
const MAX_FILES = 10;
const MAX_FILE_SIZE_MB = 10;

const BAD_NAME_PATTERN =
  /^(img_|dsc|image|untitled|screenshot|photo|file|document|pic)\d*/i;

const FILE_NAME_EXAMPLES = [
  "logo.png",
  "logo-putih.png",
  "banner-hero.jpg",
  "foto-produk-1.jpg",
  "foto-tim.jpg",
  "icon-layanan.svg",
  "background-about.jpg",
];

function isBadFileName(name: string): boolean {
  const base = name.replace(/\.[^.]+$/, "");
  return BAD_NAME_PATTERN.test(base) || base.length < 3;
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1_048_576) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / 1_048_576).toFixed(1)} MB`;
}

function InfoBox({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex gap-3 rounded-md border border-gray-200 bg-gray-100 px-4 py-3 text-sm text-gray-800">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="mt-0.5 shrink-0 text-gray-500"
        aria-hidden="true"
      >
        <circle cx="12" cy="12" r="10" />
        <path d="M12 16v-4M12 8h.01" />
      </svg>
      <p className="leading-relaxed">{children}</p>
    </div>
  );
}

function WarnBox({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex gap-3 rounded-md border border-yellow-200 bg-yellow-50 px-4 py-3 text-sm text-yellow-800">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="mt-0.5 shrink-0 text-yellow-500"
        aria-hidden="true"
      >
        <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
        <path d="M12 9v4M12 17h.01" />
      </svg>
      <p className="leading-relaxed">{children}</p>
    </div>
  );
}

export function HelperText({ children }: { children: React.ReactNode }) {
  return <p className="mt-1 text-xs text-muted-foreground">{children}</p>;
}

function InlineTooltip({ text }: { text: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative inline-block">
      <button
        type="button"
        className="flex h-4 w-4 items-center justify-center rounded-full border border-border bg-muted text-[10px] text-muted-foreground hover:border-border-strong hover:text-foreground"
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
        aria-label="Info"
      >
        ?
      </button>
      {open && (
        <div className="absolute left-6 -top-1 z-10 w-56 rounded-md border border-border bg-popover px-3 py-2 text-xs text-popover-foreground shadow-md">
          {text}
        </div>
      )}
    </div>
  );
}

function SectionCard({
  section,
  index,
  total,
  onChange,
  onRemove,
}: {
  section: PageSection;
  index: number;
  total: number;
  onChange: (id: number, field: keyof PageSection, value: string) => void;
  onRemove: (id: number) => void;
}) {
  return (
    <div className="rounded-md border border-border bg-muted/30 p-4">
      <div className="mb-3 flex items-center justify-between">
        <span className="rounded-md border border-gray-200 bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-700">
          Section {index + 1}
        </span>
        {total > 1 && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-7 px-2 text-xs text-muted-foreground hover:bg-red-50 hover:text-red-600"
            onClick={() => onRemove(section.id)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="13"
              height="13"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mr-1"
              aria-hidden="true"
            >
              <path d="M3 6h18M19 6l-1 14H6L5 6M10 11v6M14 11v6M9 6V4h6v2" />
            </svg>
            Hapus
          </Button>
        )}
      </div>

      <FieldGroup>
        <Field>
          <div className="flex items-center gap-1.5">
            <Label>Nama section</Label>
            <InlineTooltip text="Gunakan nama yang mudah dimengerti. Contoh: Beranda, Tentang Kami, Layanan, Produk, FAQ, atau Kontak." />
          </div>
          <Input
            value={section.name}
            onChange={(e) => onChange(section.id, "name", e.target.value)}
            placeholder="Contoh: Beranda, Tentang Kami, Layanan..."
          />
          <HelperText>
            Nama ini akan menjadi judul atau navigasi halaman di website Anda.
          </HelperText>
        </Field>

        <Field>
          <Label>Konten / isi section ini</Label>
          <Textarea
            value={section.description}
            onChange={(e) =>
              onChange(section.id, "description", e.target.value)
            }
            placeholder="Jelaskan apa yang ingin ditampilkan di section ini. Contoh: menampilkan foto produk unggulan, tagline bisnis, dan tombol hubungi kami."
            rows={3}
          />
          <HelperText>
            Semakin detail penjelasan Anda, semakin mudah tim kami memahami
            kebutuhan Anda.
          </HelperText>
        </Field>
      </FieldGroup>
    </div>
  );
}

function ChoiceCard({
  option,
  selected,
  onToggle,
}: {
  option: FooterElement;
  selected: boolean;
  onToggle: (value: string) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onToggle(option.value)}
      className={[
        "flex w-full items-start gap-3 rounded-md border p-3 text-left transition-colors",
        selected
          ? "border-blue-300 bg-blue-50"
          : "border-border bg-card hover:border-border-strong hover:bg-muted/40",
      ].join(" ")}
      aria-pressed={selected}
    >
      <div
        className={[
          "mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded border",
          selected
            ? "border-blue-500 bg-blue-500 text-white"
            : "border-border bg-background",
        ].join(" ")}
      >
        {selected && (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="10"
            height="10"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M20 6 9 17l-5-5" />
          </svg>
        )}
      </div>
      <div>
        <p
          className={`text-sm font-medium ${selected ? "text-blue-800" : "text-foreground"}`}
        >
          {option.label}
        </p>
        <p className="mt-0.5 text-xs text-muted-foreground">
          {option.description}
        </p>
      </div>
    </button>
  );
}

function FileItem({ file, onRemove }: { file: File; onRemove: () => void }) {
  const bad = isBadFileName(file.name);

  return (
    <div className="flex items-center gap-3 rounded-md border border-border bg-muted/30 px-3 py-2">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-blue-200 bg-blue-50 text-blue-500">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
          <path d="M14 2v4a2 2 0 0 0 2 2h4" />
        </svg>
      </div>
      <div className="min-w-0 flex-1">
        <p
          className={`truncate text-sm font-medium ${bad ? "text-yellow-700" : "text-foreground"}`}
        >
          {file.name}
        </p>
        <p className="text-xs text-muted-foreground">
          {formatFileSize(file.size)}
        </p>
        {bad && (
          <p className="mt-0.5 flex items-center gap-1 text-xs text-yellow-600">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="11"
              height="11"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
              <path d="M12 9v4M12 17h.01" />
            </svg>
            Nama file kurang deskriptif — pertimbangkan untuk mengubahnya.
          </p>
        )}
      </div>
      <button
        type="button"
        onClick={onRemove}
        className="shrink-0 rounded p-1 text-muted-foreground hover:bg-red-50 hover:text-red-500"
        aria-label={`Hapus ${file.name}`}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="15"
          height="15"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M18 6 6 18M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}

const ALLOWED_TYPES = [
  "image/png",
  "image/jpeg",
  "image/webp",
  "image/svg+xml",
];

function FileUploadSection({
  files,
  onChange,
}: {
  files: File[];
  onChange: (files: File[]) => void;
}) {
  const [isDragging, setIsDragging] = useState(false);

  const addFiles = useCallback(
    (incoming: FileList | File[]) => {
      const arr = Array.from(incoming);
      const filtered = arr.filter((f) => {
        const alreadyAdded = files.some(
          (x) => x.name === f.name && x.size === f.size,
        );
        const tooLarge = f.size > MAX_FILE_SIZE_MB * 1_048_576;
        const wrongType = !ALLOWED_TYPES.includes(f.type);
        return !alreadyAdded && !tooLarge && !wrongType;
      });
      onChange([...files, ...filtered].slice(0, MAX_FILES));
    },
    [files, onChange],
  );

  const removeFile = (index: number) => {
    onChange(files.filter((_, i) => i !== index));
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    addFiles(e.dataTransfer.files);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      addFiles(e.target.files);
      e.target.value = "";
    }
  };

  const canAddMore = files.length < MAX_FILES;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Aset & file pendukung</CardTitle>
        <p className="text-sm text-muted-foreground">
          Upload gambar, logo, atau file lain yang dibutuhkan untuk website
          Anda.
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <InfoBox>
          Gunakan{" "}
          <strong className="font-medium">
            nama file yang jelas dan deskriptif
          </strong>{" "}
          sebelum mengupload. Contoh:{" "}
          <code className="rounded bg-blue-100 px-1 py-0.5 text-xs">
            logo.png
          </code>
          ,{" "}
          <code className="rounded bg-blue-100 px-1 py-0.5 text-xs">
            banner-hero.jpg
          </code>
          ,{" "}
          <code className="rounded bg-blue-100 px-1 py-0.5 text-xs">
            foto-produk-1.jpg
          </code>
          . Hal ini membantu tim kami menempatkan file di posisi yang tepat.
        </InfoBox>

        <WarnBox>
          Hindari nama seperti{" "}
          <code className="rounded bg-yellow-100 px-1 py-0.5 text-xs">
            IMG_0012.jpg
          </code>{" "}
          atau{" "}
          <code className="rounded bg-yellow-100 px-1 py-0.5 text-xs">
            Untitled.png
          </code>{" "}
          — nama file yang tidak jelas dapat menyebabkan penempatan yang salah
          di website Anda.
        </WarnBox>

        {canAddMore && (
          <div
            onDrop={handleDrop}
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onClick={() =>
              document.getElementById("file-upload-input")?.click()
            }
            role="button"
            tabIndex={0}
            aria-label="Upload file"
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ")
                document.getElementById("file-upload-input")?.click();
            }}
            className={[
              "flex cursor-pointer flex-col items-center gap-2 rounded-md border-2 border-dashed px-4 py-8 text-center transition-colors",
              isDragging
                ? "border-blue-400 bg-blue-50"
                : "border-border hover:border-blue-300 hover:bg-muted/30",
            ].join(" ")}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={isDragging ? "text-blue-500" : "text-muted-foreground"}
              aria-hidden="true"
            >
              <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242" />
              <path d="M12 12v9" />
              <path d="m16 16-4-4-4 4" />
            </svg>
            <p className="text-sm text-muted-foreground">
              Seret file ke sini, atau{" "}
              <span className="font-medium text-blue-600">pilih file</span>
            </p>
            <p className="text-xs text-muted-foreground">
              JPG, PNG, WEBP, SVG — maks. {MAX_FILE_SIZE_MB} MB per file
            </p>
          </div>
        )}

        <input
          id="file-upload-input"
          type="file"
          multiple
          accept="image/png,image/jpeg,image/webp,image/svg+xml"
          className="hidden"
          onChange={handleInputChange}
        />

        <div className="rounded-md border border-border bg-muted/20 px-3 py-2.5">
          <p className="mb-2 text-xs font-medium text-muted-foreground">
            Contoh penamaan file yang baik
          </p>
          <div className="flex flex-wrap gap-1.5">
            {FILE_NAME_EXAMPLES.map((name) => (
              <code
                key={name}
                className="rounded border border-border bg-background px-2 py-0.5 text-xs text-muted-foreground"
              >
                {name}
              </code>
            ))}
          </div>
        </div>

        {files.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium">File yang diupload</p>
              <span className="text-xs text-muted-foreground">
                {files.length} / {MAX_FILES} file
              </span>
            </div>
            {files.map((file, index) => (
              <FileItem
                key={`${file.name}-${file.size}-${index}`}
                file={file}
                onRemove={() => removeFile(index)}
              />
            ))}
            {canAddMore && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="w-full"
                onClick={() =>
                  document.getElementById("file-upload-input")?.click()
                }
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="mr-1.5"
                  aria-hidden="true"
                >
                  <path d="M5 12h14M12 5v14" />
                </svg>
                Tambah file lain
              </Button>
            )}
            {!canAddMore && (
              <p className="text-center text-xs text-muted-foreground">
                Maksimal {MAX_FILES} file telah tercapai.
              </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function BasicOrderFields({
  onChange,
}: {
  onChange: (data: BasicOrderData) => void;
}) {
  const [sections, setSections] = useState<PageSection[]>([
    {
      id: 1,
      name: "",
      description: "",
    },
  ]);

  const [nextId, setNextId] = useState(2);

  const [selectedFooter, setSelectedFooter] = useState<string[]>([
    "contact",
    "social",
  ]);

  const [footerError, setFooterError] = useState(false);

  const [whatsappButton, setWhatsappButton] = useState<boolean | null>(null);

  const [googleMaps, setGoogleMaps] = useState<boolean | null>(null);

  const [assets, setAssets] = useState<File[]>([]);

  const emit = (
    updatedSections: PageSection[],
    updatedFooter: string[],
    updatedWa: boolean | null,
    updatedMaps: boolean | null,
    updatedAssets: File[],
  ) => {
    onChange({
      sections: updatedSections,
      selectedFooterElements: updatedFooter,
      whatsappButton: updatedWa,
      googleMaps: updatedMaps,
      assets: updatedAssets,
    });
  };

  const handleSectionChange = (
    id: number,
    field: keyof PageSection,
    value: string,
  ) => {
    const updated = sections.map((section) =>
      section.id === id
        ? {
            ...section,
            [field]: value,
          }
        : section,
    );

    setSections(updated);

    emit(updated, selectedFooter, whatsappButton, googleMaps, assets);
  };

  const addSection = () => {
    if (sections.length >= MAX_SECTIONS) {
      return;
    }

    const newSection: PageSection = {
      id: nextId,
      name: "",
      description: "",
    };

    const updated = [...sections, newSection];

    setSections(updated);

    setNextId((current) => current + 1);

    emit(updated, selectedFooter, whatsappButton, googleMaps, assets);
  };

  const removeSection = (id: number) => {
    if (sections.length <= 1) {
      return;
    }

    const updated = sections.filter((section) => section.id !== id);

    setSections(updated);

    emit(updated, selectedFooter, whatsappButton, googleMaps, assets);
  };

  const toggleFooter = (value: string) => {
    const isSelected = selectedFooter.includes(value);

    if (isSelected && selectedFooter.length <= MIN_FOOTER) {
      setFooterError(true);
      return;
    }

    setFooterError(false);

    const updated = isSelected
      ? selectedFooter.filter((item) => item !== value)
      : [...selectedFooter, value];

    setSelectedFooter(updated);

    emit(sections, updated, whatsappButton, googleMaps, assets);
  };

  const handleWhatsAppChange = (value: string) => {
    const enabled = value === "yes";

    setWhatsappButton(enabled);

    emit(sections, selectedFooter, enabled, googleMaps, assets);
  };

  const handleGoogleMapsChange = (value: string) => {
    const enabled = value === "yes";

    setGoogleMaps(enabled);

    emit(sections, selectedFooter, whatsappButton, enabled, assets);
  };

  const handleAssetsChange = (files: File[]) => {
    setAssets(files);

    emit(sections, selectedFooter, whatsappButton, googleMaps, files);
  };

  const canAddSection = sections.length < MAX_SECTIONS;

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Kebutuhan Website Basic</CardTitle>

          <p className="text-sm text-muted-foreground">
            Tentukan halaman dan section apa saja yang Anda butuhkan.
          </p>
        </CardHeader>

        <CardContent className="space-y-4">
          <InfoBox>Pilih 1–6 halaman atau section untuk website Anda.</InfoBox>

          <div className="flex items-center justify-between">
            <p className="text-sm font-medium">Daftar section / halaman</p>

            <span className="text-xs text-muted-foreground">
              {sections.length} / {MAX_SECTIONS} section
            </span>
          </div>

          <div className="space-y-3">
            {sections.map((section, index) => (
              <SectionCard
                key={section.id}
                section={section}
                index={index}
                total={sections.length}
                onChange={handleSectionChange}
                onRemove={removeSection}
              />
            ))}
          </div>

          {canAddSection ? (
            <Button
              type="button"
              variant="outline"
              className="w-full border-dashed"
              onClick={addSection}
            >
              Tambah section
            </Button>
          ) : (
            <p className="text-center text-xs text-muted-foreground">
              Maksimal {MAX_SECTIONS} section telah tercapai.
            </p>
          )}

          <div className="space-y-4 border-t border-border pt-4">
            <div>
              <p className="text-sm font-medium">Footer website</p>

              <p className="mt-0.5 text-xs text-muted-foreground">
                Pilih elemen yang ingin ditampilkan di bagian bawah website.
              </p>
            </div>

            <InfoBox>Minimal {MIN_FOOTER} elemen footer harus dipilih.</InfoBox>

            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {FOOTER_OPTIONS.map((option) => (
                <ChoiceCard
                  key={option.value}
                  option={option}
                  selected={selectedFooter.includes(option.value)}
                  onToggle={toggleFooter}
                />
              ))}
            </div>

            {footerError ? (
              <p className="text-xs text-red-500">
                Minimal {MIN_FOOTER} elemen footer harus dipilih.
              </p>
            ) : (
              <p className="text-xs text-muted-foreground">
                {selectedFooter.length} elemen dipilih.
              </p>
            )}
          </div>

          <div className="space-y-4 border-t border-border pt-4">
            <Field>
              <Label>Butuh WhatsApp Button?</Label>

              <HelperText>
                Tombol mengambang untuk menghubungi WhatsApp Anda.
              </HelperText>

              <RadioGroup
                value={
                  whatsappButton === null ? "" : whatsappButton ? "yes" : "no"
                }
                onValueChange={handleWhatsAppChange}
                className="mt-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="yes" id="wa-yes" />

                  <Label htmlFor="wa-yes">Ya</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="no" id="wa-no" />

                  <Label htmlFor="wa-no">Tidak</Label>
                </div>
              </RadioGroup>
            </Field>

            <Field>
              <Label>Butuh Google Maps?</Label>

              <HelperText>Embed peta lokasi bisnis Anda.</HelperText>

              <RadioGroup
                value={googleMaps === null ? "" : googleMaps ? "yes" : "no"}
                onValueChange={handleGoogleMapsChange}
                className="mt-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="yes" id="maps-yes" />

                  <Label htmlFor="maps-yes">Ya</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="no" id="maps-no" />

                  <Label htmlFor="maps-no">Tidak</Label>
                </div>
              </RadioGroup>
            </Field>
          </div>
        </CardContent>
      </Card>

      <FileUploadSection files={assets} onChange={handleAssetsChange} />
    </div>
  );
}

/**
 * ============================================================
 * PROFESSIONAL — direfactor agar controlled, mengikuti pola
 * BasicOrderFields: state lokal + emit() ke parent via onChange.
 * ============================================================
 */
function ProfessionalOrderFields({
  onChange,
}: {
  onChange: (data: ProfessionalOrderData) => void;
}) {
  const [needsAdminPanel, setNeedsAdminPanel] = useState<boolean | null>(null);
  const [adminManagedContent, setAdminManagedContent] = useState("");
  const [needsAdminLogin, setNeedsAdminLogin] = useState<boolean | null>(null);
  const [exportType, setExportType] = useState<ExportType | null>(null);

  const emit = ({
    updatedNeedsAdminPanel = needsAdminPanel,
    updatedAdminManagedContent = adminManagedContent,
    updatedNeedsAdminLogin = needsAdminLogin,
    updatedExportType = exportType,
  }: {
    updatedNeedsAdminPanel?: boolean | null;
    updatedAdminManagedContent?: string;
    updatedNeedsAdminLogin?: boolean | null;
    updatedExportType?: ExportType | null;
  }) => {
    onChange({
      needsAdminPanel: updatedNeedsAdminPanel,
      adminManagedContent: updatedAdminManagedContent,
      needsAdminLogin: updatedNeedsAdminLogin,
      exportType: updatedExportType,
    });
  };

  const handleAdminPanelChange = (value: string) => {
    const enabled = value === "yes";
    setNeedsAdminPanel(enabled);
    emit({ updatedNeedsAdminPanel: enabled });
  };

  const handleAdminManagedContentChange = (value: string) => {
    setAdminManagedContent(value);
    emit({ updatedAdminManagedContent: value });
  };

  const handleAdminLoginChange = (value: string) => {
    const enabled = value === "yes";
    setNeedsAdminLogin(enabled);
    emit({ updatedNeedsAdminLogin: enabled });
  };

  const handleExportTypeChange = (value: string) => {
    const typed = value as ExportType;
    setExportType(typed);
    emit({ updatedExportType: typed });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Kebutuhan Website Professional</CardTitle>
        <p className="text-sm text-muted-foreground">
          Tentukan kebutuhan admin panel dan pengelolaan data untuk website
          Anda.
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <FieldGroup>
          <Field>
            <Label>Butuh Admin Panel?</Label>
            <HelperText>
              Halaman khusus untuk mengelola konten website tanpa perlu
              menghubungi developer.
            </HelperText>
            <RadioGroup
              value={
                needsAdminPanel === null ? "" : needsAdminPanel ? "yes" : "no"
              }
              onValueChange={handleAdminPanelChange}
              className="mt-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yes" id="admin-panel-yes" />
                <Label htmlFor="admin-panel-yes">Ya</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id="admin-panel-no" />
                <Label htmlFor="admin-panel-no">Tidak</Label>
              </div>
            </RadioGroup>
          </Field>

          <Field>
            <Label>Konten yang Dikelola Admin</Label>
            <Textarea
              value={adminManagedContent}
              onChange={(e) => handleAdminManagedContentChange(e.target.value)}
              placeholder="Contoh: Artikel, Galeri, Produk, Layanan, Data Anggota"
            />
          </Field>

          <Field>
            <Label>Butuh Login Admin?</Label>
            <RadioGroup
              value={
                needsAdminLogin === null ? "" : needsAdminLogin ? "yes" : "no"
              }
              onValueChange={handleAdminLoginChange}
              className="mt-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yes" id="admin-login-yes" />
                <Label htmlFor="admin-login-yes">Ya</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id="admin-login-no" />
                <Label htmlFor="admin-login-no">Tidak</Label>
              </div>
            </RadioGroup>
          </Field>

          <Field>
            <Label>Butuh Export Data?</Label>
            <RadioGroup
              value={exportType ?? ""}
              onValueChange={handleExportTypeChange}
              className="mt-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="pdf" id="export-pdf" />
                <Label htmlFor="export-pdf">PDF</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="excel" id="export-excel" />
                <Label htmlFor="export-excel">Excel</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="none" id="export-none" />
                <Label htmlFor="export-none">Tidak Perlu</Label>
              </div>
            </RadioGroup>
          </Field>
        </FieldGroup>
      </CardContent>
    </Card>
  );
}

function EnterpriseOrderFields({
  onChange,
}: {
  onChange: (data: EnterpriseOrderData) => void;
}) {
  const [systemDescription, setSystemDescription] = useState("");
  const [businessProblem, setBusinessProblem] = useState("");
  const [mainModules, setMainModules] = useState("");
  const [userRoles, setUserRoles] = useState("");
  const [apiIntegrations, setApiIntegrations] = useState("");

  const emit = ({
    updatedSystemDescription = systemDescription,
    updatedBusinessProblem = businessProblem,
    updatedMainModules = mainModules,
    updatedUserRoles = userRoles,
    updatedApiIntegrations = apiIntegrations,
  }: {
    updatedSystemDescription?: string;
    updatedBusinessProblem?: string;
    updatedMainModules?: string;
    updatedUserRoles?: string;
    updatedApiIntegrations?: string;
  }) => {
    onChange({
      systemDescription: updatedSystemDescription,
      businessProblem: updatedBusinessProblem,
      mainModules: updatedMainModules,
      userRoles: updatedUserRoles,
      apiIntegrations: updatedApiIntegrations,
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Kebutuhan Sistem Enterprise</CardTitle>
        <p className="text-sm text-muted-foreground">
          Jelaskan sistem custom yang ingin dibangun agar tim kami dapat
          menyusun estimasi yang tepat.
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <FieldGroup>
          <Field>
            <Label>Deskripsi Sistem yang Diinginkan</Label>
            <Textarea
              value={systemDescription}
              onChange={(e) => {
                setSystemDescription(e.target.value);
                emit({ updatedSystemDescription: e.target.value });
              }}
              placeholder="Jelaskan sistem atau aplikasi custom yang ingin dibuat"
            />
          </Field>

          <Field>
            <Label>Masalah Bisnis yang Ingin Diselesaikan</Label>
            <Textarea
              value={businessProblem}
              onChange={(e) => {
                setBusinessProblem(e.target.value);
                emit({ updatedBusinessProblem: e.target.value });
              }}
              placeholder="Jelaskan masalah utama dalam bisnis/proses kerja Anda"
            />
          </Field>

          <Field>
            <Label>Modul Utama</Label>
            <Textarea
              value={mainModules}
              onChange={(e) => {
                setMainModules(e.target.value);
                emit({ updatedMainModules: e.target.value });
              }}
              placeholder="Contoh: Dashboard, User Management, Order, Payment, Report"
            />
          </Field>

          <Field>
            <Label>Role User</Label>
            <Textarea
              value={userRoles}
              onChange={(e) => {
                setUserRoles(e.target.value);
                emit({ updatedUserRoles: e.target.value });
              }}
              placeholder="Contoh: Super Admin, Admin, Staff, Customer"
            />
          </Field>

          <Field>
            <Label>Integrasi API</Label>
            <Textarea
              value={apiIntegrations}
              onChange={(e) => {
                setApiIntegrations(e.target.value);
                emit({ updatedApiIntegrations: e.target.value });
              }}
              placeholder="Contoh: Payment Gateway, WhatsApp Gateway, Google Maps, ERP"
            />
          </Field>
        </FieldGroup>
      </CardContent>
    </Card>
  );
}

export function OrderDetailForm({
  packageId,
  packageName,
  websiteType,
  onBack,
}: {
  packageId: string;
  packageName: string;
  websiteType: WebsiteType;
  onBack: () => void;
}) {
  // Sebelumnya: `const session: any = useSession();` lalu diakses via
  // session.data?.user / session.status. Ini kehilangan type-safety.
  // Didestrukturisasi + diberi tipe eksplisit dari next-auth.
  const router = useRouter();
  const { data: session, status: sessionStatus } = useSession();

  const [formData, setFormData] = useState({
    customerName: "",
    whatsapp: "",
    email: "",
    city: "",
    projectName: "",
    projectOwnerType: "",
    projectDescription: "",
    targetAudience: "",
    projectGoal: "",
    informationContact: "",
    serviceLocation: "",
    designReference: "",
    targetStart: "",
    targetFinish: "",
    additionalNote: "",
  });
  const [basicOrderData, setBasicOrderData] = useState<BasicOrderData | null>(
    null,
  );
  const [professionalOrderData, setProfessionalOrderData] =
    useState<ProfessionalOrderData | null>(null);
  const [enterpriseOrderData, setEnterpriseOrderData] =
    useState<EnterpriseOrderData | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    if (sessionStatus === "authenticated" && session?.user) {
      setFormData((prev) => ({
        ...prev,
        customerName: session.user?.name || "",
        email: session.user?.email || "",
      }));
    }
  }, [session, sessionStatus]);

  const packageSlug = packageName.toLowerCase();

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const validateForm = (): string | null => {
    if (!formData.projectName.trim()) {
      return "Nama project wajib diisi.";
    }
    if (!formData.whatsapp.trim()) {
      return "Nomor WhatsApp wajib diisi.";
    }
    if (packageSlug.includes("basic") && !basicOrderData) {
      return "Lengkapi kebutuhan website Basic terlebih dahulu.";
    }
    return null;
  };

  const handleSubmit = async () => {
    const validationMessage = validateForm();

    if (validationMessage) {
      setSubmitError(validationMessage);
      return;
    }

    setSubmitError(null);
    setIsSubmitting(true);

    try {
      const userId = session?.user?.id ?? null;
      const email = formData.email || session?.user?.email || "";
      const name = formData.customerName || session?.user?.name || "";

      let client: Client;

      // 1. Cari berdasarkan user_id (kalau user login)
      const existingByUserId = userId
        ? await clientServices.findByUserId(userId)
        : null;

      if (existingByUserId) {
        // Client sudah ada — update data terbaru (nomor WA/kota bisa berubah antar order)
        client = await clientServices.updateClient(existingByUserId.id, {
          name,
          email,
          phone: formData.whatsapp,
          city: formData.city,
        });
      } else {
        // 2. Fallback: cari berdasarkan email (untuk guest checkout / user_id belum tersinkron)
        const existingByEmail = email
          ? await clientServices.findByEmail(email)
          : null;

        if (existingByEmail) {
          client = await clientServices.updateClient(existingByEmail.id, {
            userId,
            name,
            phone: formData.whatsapp,
            city: formData.city,
          });
        } else {
          // 3. Benar-benar client baru
          client = await clientServices.addClient({
            userId,
            name,
            email,
            phone: formData.whatsapp,
            city: formData.city,
          });
        }
      }

      console.log("CLIENT:", client, existingByUserId ? "(reused)" : "(new)");

      if (!client?.id) {
        throw new Error("Client tidak ditemukan atau gagal dibuat.");
      }

      const projectResponse = await projectServices.createProject({
        user_id: userId,

        client_id: client.id,

        name: formData.projectName,

        owner_type: formData.projectOwnerType,

        description: formData.projectDescription,

        target_audience: formData.targetAudience,

        goal: formData.projectGoal,

        information_contact: formData.informationContact,

        service_location: formData.serviceLocation,

        package: {
          id: packageId,
          name: packageName,
          slug: packageSlug,
        },

        websiteType: {
          id: websiteType.id,
          name: websiteType.name,
          slug: websiteType.slug,
        },

        design: {
          reference: formData.designReference,
        },

        timeline: {
          targetStart: formData.targetStart,
          targetFinish: formData.targetFinish,
        },

        requirements: {
          basic: basicOrderData
            ? {
                ...basicOrderData,
                assets: [],
              }
            : null,

          professional: professionalOrderData
            ? {
                ...professionalOrderData,
                assets: [],
              }
            : null,

          enterprise: enterpriseOrderData
            ? {
                ...enterpriseOrderData,
                assets: [],
              }
            : null,
        },

        assets: [],

        additional_note: formData.additionalNote,

        status: "pending",
      });

      console.log("PROJECT RESPONSE:", projectResponse);

      const projectId = projectResponse.data.data.id;

      if (!projectId) {
        throw new Error(
          "Project berhasil dibuat tetapi ID project tidak ditemukan.",
        );
      }

      console.log("PROJECT ID:", projectId);

      type UploadedAsset = {
        name: string;
        url: string;
        public_id: string;
        type: string;
        size: number;
      };

      let uploadedAssets: UploadedAsset[] = [];

      try {
        const assets = basicOrderData?.assets ?? [];
        const uploadResults = await Promise.allSettled(
          assets.map(async (file: File) => {
            const response = await uploadServices.uploadFile(
              file,
              `projects/${projectId}/assets`,
            );
            const { url, public_id } = response.data;
            return {
              name: file.name,
              url,
              public_id,
              type: file.type,
              size: file.size,
            };
          }),
        );

        uploadedAssets = uploadResults
          .filter(
            (result): result is PromiseFulfilledResult<UploadedAsset> =>
              result.status === "fulfilled",
          )
          .map((result) => result.value);

        const failedCount = uploadResults.length - uploadedAssets.length;
        if (failedCount > 0) {
          console.warn(
            `${failedCount} dari ${assets.length} file gagal diupload.`,
          );
        }
      } catch (uploadError) {
        console.error("UPLOAD ASSET GAGAL:", uploadError);
        uploadedAssets = [];
      }

      if (uploadedAssets.length > 0) {
        await projectServices.updateProject(projectId, {
          assets: uploadedAssets,
        });
      }

      const orderResponse = await orderServices.createOrder({
        user_id: userId,
        client_id: client.id,
        project_id: projectId,

        client: {
          id: client.id,
          name: formData.customerName || session?.user?.name || "",
          email: formData.email || session?.user?.email || "",
          phone: formData.whatsapp,
          city: formData.city,
        },

        project: {
          name: formData.projectName,
          ownerType: formData.projectOwnerType,
          description: formData.projectDescription,
          goal: formData.projectGoal,
          informationContact: formData.informationContact,
          serviceLocation: formData.serviceLocation,
        },

        package: { id: packageId, name: packageName, slug: packageSlug },
        website_type: {
          id: websiteType.id,
          name: websiteType.name,
          slug: websiteType.slug,
        },

        additionalNote: formData.additionalNote,
      });

      console.log("ORDER RESPONSE:", orderResponse);

      const orderId = orderResponse.data.data.id;

      if (!orderId) {
        throw new Error(
          "Order berhasil dibuat tetapi ID order tidak ditemukan.",
        );
      }

      console.log("=================================");
      console.log("ORDER BERHASIL DIBUAT");
      console.log("Client ID:", client.id);
      console.log("Project ID:", projectId);
      console.log("Order ID:", orderId);
      console.log("=================================");

      router.push(`/order/${orderId}/payment`);
    } catch (error: unknown) {
      console.error("GAGAL MEMBUAT ORDER:", error);

      let message = "Terjadi kesalahan saat membuat pesanan.";
      if (typeof error === "object" && error !== null) {
        const errObj = error as {
          response?: { data?: { message?: string }; status?: number };
          message?: string;
        };
        console.error("API ERROR RESPONSE:", errObj.response?.data);
        console.error("API ERROR STATUS:", errObj.response?.status);

        if (errObj.response?.data?.message) {
          message = errObj.response.data.message;
        } else if (errObj.message) {
          message = errObj.message;
        }
      }

      setSubmitError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl">
          Detail Pemesanan
        </h1>
        <p className="mt-2 text-muted-foreground">
          Lengkapi data berikut agar kami dapat memahami kebutuhan project Anda.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Ringkasan Pilihan</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-2">
          <div>
            <p className="text-sm text-muted-foreground">Paket</p>
            <p className="font-semibold">{packageName}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Jenis Website</p>
            <p className="font-semibold">{websiteType.name}</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Data Pemesan</CardTitle>
        </CardHeader>
        <CardContent>
          <FieldGroup>
            <div className="grid gap-4 md:grid-cols-2">
              <Field>
                <Label>Nama Lengkap</Label>
                <Input value={session?.user?.name ?? ""} disabled />
              </Field>

              <Field>
                <Label>Nomor WhatsApp</Label>
                <Input
                  value={formData.whatsapp}
                  onChange={(e) => handleChange("whatsapp", e.target.value)}
                  placeholder="08xxxxxxxxxx"
                />
              </Field>

              <Field>
                <Label>Email</Label>
                <Input
                  type="email"
                  value={session?.user?.email ?? ""}
                  disabled
                />
              </Field>

              <Field>
                <Label>Kota / Domisili</Label>
                <Input
                  value={formData.city}
                  onChange={(e) => handleChange("city", e.target.value)}
                  placeholder="Contoh: Medan"
                />
              </Field>
            </div>
          </FieldGroup>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Project Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <FieldGroup>
            <Field>
              <Label>Nama Project</Label>
              <Input
                value={formData.projectName}
                onChange={(e) => handleChange("projectName", e.target.value)}
                placeholder="Nama Project Anda"
              />
            </Field>
            <Field>
              <Label>Jenis Pemilik Project</Label>
              <Select
                value={formData.projectOwnerType}
                onValueChange={(value) =>
                  handleChange("projectOwnerType", value)
                }
              >
                <SelectTrigger className="w-45">
                  <SelectValue placeholder="Pemilik Project" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="personal">Personal</SelectItem>
                    <SelectItem value="bisnis">Bisnis</SelectItem>
                    <SelectItem value="organisasi">Organisasi</SelectItem>
                    <SelectItem value="sekolah">Sekolah</SelectItem>
                    <SelectItem value="event">Event</SelectItem>
                    <SelectItem value="produk">Produk</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </Field>
            <Field>
              <Label>Deskripsi Singkat Project</Label>
              <Textarea
                value={formData.projectDescription}
                onChange={(e) =>
                  handleChange("projectDescription", e.target.value)
                }
                placeholder="Ceritakan secara singkat tentang project Anda"
              />
            </Field>
            <Field>
              <Label>Tujuan Project</Label>
              <Textarea
                value={formData.projectGoal}
                onChange={(e) => handleChange("projectGoal", e.target.value)}
                placeholder="Contoh: meningkatkan kepercayaan bisnis, promosi, pendaftaran event, pengelolaan, dll."
              />
            </Field>
            <Field>
              <Label>Informasi Kontak</Label>
              <Input
                value={formData.informationContact}
                onChange={(e) =>
                  handleChange("informationContact", e.target.value)
                }
                placeholder="Informasi kontak (Nomor telepon, email, atau WhatsApp)"
              />
            </Field>
            <Field>
              <Label>Lokasi Layanan</Label>
              <Textarea
                value={formData.serviceLocation}
                onChange={(e) =>
                  handleChange("serviceLocation", e.target.value)
                }
                placeholder="Lokasi layanan Anda ( Area layanan bisnis, kota, atau lokasi event )"
              />
            </Field>
          </FieldGroup>
        </CardContent>
      </Card>

      {packageSlug.includes("basic") && (
        <BasicOrderFields onChange={setBasicOrderData} />
      )}

      {packageSlug.includes("professional") && (
        <ProfessionalOrderFields onChange={setProfessionalOrderData} />
      )}

      {packageSlug.includes("enterprise") && (
        <EnterpriseOrderFields onChange={setEnterpriseOrderData} />
      )}

      <Card>
        <CardHeader>
          <CardTitle>Referensi & Catatan</CardTitle>
        </CardHeader>
        <CardContent>
          <FieldGroup>
            <Field>
              <Label>Referensi Desain</Label>
              <Textarea
                value={formData.designReference}
                onChange={(e) =>
                  handleChange("designReference", e.target.value)
                }
                placeholder="Masukkan link referensi website atau gaya desain yang disukai"
              />
            </Field>

            <Field>
              <Label>Catatan Tambahan</Label>
              <Textarea
                value={formData.additionalNote}
                onChange={(e) => handleChange("additionalNote", e.target.value)}
                placeholder="Tambahkan request atau informasi lain jika ada"
              />
            </Field>
          </FieldGroup>
        </CardContent>
      </Card>

      {submitError && (
        <p className="text-sm text-red-500" role="alert">
          {submitError}
        </p>
      )}

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
        <Button
          variant="outline"
          onClick={onBack}
          disabled={isSubmitting}
          className="w-full sm:w-auto"
        >
          Kembali
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="w-full sm:w-auto"
        >
          {isSubmitting ? "Mengirim..." : "Submit Order"}
        </Button>
      </div>
    </div>
  );
}
