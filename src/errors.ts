function e(error: any) {
    return new Error(JSON.stringify(error))
}
const Errors = {

    SHORT_PASSWORD: (message: string = "Пароль должен быть не короче 8 символов") => e({ code: 401, message }),
    NOT_A_PHONE: (message: string = "Неверный формат номера телефона") => e({ code: 402, message }),


    TEMPORARILY_UNAVAILABLE: (message: string = "Сервис временно недоступен") => e({ code: 1, message }),
    INCORRECT_INPUT: (key: string, message: string = "Поля заполнены неверно или не полностью") => e({ code: 3, key, message }),
    DUPLICATE_VIOLATE: (message: string = "Запись уже существует") => e({ code: 4, message }),
    NOT_FOUND: (message: string = "Запись не найдена") => e({ code: 5, message }),

    WRONG_CREDENTIALS: (message: string = "Неверное имя пользователя или пароль") => e({ code: 300, message }),
    SESSION_NOT_FOUND: (message: string = "Сессия не найдена") => e({ code: 301, message }),
    SESSION_EXPIRED: (message: string = "Сессия истекла") => e({ code: 302, message }),
    NOT_AUTHORIZED: (message: string = "Необходимо авторизоваться") => e({ code: 303, message }),
    ACCESS_DENIED: (message: string = "Нет доступа") => e({ code: 304, message }),
    INVALID_ACCESS_KEY: (message: string = "Не верный ключ доступа") => e({ code: 305, message }),


    APP_ERROR: (message: string = "Системная ошибка") => e({ code: 500, message })


}
export default Errors



