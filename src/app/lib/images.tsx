"use server";

import { MD5 } from "crypto-js";
import { existsSync, mkdirSync, writeFileSync } from "fs";

export async function uploadImage(content: string) {
    console.log("Uploading image with size: " + content.length);
    if (!existsSync("turbo-image")) {
        mkdirSync("turbo-image");
    }

    const fileName = MD5(content).toString();

    writeFileSync("turbo-image/" + fileName, content);

    console.log("Finished uploading! fileName=" + fileName)

    return fileName;
}