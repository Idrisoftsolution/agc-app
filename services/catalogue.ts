import axios from "axios";

// create a function (getCatalogueBySlug)
// send request to backend 
// pass data to the request
// return the response

const catalogueClint = axios.create({
    baseURL:`${process.env.EXPO_PUBLIC_BACKEND_API}/v1/catalogue`,
    headers:{
        "Content-Type":"application/json",
    },
    withCredentials:true
})

export async function createCatalogue(data) {
    const res = await catalogueClint.post(`/`, data,)
    return res.data
}
export async function getAllCatalogue() {
    const res = await catalogueClint.get(`/`)
    return res.data
}
export async function getCatalogueBySlug(slug) {
    const res = await catalogueClint.get(`/slug/${slug}`)
    return res.data
}
export async function getCatalogueById() {
    const res = await catalogueClint.get(`/id`)
    return res.data
}
export async function getCatalogueByState(state) {
    const res = await catalogueClint(`/state/${state}`)
    return res.data
}
export async function updateCatalogue(id, data) {
    const res = await catalogueClint(`/catalogue${id}`, data)
    return res.data
}
export async function deleteCatalogue(id) {
    const res = await catalogueClint(`/catalogue${id}`)
    return res.data
}
