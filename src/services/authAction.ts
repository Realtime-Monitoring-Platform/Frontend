import axios from "axios";
import { api } from "./api";


// export const changePassword = async (currentPassword: string, newPassword: string, confirmationPassword: string) => {
//     try {
//         const response = await axios.patch(`http://localhost:8222/api/v1/auth/change-password`, {
//             currentPassword,
//             newPassword,
//             confirmationPassword,
//         }, {
//             headers: {
//                 'Authorization': `Bearer eyJhbGciOiJIUzI1NiJ9.eyJyb2xlIjoiIiwicGVybWlzc2lvbnMiOltdLCJ0ZW5hbnRJZCI6IjNmYTg1ZjY0LTU3MTctNDU2Mi1iM2ZjLTJjOTYzZjY2YWZhNiIsInVzZXJJZCI6IjU2NjBlZmM1LWJiOTAtNDhmYy1iYTRmLTg0OWZjM2I5N2U5MiIsImVtYWlsIjoiY2hlZGx5LnJlYmFpMTIzQGdtYWlsLmNvbSIsImVuYWJsZWQiOnRydWUsInVzZXJuYW1lIjoic3RyaW5nIiwic3ViIjoiY2hlZGx5LnJlYmFpMTIzQGdtYWlsLmNvbSIsImlhdCI6MTc4NTg0OTE3NSwiZXhwIjoxNzg1OTM1NTc1LCJqdGkiOiI2ZWE0NmIwNS05MzUxLTRlODItODYzYi00NTEzYzEzNDA5MmIifQ.yqJQ5kTD0w9eGDG7pJ0v62DdxtfXUshk7Hblq4O_goI`,
//             },
//         });
//         console.log("Change password response:", response.data);
//         console.log("Change password response data:", response.data);
//         cookieStore.get('access_Token').then((token) => {
//             console.log('Access Token after password change:', token?.value);
//         })
//         return response.data;
//     } catch (error) {
//         throw new Error('Failed to change password');
//     }
// }