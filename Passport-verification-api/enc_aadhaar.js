const encrypt = (data) =>{
    console.log("encrypted aadhaar",btoa(data));
}
const decrypt = (data) =>{
    console.log("decrypted aadhaar",atob(data));
}

encrypt("admin@123");
// decrypt("ODU3MTYyMzkxMDc5");