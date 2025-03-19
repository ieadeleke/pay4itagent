export const capitalizeText = (e: string | undefined) => {
    return `${e?.slice(0, 1)?.toUpperCase()}${e?.slice(1)?.toLowerCase()}`;
}