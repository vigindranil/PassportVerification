"use client"
import React, { useEffect, useState, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import CryptoJS from "crypto-js"

// 🔑 Encryption details
const ENCRYPTION_KEY = "1234567890123456";
const ENCRYPTION_IV = "abcdefghijklmnop";

// 🔒 Hashing logic (if you want to recheck checksum)
function hash256Test(input) {
    const hash = CryptoJS.SHA256(input).toString(CryptoJS.enc.Hex);
    let output = "";
    for (let i = 0; i < hash.length; i += 2) {
        const pair = hash.substr(i, 2);
        output += pair.startsWith("0") ? pair.substring(1) : pair;
    }
    return output;
}

// 🔓 AES decryption logic
function decryptAES(encData, key, iv) {
    const decrypted = CryptoJS.AES.decrypt(
        { ciphertext: CryptoJS.enc.Base64.parse(encData) },
        CryptoJS.enc.Utf8.parse(key),
        {
            iv: CryptoJS.enc.Utf8.parse(iv),
            padding: CryptoJS.pad.Pkcs7,
            mode: CryptoJS.mode.CBC,
        }
    )
    return decrypted.toString(CryptoJS.enc.Utf8)
}

function PaymentStatusContent() {
    const searchParams = useSearchParams()
    const [decryptedData, setDecryptedData] = useState(null)
    const [isValid, setIsValid] = useState(null)

    useEffect(() => {
        const encData = searchParams.get("encData")
        const cs = searchParams.get("cs")
        const src = searchParams.get("src")

        if (encData && cs) {
            try {
                // ✅ Decrypt data
                const plainData = decryptAES(encData, ENCRYPTION_KEY, ENCRYPTION_IV)
                setDecryptedData(plainData)
                console.log(plainData);
                

                // ✅ Verify checksum
                const expectedCs = hash256Test(encData)
                setIsValid(expectedCs === cs)
            } catch (err) {
                console.error("Decryption failed:", err)
                setDecryptedData("Invalid encrypted data")
            }
        }
    }, [searchParams])

    return (
        <div className="p-6 bg-white rounded-lg shadow-md w-[600px]">
            <h2 className="text-xl font-bold mb-4">🔐 Payment Response</h2>

            {decryptedData ? (
                <>
                    <pre className="p-3 bg-gray-100 rounded text-sm overflow-auto">
                        {decryptedData}
                    </pre>
                    <p className="mt-3">
                        ✅ Checksum Valid:{" "}
                        <span className={isValid ? "text-green-600" : "text-red-600"}>
                            {isValid ? "Yes" : "No"}
                        </span>
                    </p>
                </>
            ) : (
                <p className="text-gray-600">Waiting for encrypted data...</p>
            )}
        </div>
    )
}

export default function Page() {
    return (
        <div className="flex h-full min-h-[100vh] bg-gray-100 relative items-center justify-center">
            <Suspense fallback={<p className="text-gray-500">Loading...</p>}>
                <PaymentStatusContent />
            </Suspense>
        </div>
    )
}
