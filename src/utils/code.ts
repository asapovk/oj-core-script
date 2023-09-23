

export const genCode = () => {
    const min = 1000
    const max = 9999
    return Math.floor(
        Math.random() * (max - min) + min
    )
}