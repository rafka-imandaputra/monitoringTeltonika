import { Api } from "../../common/api";

const kelolaLayananClient = async ({ page, search }) => {
  const response = await Api.get(
    "/api/clients?page=" + page + "&search=" + search
  );
  return response.data;
};
