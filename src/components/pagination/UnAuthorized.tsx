

export default function Unauthorized() {
    return <div className={"flex flex-col justify-center items-center min-h-[500px] gap-2"}>
        <p className={"text-xl font-medium"}>
            Unauthorized
        </p>
        <p className="text-base text-gray">
            You are not allowed to view this page
        </p>
    </div>
}