import filehelper from "../utils/filehelper";

const fs = require("fs");

const algorithm = "aes-256-cbc";
// const keypath = "./app/crypto/key.txt";
export const ivpath = "./app/crypto/iv.txt";

let crypto = null;

export function cryptoAvailable() {
    try {
        if (crypto === null) {
            crypto = require("crypto");

            if (fs.existsSync(ivpath) && readFromFile(ivpath) === "") {
                writeNewIv();
            }
        }
    } catch (error) {
        return false;
    }
    return true;
}

function readFromFile(filepath) {
    return fs.readFileSync(filepath, "utf-8");
}

// export function writeNewKey() {
//     const key = crypto.randomBytes(32).toString("hex").slice(0, 32);
//     fs.writeFileSync(keypath, key, (error) => {
//         if (error) {
//             console.error("could not write new key");
//         }
//     });
// }

export function writeNewIv() {
    if (crypto === null) {
        crypto = require("crypto");
    }
    const iv = crypto.randomBytes(16).toString("hex").slice(0, 16);
    fs.writeFileSync(filehelper.newivpath, iv, (error) => {
        if (error) {
            console.error("could not write new iv");
        }
    });

    // delete old iv file
    if (fs.existsSync(ivpath)) {
        fs.unlink(ivpath, (err) => {
            if (!err){
                console.log(`${ivpath} was deleted`);
            } else {
                console.error(`Error: ${err}.`);
            }            
        });
    }
}

export function encrypt(text, key) {
    if (!cryptoAvailable() || key === "") {
        return text;
    }

    // let key = readFromFile(keypath);
    const iv = filehelper.getIv();
    const cipher = crypto.createCipheriv(algorithm, Buffer.from(key), iv);
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return encrypted.toString("hex");
}

export function decrypt(text, key) {
    if (!cryptoAvailable() || key === "") {
        return text;
    }

    // let key = readFromFile(keypath);
    const iv = filehelper.getIv();
    const encryptedText = Buffer.from(text, "hex");
    const decipher = crypto.createDecipheriv(algorithm, Buffer.from(key), iv);
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
}