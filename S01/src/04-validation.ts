// Задание 4*. Правила валидации (со звёздочкой)
//
// 1. Опишите Rules так, чтобы ключом могло быть только поле формы (keyof).
// 2. Реализуйте validateForm: в результате только те поля,
//    которые не прошли проверку.
// 3. Сообщения собирайте шаблонной строкой.
//
// Подсказка: тип ошибок — { [K in keyof IFormData]?: string }.
// Отображённые типы (mapped types) — тема следующей лекции,
// поэтому задание необязательное.

export interface IFormData {
    username: string;
    email: string;
    age: number;
}

export type Rules = {
    [K in keyof IFormData]: (value: IFormData[K]) => boolean;
};

export type Errors = {
    [K in keyof IFormData]?: string;
};

export const defaultRules: Rules = {
    username: (value) => value.trim().length > 0,
    email: (value) => value.includes("@"),
    age: (value) => value > 0,
};

export function validateForm(data: IFormData, rules: Rules): Errors {
    const errors: Errors = {};

    function check<K extends keyof IFormData>(key: K): void {
        if (!rules[key](data[key])) {
            errors[key] = `Поле "${key}" заполнено неверно`;
        }
    }

    const fields: (keyof IFormData)[] = ['username', 'email', 'age'];
    for (const field of fields) {
        check(field);
    }

    return errors;
}