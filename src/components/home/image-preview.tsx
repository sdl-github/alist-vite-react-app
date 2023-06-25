import { objState } from "@/store/obj"
import { useEffect } from "react"
import { useRecoilState } from "recoil"
import { Image } from "@douyinfe/semi-ui"

const ImagePreview: React.FC = () => {

    const [state, setState] = useRecoilState(objState)

    useEffect(() => {
        console.log(state.obj);

    }, [])

    return <>
        <div className='w-full min-h-60vh flex items-center justify-center p-4'>
            <Image
                src={state.obj?.raw_url}
            />
        </div>
    </>
}

export default ImagePreview