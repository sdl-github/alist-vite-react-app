import { ListResult } from "pocketbase"
import { pb } from "../pocket_base_client"
import { ObjType } from "../types/obj"
import { serverApiState } from "@/store/server"
import { useRecoilValue } from "recoil"

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

export function useHistoryRecord() {
    const serverApi = useRecoilValue(serverApiState)

    const getHistoryRecordPage = async (pageNo = 1, pageSize = 20) => {
        return await pb.collection('history').getList(pageNo, pageSize, {
            sort: '-updated',
            filter: `serverApi ~ "${serverApi}"`
        }) as ListResult<HistoryRecord>
    }

    const queryHistoryRecordDetail = async (path: string) => {
        try {
            return await pb.collection('history').getFirstListItem(`path="${path}"`) as HistoryRecord
        } catch (e) {
            return false
        }
    }

    const upsertHistoryRecord = async (record: HistoryRecord) => {
        console.log('upsertHistoryRecord==>');
        
        const data = await queryHistoryRecordDetail(record.path!)
        if (data) {
            await pb.collection('history').update(data.id!, { ...data, ...record })
            return data
        }
        return await pb.collection('history').create(record)
    }

    return {
        getHistoryRecordPage,
        queryHistoryRecordDetail,
        upsertHistoryRecord
    }
}