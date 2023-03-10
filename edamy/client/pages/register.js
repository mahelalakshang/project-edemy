import React, {useContext, useState, useEffect } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import {SyncOutlined} from '@ant-design/icons'
import Link from "next/link"
import { Context } from '../context'
import { useRouter } from 'next/router'

const Register = () => {

  const [name,setName]=useState("")
  const [email,setEmail]=useState("") 
  const [password,setPassword]=useState("") 
  const [loading,seLoading]=useState(false) 

  const router=useRouter()

  const {state:{user},dispatch}=useContext(Context)

  useEffect(()=>{

    if(user!==null){
      router.push("/")
    }
  },[user])



  const handleSubmit= async (e)=>{
    e.preventDefault()

    try{
      seLoading(true)
      const {data} =await axios.post(`/api/register`,{
        name, email , password
      })
      console.log("REGISTER RESPONSE",data)
      toast.success("Registration Successfull, Please Log in")
      seLoading(false)
    }
    catch(err){
      toast.error(err.response.data)
      seLoading(false)
    }
    
  }

  return (
    <div>
            <h1 className='jumbotron bg-primary square text-center'>Register</h1>
            <div className='container col-md-4 offset-md-4 pb-5'>
                <form onSubmit={handleSubmit}>
                    <input 
                    value={name} 
                    onChange={(e)=>setName(e.target.value)}
                    type="text" className='form-control mb-4 p-4'
                    placeholder='Enter Name'
                    required
                    ></input>

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
                    <button disabled={!name || !email || !password || loading} type='submit' className='btn text-center px-4 btn-primary btn-lg btn-block'> 
                     {loading?<SyncOutlined></SyncOutlined>:"Submit"} 
                    </button>
                  </div>

                </form>
                
                <p className='text-center p-3'>
                    Already registered ? {" "}
                    <Link href="/login">
                      <a>Login</a>
                    </Link>
                </p>
            </div>


    </div>
  )
}

export default Register