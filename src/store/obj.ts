import { Obj } from "@/lib/types/obj";
import { atom } from "recoil";

export enum Type {
    Fetching = 'fetching',
    Folder = 'folder', // Folder state
    File = 'file', // File state
  }

type ISate = {
    path: string
    type: Type
    folders?: Obj[]
    obj?: Obj
}

export const objState = atom<ISate>({
    key: "objState",
    default: {
        path: '/',
        type: Type.Fetching,
        folders: [],
        obj: {} as Obj
    }
});
