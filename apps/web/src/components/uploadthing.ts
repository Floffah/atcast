import {
    generateUploadButton,
    generateUploadDropzone,
} from "@uploadthing/react";

import { UTFileRouter } from "@/app/api/uploadthing/core";

export const UploadButton = generateUploadButton<UTFileRouter>();
export const UploadDropzone = generateUploadDropzone<UTFileRouter>();
