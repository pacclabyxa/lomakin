// Задание 3. Платежи (20 минут)
//
// 1. Реализуйте describePayment: switch по метке kind.
// 2. Закройте switch проверкой полноты через never.
// 3. Реализуйте total — сумма только наличных платежей.
// 4. Добавьте четвёртый вариант оплаты и посмотрите, где компилятор
//    покажет незакрытые места.

export type Payment =
    | { kind: "card"; last4: string }
    | { kind: "cash"; amount: number }
    | { kind: "transfer"; iban: string }
//    | { kind: "trade"; thing: string }
    ;

export function describePayment(payment: Payment): string {
    switch (payment.kind) {
        case ("card"):
            return `Оплата картой -> ${payment.last4}`;
        case ("cash"):
            return `Оплата наличными -> ${payment.amount}`;
        case ("transfer"):
            return `Оплата переводом -> ${payment.iban}`;
        default:
            const err: never = payment;
            throw new Error(`Неопределенный вид оплаты ${JSON.stringify(err)}`);
    }


}

export function total(payments: Payment[]): number {
    let total: number = 0;
    if (payments === undefined)
        return 0;
    for (let i in payments){
        if (payments[i] === undefined){
        }else {
            if (payments[i].kind === "cash") {
                total += payments[i].amount;
            }
        }
    }
    return total;
}
