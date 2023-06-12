import { getLocalStorage } from "@/lib/utils";
import { AtomEffect, atom } from "recoil";

const localStorageEffect = (key: string): AtomEffect<string | null> => ({ setSelf, onSet }) => {
    const savedValue = localStorage.getItem(key)
    if (savedValue != null) {
        setSelf(JSON.parse(savedValue));
    }
    onSet((newValue, _, isReset) => {
        isReset
            ? localStorage.removeItem(key)
            : localStorage.setItem(key, JSON.stringify(newValue));
    });
};

export const serverApiState = atom({
    key: "serverState",
    default: getLocalStorage<string | null>('serverApi'),
    effects: [
        localStorageEffect('serverApi'),
    ],
});

