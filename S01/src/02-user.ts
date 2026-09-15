// Задание 2. Карточка пользователя (15 минут)
//
// 1. Реализуйте describeUser.
// 2. Отсутствующий возраст не должен превращаться в "undefined лет".
// 3. Контакт различайте оператором in, а не проверкой на undefined.
// 4. Пустой массив хобби обработайте отдельной фразой.
//
// Без any, as и !.

export type Contact = { email: string } | { phone: string };

export type User = {
    name: string;
    age?: number;
    hobbies: string[];
    contact: Contact;
};

export function describeUser(user: User): string {
    let text: string = "Пользователя зовут: " + user.name;

    if (user.age === undefined){
    } else {
        text += `и ему ${user.age}.`;
    }

    let hob: string = "";
    if (user.hobbies === undefined){
    } else {
        text += " У него есть хобби: ";
        for (hob in user.hobbies){
            text += `${user.hobbies[hob]}, `;
       }
    }

    if ('email' in user.contact){
        text += "с ним можно связаться с помощью ";
        text += `почты ${user.contact.email}.`;
    } else if ('phone' in user.contact)
    {
        text += "с ним можно связаться с помощью ";
        text += `телефона ${user.contact.phone}.`;
    }
    return text;
}
