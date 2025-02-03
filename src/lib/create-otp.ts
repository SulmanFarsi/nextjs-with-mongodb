export default function generateOTP(length: number = 6, charset: string = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"): string {
    let otp = "";
    for (let i = 0; i < length; i++) {
        otp += charset[Math.floor(Math.random() * charset.length)];
    }
    return otp;
}
