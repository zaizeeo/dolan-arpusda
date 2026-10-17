import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { createGuestBookQuestionSchema, CreateGuestBookQuestionSchemaType } from "@/lib/validations/guest-book/question";
import { zodResolver } from "@hookform/resolvers/zod";
import { router, VisitHelperOptions } from "@inertiajs/core";
import { ListPlus, Plus, Trash2, Type } from "lucide-react";
import { ReactNode, useState } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";

interface Props {
    children: ReactNode;
    closeButton?: ReactNode;
}

const CreateGuestBookQuestion = ({ children, closeButton = null }: Props) => {
    const [open, setOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [formErrorMessage, setFormErrorMessage] = useState("");

    const form = useForm<CreateGuestBookQuestionSchemaType>({
        resolver: zodResolver(createGuestBookQuestionSchema),
        defaultValues: {
            label: "",
            description: "",
            options: [],
        },
    });

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: "options" as never,
    });

    const handleAddOption = () => {
        append({
            label: "",
            description: null,
            is_allow_custom_text: false,
        });
    };

    const handleOpenChange = (isOpen: boolean) => {
        setOpen(isOpen);
        if (!isOpen) {
            form.reset({
                label: "",
                description: "",
                options: [],
            });
            setFormErrorMessage("");
        }
    };

    const onSubmit = (data: CreateGuestBookQuestionSchemaType) => {
        setIsLoading(true);

        const payload: CreateGuestBookQuestionSchemaType = {
            ...data,
            options: data.options && data.options.length > 0 ? data.options : null,
        };

        const requestOptions = {
            onStart: () => setIsLoading(true),
            onFinish: () => setIsLoading(false),
            onSuccess: () => {
                toast.success("Berhasil", {
                    description: "Pertanyaan baru berhasil dibuat!",
                });
            },
            onError: (error) => {
                const errMessage = error?.server[0] || "Coba lagi beberapa saat";
                setFormErrorMessage(errMessage);
                toast.error("Terjadi Kesalahan!", {
                    description: errMessage,
                });
            },
        } satisfies VisitHelperOptions;

        router.post("/_api/dashboard/management/guest-book-question", data, requestOptions);
    };

    return (
        <Sheet open={open} onOpenChange={handleOpenChange}>
            <SheetTrigger asChild>{children}</SheetTrigger>
            <SheetContent className="flex w-full flex-col p-0 sm:max-w-lg">
                <SheetHeader className="p-6 pb-2">
                    <SheetTitle>Buat Pertanyaan</SheetTitle>
                    <SheetDescription>Tambahkan pertanyaan buku tamu beserta opsi pilihan jawabannya jika diperlukan.</SheetDescription>
                </SheetHeader>

                <form
                    id="form-create-guest-book-question"
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="flex-1 space-y-6 overflow-y-auto px-6 py-2"
                >
                    {formErrorMessage && <FieldError errors={[{ message: formErrorMessage }]} />}

                    <FieldGroup>
                        {/* Label Pertanyaan */}
                        <Controller
                            name="label"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor={field.name}>
                                        Label Pertanyaan <span className="text-destructive">*</span>
                                    </FieldLabel>
                                    <Input
                                        {...field}
                                        id={field.name}
                                        type="text"
                                        aria-invalid={fieldState.invalid}
                                        placeholder="Contoh: Pekerjaan / Maksud Kunjungan"
                                        autoComplete="off"
                                    />
                                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                </Field>
                            )}
                        />

                        {/* Deskripsi Pertanyaan */}
                        <Controller
                            name="description"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor={field.name}>
                                        Deskripsi Pertanyaan <span className="text-destructive">*</span>
                                    </FieldLabel>
                                    <Textarea
                                        {...field}
                                        id={field.name}
                                        aria-invalid={fieldState.invalid}
                                        placeholder="Tuliskan petunjuk pengisian bagi pengunjung..."
                                        rows={3}
                                    />
                                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                </Field>
                            )}
                        />
                    </FieldGroup>

                    <Separator />

                    {/* Section: Field Array Opsi Jawaban */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <div className="flex items-center gap-2">
                                    <h3 className="text-sm font-semibold text-foreground">Pilihan Jawaban</h3>
                                    <Badge variant="secondary" className="text-xs">
                                        {fields.length > 0 ? `${fields.length} Opsi` : "Teks Bebas"}
                                    </Badge>
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    {fields.length > 0
                                        ? "Pengunjung akan memilih salah satu dari opsi berikut."
                                        : "Tanpa opsi, pengunjung akan mengisi jawaban berupa teks bebas."}
                                </p>
                            </div>

                            <Button type="button" variant="outline" size="sm" onClick={handleAddOption} className="h-8 gap-1.5 text-xs">
                                <Plus className="size-3.5" />
                                <span>Tambah Opsi</span>
                            </Button>
                        </div>

                        {fields.length === 0 ? (
                            <div className="flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-border bg-muted/20 p-5 text-center">
                                <Type className="size-5 text-muted-foreground" />
                                <div className="space-y-1">
                                    <p className="text-xs font-medium text-foreground">Format Isian Teks Bebas</p>
                                    <p className="text-[11px] text-muted-foreground">
                                        Belum ada pilihan jawaban yang ditambahkan. Formulir ini akan menerima isian teks langsung.
                                    </p>
                                </div>
                                <Button type="button" variant="outline" size="sm" onClick={handleAddOption} className="mt-1 h-7 gap-1 text-xs">
                                    <ListPlus className="size-3.5" />
                                    <span>Ubah Jadi Pilihan Ganda</span>
                                </Button>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {fields.map((fieldItem, index) => (
                                    <div
                                        key={fieldItem.id}
                                        className="relative space-y-3 rounded-lg border border-border bg-card p-3.5 shadow-2xs transition-colors"
                                    >
                                        <div className="flex items-center justify-between border-b border-border/50 pb-2">
                                            <span className="text-xs font-semibold text-muted-foreground">Opsi #{index + 1}</span>
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="icon-xs"
                                                onClick={() => remove(index)}
                                                className="size-6 text-destructive hover:bg-destructive/10 hover:text-destructive"
                                                title="Hapus opsi ini"
                                            >
                                                <Trash2 className="size-3.5" />
                                            </Button>
                                        </div>

                                        {/* Label Opsi */}
                                        <Controller
                                            name={`options.${index}.label`}
                                            control={form.control}
                                            render={({ field, fieldState }) => (
                                                <Field data-invalid={fieldState.invalid}>
                                                    <FieldLabel htmlFor={`option-label-${index}`} className="text-xs">
                                                        Label Pilihan <span className="text-destructive">*</span>
                                                    </FieldLabel>
                                                    <Input
                                                        {...field}
                                                        id={`option-label-${index}`}
                                                        placeholder="Contoh: Laki-laki / Sangat Puas"
                                                        aria-invalid={fieldState.invalid}
                                                        className="h-8 text-sm"
                                                    />
                                                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                                </Field>
                                            )}
                                        />

                                        {/* Deskripsi Opsi (Opsional) */}
                                        <Controller
                                            name={`options.${index}.description`}
                                            control={form.control}
                                            render={({ field, fieldState }) => (
                                                <Field data-invalid={fieldState.invalid}>
                                                    <FieldLabel
                                                        htmlFor={`option-desc-${index}`}
                                                        className="text-xs font-normal text-muted-foreground"
                                                    >
                                                        Keterangan Tambahan <span className="text-[10px]">(Opsional)</span>
                                                    </FieldLabel>
                                                    <Input
                                                        {...field}
                                                        value={field.value ?? ""}
                                                        onChange={(e) => field.onChange(e.target.value || null)}
                                                        id={`option-desc-${index}`}
                                                        placeholder="Keterangan singkat jika diperlukan"
                                                        aria-invalid={fieldState.invalid}
                                                        className="h-8 text-sm"
                                                    />
                                                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                                </Field>
                                            )}
                                        />

                                        {/* Izinkan Teks Kustom */}
                                        <Controller
                                            name={`options.${index}.is_allow_custom_text`}
                                            control={form.control}
                                            render={({ field }) => (
                                                <label className="flex cursor-pointer items-center gap-2 pt-1 text-xs text-muted-foreground select-none hover:text-foreground">
                                                    <input
                                                        type="checkbox"
                                                        checked={Boolean(field.value)}
                                                        onChange={(e) => field.onChange(e.target.checked)}
                                                        className="size-4 cursor-pointer rounded border-border text-primary accent-primary focus:ring-ring"
                                                    />
                                                    <span>Izinkan pengunjung mengisi teks khusus untuk opsi ini</span>
                                                </label>
                                            )}
                                        />
                                    </div>
                                ))}

                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={handleAddOption}
                                    className="h-8.5 w-full gap-1.5 border-dashed text-xs"
                                >
                                    <Plus className="size-3.5" />
                                    <span>Tambah Opsi Lainnya</span>
                                </Button>
                            </div>
                        )}
                    </div>
                </form>

                <SheetFooter className="gap-2 border-t border-border bg-background p-4 sm:flex-row sm:justify-end">
                    <SheetClose asChild>
                        {closeButton ?? (
                            <Button type="button" variant="outline" disabled={isLoading}>
                                Batal
                            </Button>
                        )}
                    </SheetClose>
                    <Button type="submit" form="form-create-guest-book-question" disabled={isLoading}>
                        {isLoading ? "Menyimpan..." : "Simpan Pertanyaan"}
                    </Button>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    );
};

export default CreateGuestBookQuestion;
