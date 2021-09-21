export async function getDict(key) {
    let dict;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXByaWx0YWctZGljdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImFwcmlsdGFnLWRpY3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBTUEsTUFBTSxDQUFDLEtBQUssVUFBVSxPQUFPLENBQUMsR0FBVztJQUNyQyxJQUFJLElBQVMsQ0FBQztJQUNkLFFBQVEsR0FBRyxFQUFFO1FBQ1Qsd0dBQXdHO1FBQ3hHLEtBQUssZUFBZTtZQUNoQixZQUFZO1lBQ1osSUFBSSxHQUFHLE1BQU0sTUFBTSxDQUFDLDZCQUE2QixDQUFDLENBQUM7WUFDbkQsT0FBTztnQkFDSCxJQUFJLEVBQUUsQ0FBQyxFQUFFLFVBQVUsRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQyx3QkFBd0I7YUFDakUsQ0FBQztRQUNOLEtBQUssZUFBZTtZQUNoQixhQUFhO1lBQ2IsSUFBSSxHQUFHLE1BQU0sTUFBTSxDQUFDLDZCQUE2QixDQUFDLENBQUM7WUFDbkQsT0FBTztnQkFDSCxJQUFJLEVBQUUsQ0FBQyxFQUFFLFVBQVUsRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQyx3QkFBd0I7YUFDakUsQ0FBQztRQUNOLEtBQUssZ0JBQWdCO1lBQ2pCLGFBQWE7WUFDYixJQUFJLEdBQUcsTUFBTSxNQUFNLENBQUMsNkJBQTZCLENBQUMsQ0FBQztZQUNuRCxPQUFPO2dCQUNILElBQUksRUFBRSxDQUFDLEVBQUUsVUFBVSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLHlCQUF5QjthQUNsRSxDQUFDO1FBQ04sS0FBSyxnQkFBZ0I7WUFDakIsYUFBYTtZQUNiLElBQUksR0FBRyxNQUFNLE1BQU0sQ0FBQyw2QkFBNkIsQ0FBQyxDQUFDO1lBQ25ELE9BQU87Z0JBQ0gsSUFBSSxFQUFFLENBQUMsRUFBRSxVQUFVLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLENBQUMseUJBQXlCO2FBQ2xFLENBQUM7UUFDTixLQUFLLGdCQUFnQjtZQUNqQixhQUFhO1lBQ2IsSUFBSSxHQUFHLE1BQU0sTUFBTSxDQUFDLDBCQUEwQixDQUFDLENBQUM7WUFDaEQsT0FBTztnQkFDSCxJQUFJLEVBQUUsQ0FBQyxFQUFFLFVBQVUsRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQyxnQkFBZ0I7YUFDMUQsQ0FBQztRQUNOLEtBQUssV0FBVztZQUNaLGFBQWE7WUFDYixJQUFJLEdBQUcsTUFBTSxNQUFNLENBQUMsMEJBQTBCLENBQUMsQ0FBQztZQUNoRCxPQUFPO2dCQUNILElBQUksRUFBRSxDQUFDLEVBQUUsVUFBVSxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLG1CQUFtQjthQUM3RCxDQUFDO1FBQ04sS0FBSyxXQUFXO1lBQ1osYUFBYTtZQUNiLElBQUksR0FBRyxNQUFNLE1BQU0sQ0FBQywwQkFBMEIsQ0FBQyxDQUFDO1lBQ2hELE9BQU87Z0JBQ0gsSUFBSSxFQUFFLENBQUMsRUFBRSxVQUFVLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsbUJBQW1CO2FBQzdELENBQUM7UUFDTixLQUFLLFdBQVc7WUFDWixhQUFhO1lBQ2IsSUFBSSxHQUFHLE1BQU0sTUFBTSxDQUFDLDBCQUEwQixDQUFDLENBQUM7WUFDaEQsT0FBTztnQkFDSCxJQUFJLEVBQUUsQ0FBQyxFQUFFLFVBQVUsRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQyxtQkFBbUI7YUFDN0QsQ0FBQztRQUNOLEtBQUssV0FBVztZQUNaLGFBQWE7WUFDYixJQUFJLEdBQUcsTUFBTSxNQUFNLENBQUMsMEJBQTBCLENBQUMsQ0FBQztZQUNoRCxPQUFPO2dCQUNILElBQUksRUFBRSxDQUFDLEVBQUUsVUFBVSxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLG1CQUFtQjthQUM3RCxDQUFDO0tBQ1Q7SUFDRCxNQUFNLElBQUksS0FBSyxDQUFDLHNCQUFzQixHQUFHLEVBQUUsQ0FBQyxDQUFDO0FBQ2pELENBQUMifQ==