import { Type, objState } from "@/store/obj"
import { useRecoilState, useRecoilValue } from "recoil"
import { LoadingSpinner } from "../shared/icons"
import { serverApiState } from "@/store/server"
import { useEffect } from "react"
import { useSearchParams } from 'react-router-dom';
import { Folder } from "./folder"

export function Index() {
    const api = useRecoilValue(serverApiState)
    const [state, setState] = useRecoilState(objState)
    const [searchParams, setSearchParams] = useSearchParams();

    useEffect(() => {
        console.log({ api });
        const path = searchParams.get('path') || '/'
        const type = (searchParams.get('type') || Type.Folder) as Type
        console.log({ path });
        console.log({ type });
        setState({
            ...state,
            path,
            type
        })
    }, [api, searchParams])

    return (
        <>
            {state.type === Type.Fetching &&
                <div className="flex min-h-screen w-full flex-col items-center justify-center py-32">
                    <LoadingSpinner />
                </div>
            }
            {state.type === Type.Folder && <Folder />}
        </>
    )
}