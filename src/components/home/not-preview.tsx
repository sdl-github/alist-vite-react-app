
import FileIcon from '@/assets/file.png'
import { objState } from '@/store/obj'
import { useRecoilValue } from 'recoil'


export function NotPreview() {
    const state = useRecoilValue(objState)
    return (
        <>
            <div className="flex justify-center items-center flex-col mt-10">
                <div className="w-[200px] h-[200px] rounded">
                    <img src={FileIcon} width={200} height={200} />
                </div>
                <div className="my-4 font-bold text-xl">{state.obj?.name}</div>
                <div className="flex">
                    <a
                        className="mx-auto mb-5 flex max-w-fit animate-fade-up items-center justify-center space-x-2 overflow-hidden rounded-full bg-blue-100 px-7 py-2 transition-colors hover:bg-blue-200"
                    >
                        <p className="text-sm font-semibold text-[#1d9bf0] cursor-pointer">
                            复制链接
                        </p>
                    </a>
                    <a
                        className="ml-4 mx-auto mb-5 flex max-w-fit animate-fade-up items-center justify-center space-x-2 overflow-hidden rounded-full bg-blue-100 px-7 py-2 transition-colors hover:bg-blue-200"
                    >
                        <p className="text-sm font-semibold text-[#1d9bf0] cursor-pointer">
                            下载
                        </p>
                    </a>
                </div>
            </div>
        </>
    )
}