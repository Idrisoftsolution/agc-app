import axios from "axios"
// export const createProduct = async (name,slug,category,material,price) => {
//     const req = await fetch("http://localhost:8080/api/v1/product/add", {
//         method: "POST",
//         body: {
//             name,
//             slug,
//             category,
//             material,
//             price
//         },
//         headers:{
//             "Content-Type":"application/json"
//         },
//     })

//     const data = await req.json()
//     if(data.success){
//         return data.products
//     } else{
//         console.log(data.message)
//         return null
//     }
// }


const ProductClient = axios.create({
    baseURL:"http://localhost:8080/api/v1/activity",
    headers: {
        "Content-Type":"application/json"
    },
    withCredentials: true
})