import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { Download, Loader2 } from "lucide-react";
import { useId, useState, type ComponentProps } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

const exportFormSchema = z
    .object({
        start_date: z.string(),
        end_date: z.string(),
    })
    .refine((data) => !data.start_date || !data.end_date || data.start_date <= data.end_date, {
        message: "Tanggal akhir tidak boleh lebih awal dari tanggal mulai.",
        path: ["end_date"],
    });

type ExportFormSchema = z.infer<typeof exportFormSchema>;

interface Props {
    title: string;
    description: string;
    url: string;
    fallbackFileName: string;
    buttonLabel?: string;
    size?: ComponentProps<typeof Button>["size"];
    disabled?: boolean;
}

const resolveFileName = (contentDisposition: string | null, fallbackFileName: string): string => {
    if (!contentDisposition) {
        return fallbackFileName;
    }

    const utf8Match = /filename\*=UTF-8''([^;]+)/i.exec(contentDisposition);

    if (utf8Match?.[1]) {
        return decodeURIComponent(utf8Match[1]);
    }

    const match = /filename="?([^";]+)"?/i.exec(contentDisposition);

    return match?.[1] ?? fallbackFileName;
};

const toDateInputValue = (date: Date): string => {
    const year = date.getFullYear();
    const month = `${date.getMonth() + 1}`.padStart(2, "0");
    const day = `${date.getDate()}`.padStart(2, "0");

    return `${year}-${month}-${day}`;
};

const getDefaultDateRange = (): ExportFormSchema => {
    const endDate = new Date();
    const startDate = new Date(endDate);

    startDate.setDate(endDate.getDate() - 7);

    return {
        start_date: toDateInputValue(startDate),
        end_date: toDateInputValue(endDate),
    };
};

export default function ExportExcelDialog({
    title,
    description,
    url,
    fallbackFileName,
    buttonLabel = "Export Excel",
    size = "sm",
    disabled = false,
}: Props) {
    const startDateId = useId();
    const endDateId = useId();
    const [isOpen, setIsOpen] = useState(false);
    const [isExporting, setIsExporting] = useState(false);
    const [formErrorMessage, setFormErrorMessage] = useState("");

    const form = useForm<ExportFormSchema>({
        resolver: zodResolver(exportFormSchema),
        defaultValues: getDefaultDateRange(),
    });

    const onSubmit = async (data: ExportFormSchema) => {
        setIsExporting(true);
        setFormErrorMessage("");

        try {
            const params = new URLSearchParams();

            if (data.start_date) {
                params.set("start_date", data.start_date);
            }

            if (data.end_date) {
                params.set("end_date", data.end_date);
            }

            const query = params.toString();
            const target = query !== "" ? `${url}?${query}` : url;

            const response = await fetch(target, {
                credentials: "same-origin",
                headers: {
                    Accept: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                },
            });

            const contentType = response.headers.get("content-type") ?? "";

            if (!response.ok || contentType.includes("text/html")) {
                throw new Error(
                    response.status === 404 ? "Belum ada data yang bisa diexport." : "Gagal membuat file Excel. Coba lagi beberapa saat.",
                );
            }

            const blob = await response.blob();
            const objectUrl = window.URL.createObjectURL(blob);
            const link = document.createElement("a");

            link.href = objectUrl;
            link.download = resolveFileName(response.headers.get("content-disposition"), fallbackFileName);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.setTimeout(() => window.URL.revokeObjectURL(objectUrl), 1000);

            form.reset(getDefaultDateRange());
            setIsOpen(false);
            toast.success("Export berhasil", { description: "File Excel sedang diunduh." });
        } catch (error) {
            const message = error instanceof Error ? error.message : "Gagal membuat file Excel.";

            setFormErrorMessage(message);
            toast.error("Export gagal", { description: message });
        } finally {
            setIsExporting(false);
        }
    };

    const handleOpenChange = (nextOpen: boolean) => {
        setIsOpen(nextOpen);
        form.reset(getDefaultDateRange());

        if (!nextOpen) {
            setFormErrorMessage("");
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
                <Button
                    type="button"
                    variant="outline"
                    size={size}
                    disabled={disabled}
                    className="gap-2"
                    title={disabled ? "Belum ada data untuk diexport" : undefined}
                >
                    <Download className="size-4" />
                    {buttonLabel}
                </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    <DialogDescription>{description}</DialogDescription>
                </DialogHeader>

                <form id="form-export-excel" onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    {formErrorMessage && <FieldError errors={[{ message: formErrorMessage }]} />}

                    <FieldGroup>
                        <Controller
                            name="start_date"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor={startDateId}>Tanggal Mulai</FieldLabel>
                                    <Input id={startDateId} type="date" aria-invalid={fieldState.invalid} {...field} />
                                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                </Field>
                            )}
                        />

                        <Controller
                            name="end_date"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor={endDateId}>Tanggal Akhir</FieldLabel>
                                    <Input id={endDateId} type="date" aria-invalid={fieldState.invalid} {...field} />
                                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                </Field>
                            )}
                        />
                    </FieldGroup>

                    <DialogFooter className="gap-2">
                        <Button type="button" variant="outline" onClick={() => handleOpenChange(false)}>
                            Batal
                        </Button>
                        <Button type="submit" disabled={isExporting}>
                            {isExporting ? <Loader2 className="size-4 animate-spin" /> : <Download className="size-4" />}
                            Export Excel
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
