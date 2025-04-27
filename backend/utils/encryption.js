const crypto = require("crypto");
const paillierBigint = require("paillier-bigint");

// AES Encryption Configuration
const AES_ALGORITHM = "aes-256-cbc";
const AES_SECRET_KEY = crypto.randomBytes(32);
const AES_IV = crypto.randomBytes(16); // Initialization Vector

// 🔹 AES Encryption (For Income & Government ID)
function encryptData(data) {
    const cipher = crypto.createCipheriv(AES_ALGORITHM, AES_SECRET_KEY, AES_IV);
    let encrypted = cipher.update(data, "utf-8", "hex");
    encrypted += cipher.final("hex");

    return { encrypted, iv: AES_IV.toString("hex") };
}

// 🔹 AES Decryption (For Retrieving Data Securely)
function decryptData(encryptedData, iv) {
    const decipher = crypto.createDecipheriv(AES_ALGORITHM, AES_SECRET_KEY, Buffer.from(iv, "hex"));
    let decrypted = decipher.update(encryptedData, "hex", "utf-8");
    decrypted += decipher.final("utf-8");

    return decrypted;
}

// 🔹 Homomorphic Encryption Setup (For Credit Score)
async function generateHomomorphicKeys() {
    const { publicKey, privateKey } = await paillierBigint.generateRandomKeys(2048);
    return { publicKey, privateKey };
}

// 🔹 Encrypt Credit Score (Using Paillier Public Key)
function encryptCreditScore(creditScore, publicKey) {
    return publicKey.encrypt(BigInt(creditScore)).toString();
}

// 🔹 Decrypt Credit Score (Using Paillier Private Key)
function decryptCreditScore(encryptedScore, privateKey) {
    return privateKey.decrypt(BigInt(encryptedScore)).toString();
}

module.exports = {
    encryptData,
    decryptData,
    generateHomomorphicKeys,
    encryptCreditScore,
    decryptCreditScore
};
