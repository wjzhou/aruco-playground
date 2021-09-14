export type Dict = {
    size: number,
    isApriltag: boolean,
    data: number[][][]
}

export async function getDict(key: string): Promise<Dict> {
    let dict: any;
    switch (key) {
        // the apriltag definition is opencv's code is rotate differently because of coordinate system different
        case 'apriltag_16h5':
            //@ts-ignore
            dict = await import('./apriltag-dict-apriltag.js');
            return {
                size: 4, isApriltag: true, data: dict.DICT_APRILTAG_16h5_BYTES
            };
        case 'apriltag_25h9':
            // @ts-ignore
            dict = await import('./apriltag-dict-apriltag.js');
            return {
                size: 5, isApriltag: true, data: dict.DICT_APRILTAG_25h9_BYTES
            };
        case 'apriltag_36h10':
            // @ts-ignore
            dict = await import('./apriltag-dict-apriltag.js');
            return {
                size: 6, isApriltag: true, data: dict.DICT_APRILTAG_36h10_BYTES
            };
        case 'apriltag_36h11':
            // @ts-ignore
            dict = await import('./apriltag-dict-apriltag.js');
            return {
                size: 6, isApriltag: true, data: dict.DICT_APRILTAG_36h11_BYTES
            };
        case 'aruco_original':
            // @ts-ignore
            dict = await import('./apriltag-dict-aruco.js');
            return {
                size: 5, isApriltag: false, data: dict.DICT_ARUCO_BYTES
            };
        case 'aruco_4x4':
            // @ts-ignore
            dict = await import('./apriltag-dict-aruco.js');
            return {
                size: 4, isApriltag: false, data: dict.DICT_4X4_1000_BYTES
            };
        case 'aruco_5x5':
            // @ts-ignore
            dict = await import('./apriltag-dict-aruco.js');
            return {
                size: 5, isApriltag: false, data: dict.DICT_5X5_1000_BYTES
            };
        case 'aruco_6x6':
            // @ts-ignore
            dict = await import('./apriltag-dict-aruco.js');
            return {
                size: 6, isApriltag: false, data: dict.DICT_6X6_1000_BYTES
            };
        case 'aruco_7x7':
            // @ts-ignore
            dict = await import('./apriltag-dict-aruco.js');
            return {
                size: 7, isApriltag: false, data: dict.DICT_7X7_1000_BYTES
            };
    }
    throw new Error(`unknown dictionary ${key}`);
}
