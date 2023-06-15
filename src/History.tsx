import { useEffect } from "react"
import { supabase } from "./lib/supabase-client"



export function History() {

    useEffect(() => {
        supabase.from('record').select("*").then(res => {
            console.log(res);
        })
    }, [])

    return (
        <>
            <div className="flex min-h-screen w-full flex-col items-center py-32">
                <div className="z-10 w-full max-w-[900px] px-5 xl:px-0">
                    history
                </div>
            </div>
        </>
    )
}