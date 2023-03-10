import React, { useContext, useEffect, useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import {SyncOutlined} from '@ant-design/icons'
import Link from "next/link"
import { Context } from '../context'
import {useRouter} from 'next/router'

const Login = () => {

  const [email,setEmail]=useState("") 
  const [password,setPassword]=useState("") 
  const [loading,seLoading]=useState(false) 

  const {state,dispatch}=useContext(Context)
  const {user}=state

  const router=useRouter()

  useEffect(()=>{

    if(user!==null){
      router.push("/")
    }
  },[user])

 

  const handleSubmit= async (e)=>{
    e.preventDefault()

    try{
      seLoading(true)
      const {data} =await axios.post(`/api/login`,{
        email , password
      })

      toast.success("Login Successfull")

      dispatch({
        type:"LOGIN",payload:data.user
      })

      window.localStorage.setItem("user",JSON.stringify(data.user))

      seLoading(false)
      router.push("/user")
    }
    catch(err){
      toast.error(err.response.data)
      seLoading(false)
    }
    
  }

  return (
    <div>
            <h1 className='jumbotron bg-primary square text-center'>Login</h1>
            <div className='container col-md-4 offset-md-4 pb-5'>
                <form onSubmit={handleSubmit}>

                     <input 
                    value={email} 
                    onChange={(e)=>setEmail(e.target.value)}
                    type="text" className='form-control mb-4 p-4'
                    placeholder='Enter Email'
                    required
                    ></input>

                     <input 
                    value={password} 
                    onChange={(e)=>setPassword(e.target.value)}
                    type="text" className='form-control mb-4 p-4'
                    placeholder='Enter Password'
                    required
                    ></input>
                    <br></br>

                  <div className='text-center'>
                    <button disabled={ !email || !password || loading} type='submit' className='btn text-center px-4 btn-primary btn-lg btn-block'> 
                     {loading?<SyncOutlined></SyncOutlined>:"Submit"} 
                    </button>
                  </div>

                </form>
                
                <p className='text-center pt-3'>
                    Not yet registered ? {" "}
                    <Link href="/register">
                      <a>Register</a>
                    </Link>
                </p>

                <p className='text-center'>
                    <Link href="/forgot-password">
                      <a className='text-danger'>Forgot Password</a>
                    </Link>
                </p>
            </div>


    </div>
  )
}

export default Login