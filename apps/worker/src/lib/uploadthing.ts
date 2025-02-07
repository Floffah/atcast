import { UTApi } from "uploadthing/server";

export const utAPI = new UTApi({
    token: process.env["UPLOADTHING_TOKEN"],
});
