import request from '@/lib/request'
import { FsListResp } from '@/lib/types/resp'

export function getList({ path = "/", password = "", page = 1, per_page = 0, refresh = false }): Promise<FsListResp> {
    return request.post('/fs/list', {
        path,
        password,
        page,
        per_page,
        refresh,
    })
}