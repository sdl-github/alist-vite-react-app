import Balancer from "react-wrap-balancer";


export function Introduce() {
    return (
        <>
            <div className="flex min-h-screen w-full flex-col items-center justify-center py-32">
                <div className="z-10 w-full max-w-xl px-5 xl:px-0">
                    <h1
                        className="animate-fade-up bg-gradient-to-br from-black to-stone-500 bg-clip-text text-center font-display text-4xl font-bold tracking-[-0.02em] opacity-100 drop-shadow-sm md:text-7xl md:leading-[5rem]"
                        style={{ animationDelay: "0.15s", animationFillMode: "forwards" }}
                    >
                        <Balancer>连接您的AList服务器</Balancer>
                    </h1>
                    <p
                        className="mt-6 animate-fade-up text-center text-gray-500 opacity-100 md:text-xl"
                        style={{ animationDelay: "0.25s", animationFillMode: "forwards" }}
                    >
                        <Balancer>
                            AList 🗂️ 是一个支持多种存储的文件列表程序
                        </Balancer>
                    </p>
                    <div
                        className="mx-auto mt-6 flex animate-fade-up items-center justify-center space-x-5 opacity-100"
                        style={{ animationDelay: "0.3s", animationFillMode: "forwards" }}
                    >
                        <a
                            target="_blank"
                            rel="noreferrer"
                            className="mx-auto mb-5 flex max-w-fit animate-fade-up items-center justify-center space-x-2 overflow-hidden rounded-full bg-blue-100 px-7 py-2 transition-colors hover:bg-blue-200"
                        >
                            {/* <Twitter className="h-5 w-5 text-[#1d9bf0]" /> */}
                            <p className="text-sm font-semibold text-[#1d9bf0]">
                                新建服务器
                            </p>
                        </a>
                    </div>
                </div>
            </div>
        </>
    )
}