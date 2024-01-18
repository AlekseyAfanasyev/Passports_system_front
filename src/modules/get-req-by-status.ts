import { getTransfReqs } from "./get-all-requests";

const getRequestByStatus = async (
    userToken: string | undefined, 
    userRole: string | undefined,
    userName: string | null, 
    status: string,
    dateStart: string | null,
    dateFin: string | null,
    //client: string | null,
    ) => {
    if (userToken && userToken !== '') {
        const result = (await getTransfReqs(userToken, status, dateStart, dateFin, /*client*/)).filter((item) => {
            if (userRole === '1') {
                return item.Client?.Name === userName;
            } else {
                return item.Moder?.Name === userName;
            }
        });
        return result;
    }
}
export default getRequestByStatus;