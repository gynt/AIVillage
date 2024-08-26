export type AIVData = {
    constructions: Array<Array<number>>; // 100x100
    steps: Array<Array<number>>; // 100x100
    placements: Array<Array<number>>; // 100x100
}

export function fromFile(path: string) {
    return {} as AIVData
}