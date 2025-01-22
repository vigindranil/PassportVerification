const encrypt = (data) =>{
    console.log("encrypted aadhaar",btoa(data));
}
const decrypt = (data) =>{
    console.log("decrypted aadhaar",atob(data));
}

encrypt("857162391079");
decrypt("ODU3MTYyMzkxMDc5");