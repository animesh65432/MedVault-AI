import { Call } from "@/service/call"

export const GetDocs = async (token: string) => Call({
    path: "/api/v1/docs/GetAll",
    method: "GET",
    headers: {
        "Authorization": `Bearer ${token}`
    }
})

export const GenrateDoc = async (token: string, file: FormData) => {
    return Call({
        path: "/api/v1/docs/generate-docs",
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`,
        },
        request: file,
        formDataRequest: true,
    });
};

export const GetDocById = async (token: string, id: string) => Call({
    path: `/api/v1/docs/Get/${id}`,
    method: "GET",
    headers: {
        Authorization: `Bearer ${token}`,
    },
});

export const DeleteDocById = async (token: string, id: string) => Call({
    path: `/api/v1/docs/delete/${id}`,
    method: "DELETE",
    headers: {
        Authorization: `Bearer ${token}`,
    },
});