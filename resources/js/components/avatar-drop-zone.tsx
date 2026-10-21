import { Dropzone, DropZoneArea, DropzoneMessage, DropzoneTrigger, useDropzone } from "@/components/dropzone";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { getInitials } from "@/lib";
import { cn } from "@/lib/utils";
import { Trash2 } from "lucide-react";
import { useEffect, useRef } from "react";

interface Props {
    name: string;
    currentAvatar?: string | null;
    value?: File | null;
    onChange: (file: File | null) => void;
    className?: string;
}

export function AvatarDropzone({ name, currentAvatar, value, onChange, className }: Props) {
    const objectUrls = useRef<Array<string>>([]);

    const dropzone = useDropzone({
        onDropFile: async (file: File) => {
            onChange(file);

            return {
                status: "success",
                result: URL.createObjectURL(file),
            };
        },
        onRemoveFile: () => onChange(null),
        validation: {
            accept: {
                "image/jpeg": [".jpg", ".jpeg"],
                "image/png": [".png"],
                "image/webp": [".webp"],
            },
            maxSize: 10 * 1024 * 1024,
            maxFiles: 1,
        },
        shiftOnMaxFiles: true,
    });

    const selectedFile = dropzone.fileStatuses[0];
    const avatarSrc = selectedFile?.result ?? currentAvatar ?? undefined;
    const isPending = selectedFile?.status === "pending";

    useEffect(() => {
        const activeUrls = dropzone.fileStatuses
            .map((fileStatus) => fileStatus.result)
            .filter((result): result is string => typeof result === "string");

        objectUrls.current.forEach((url) => {
            if (!activeUrls.includes(url)) {
                URL.revokeObjectURL(url);
            }
        });

        objectUrls.current = activeUrls;
    }, [dropzone.fileStatuses]);

    useEffect(() => {
        return () => {
            objectUrls.current.forEach((url) => URL.revokeObjectURL(url));
        };
    }, []);

    useEffect(() => {
        if (value || dropzone.fileStatuses.length === 0) {
            return;
        }

        dropzone.fileStatuses.forEach((fileStatus) => {
            void dropzone.onRemoveFile(fileStatus.id);
        });
    }, [value, dropzone.fileStatuses]);

    return (
        <div className={cn("flex flex-col gap-2", className)}>
            <Dropzone {...dropzone}>
                <DropzoneMessage className="h-auto min-h-5" />
                <DropZoneArea className="border-dashed py-6">
                    <DropzoneTrigger className="flex w-full flex-col items-center gap-3 bg-transparent text-center">
                        <Avatar className={cn("size-16", isPending && "animate-pulse")}>
                            <AvatarImage className="object-cover" src={avatarSrc} alt={name} />
                            <AvatarFallback className="bg-primary/10 text-lg font-semibold text-primary">{getInitials(name)}</AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col gap-1">
                            <p className="text-sm font-semibold">Unggah foto profil baru</p>
                            <p className="text-xs font-normal text-muted-foreground">
                                Klik atau seret gambar ke sini. Maksimal 10MB (JPG, PNG, atau WEBP).
                            </p>
                        </div>
                    </DropzoneTrigger>
                </DropZoneArea>
            </Dropzone>

            {selectedFile?.status === "success" && (
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="self-start text-destructive hover:text-destructive"
                    onClick={() => dropzone.onRemoveFile(selectedFile.id)}
                >
                    <Trash2 className="size-4" />
                    Hapus pilihan
                </Button>
            )}
        </div>
    );
}
