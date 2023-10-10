import { ObjType } from "../types/obj"
import axios from "axios"
import { getLocalStorage } from "../utils"

type DataType = {
    id: string
    type: string
    key: string
    value: HistoryRecord
    updated_at: string
}
export type HistoryRecord = {
    serverApi: string
    id?: string
    fileId?: string
    created?: string
    updated?: string
    name?: string
    path?: string
    thumb?: string
    totalTime?: number
    seeTime?: number
    type?: ObjType
}
const BASE_API = 'https://worker.viewcode.online'
export function useHistoryRecord() {
    
    const DATA_TYPE = 'alist-history' +  getLocalStorage<string | null>('serverApi')

    const getHistoryRecordPage = async (pageNo = 1, pageSize = 20) => {
        const res = await axios.get(`${BASE_API}/api/data/list`, {
            params: {
                type: DATA_TYPE,
                pageNo,
                pageSize
            }
        })
        return res.data.rows as DataType[]
    }

    const queryHistoryRecordDetail = async (path?: string) => {
        try {
            const res =  await axios.get(`${BASE_API}/api/data/get`, {
                params: {
                    type: DATA_TYPE,
                    key: path
                }
            }) 
            return res.data as DataType
        } catch (e) {
            return false
        }
    }

    const upsertHistoryRecord = async (value: HistoryRecord) => {
        const key = value.path
        if (!key || !value.seeTime) {
            return
        }
        await axios.post(`${BASE_API}/api/data/save`, {
            key,
            type: DATA_TYPE,
            value: JSON.stringify(value)
        })
    }

    return {
        getHistoryRecordPage,
        queryHistoryRecordDetail,
        upsertHistoryRecord
    }
}