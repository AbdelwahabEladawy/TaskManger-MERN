


export const addThousandSeparators = (num) => {
    if (num == null || isNaN(num)) {
        return ""
    }

    const [integerPart, fractionalPart] = num.toString().split('.')
    const formattedIntegerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',')


    return fractionalPart ? `${formattedIntegerPart}.${fractionalPart}` : formattedIntegerPart

}