// import { getTransfReqs } from "./get-all-requests";
// import { getRequestPassports } from "./get-request-passports";

// const loadReq = async (userToken: string | undefined, userRole: string | undefined, userName: string | undefined) => {
//   if (userToken && userToken !== '') {
//     const result = (await getTransfReqs(userToken, 'Черновик')).filter((item) => {
//       if (userRole === '1') {
//         return item.Client?.Name === userName;
//       } else {
//         return [];
//       }
//     });

//     if (result[0]?.ID) {
//       localStorage.setItem("reqID", result[0].ID.toString());
//       const passportsData = await getRequestPassports(result[0].ID, userToken);
//       return passportsData;
//     }
//   }

//   return [];
// }

// export default loadReq;