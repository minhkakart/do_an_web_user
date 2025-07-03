import axiosClient from "~/services";

const categoryService = {
    getAll(cancelToken?: any) {
        return axiosClient.post('/api/v1/Category/get-list-all-category', {}, {cancelToken})
    }
}

export default categoryService;