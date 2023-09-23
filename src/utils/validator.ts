



export class Validator {

    public static isLogin(phone) {
        return /^\+[0-9]{11,13}$/.test(phone)
    }

    public static isPassword(pass: string) {
        return pass.length >= 8
    }

}