import axios from 'axios';

export const signIn = async (email:string,password:string)=>{
    try {
        const response = await axios.post(`${process.env.EXPO_PUBLIC_BACKEND_API}/v1/auth/login`,{email,password},{
            headers: {
                'Content-Type': 'application/json'
            },
            withCredentials: true
        });
        console.log(response.data)
        return response.data    
    } catch (error) {
        console.log(error)
        return error.response.data
        
    }
}

export const register = async (type:string,email:string,specialization:string,bio:string,password:string,fullName:string,terms:boolean=false)=>{
    console.log(type,email,password,fullName,specialization,terms)
    const response = await axios.post(`${process.env.EXPO_PUBLIC_BACKEND_API}/v1/auth/register`,{type,email,password,fullName,specialization,terms,bio});
    console.log(response.data)
    return response.data.user
}
export const googleRegister = async (token:string,role)=>{
    const response = await axios.post(`${process.env.EXPO_PUBLIC_BACKEND_API}/v1/auth/google/register`,{tokenId:token,role:role},{
        headers: {
            'Content-Type': 'application/json'
        },
        withCredentials: true
    });
    console.log(response.data)
    return response.data
}

export const googleLogin = async (token:string)=>{
    
    const response = await axios.post(`${process.env.EXPO_PUBLIC_BACKEND_API}/v1/auth/google/login`,{idToken:token},{
        headers: {
            'Content-Type': 'application/json'
        },
        withCredentials: true
    });
    return response.data
}

export const logOff = async ()=>{
    const response = await axios.post(`${process.env.EXPO_PUBLIC_BACKEND_API}/v1/auth/logout`,{},{
        headers: {
            'Content-Type': 'application/json'
        },
        withCredentials: true
    });
    console.log(response.data)
    return response.data
}

export const getUserByToken = async()=>{
    const response = await axios.get(`${process.env.EXPO_PUBLIC_BACKEND_API}/v1/auth/me`,{
        withCredentials:true
    });
    console.log(response.data)
    return response.data
}


// export default login