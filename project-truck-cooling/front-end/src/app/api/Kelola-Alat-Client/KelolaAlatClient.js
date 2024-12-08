import { Api } from "../../common/api";

export const KelolaAlatClFn = async () => {
    const response = await Api.get('/api/kelolaalatcl');
    return response.data;
}