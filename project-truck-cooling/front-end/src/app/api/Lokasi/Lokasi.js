import { Api } from '../../common/api'

export const listProvinsiFn = async () => {
	const response = await Api.get('/provinsi')
	return response.data
}

export const listKecamatanFn = async () => {
	const response = await Api.get('/kecamatan')
	return response.data
}

export const listKabupatenKotaFn = async () => {
	const response = await Api.get('/kabupaten-kota')
	return response.data
}