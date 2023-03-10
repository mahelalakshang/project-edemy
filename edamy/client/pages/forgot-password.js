import React, { useContext, useEffect, useState } from 'react'
import axios from 'axios'

import {toast} from 'react-toastify'
import {SyncOutlined} from '@ant-design/icons'
import Link from 'next/link'
import { Context } from '../context'
import { useRouter } from 'next/router'



const forgotPassword = () => {

  const [email,setEmail]=useState('')
  const [success,setSuccess]=useState(false)
  const [code,setCode]=useState('')
  const [newPassword,setNewPassword]=useState('')
  const [loading,setLoading]=useState(false)

  const {state:{user}}=useContext(Context)
  const router=useRouter()

  useEffect(()=>{
    if(user!==null){
        router.push("/")
    }
  },[user])

  const handleSubmit=async(e)=>{
    e.preventDefault()
    try{
        
        setLoading(true)
        const {data}=await axios.post("/api/forgot-password",{email})
        setSuccess(true)
        toast("check your email for the secret code")
        setLoading(false)
    }
    catch(e){
        setLoading(false)
        toast(e.response.data)
    }
  }

  const handleResetPass=async(e)=>{
    e.preventDefault()
    try{    
      setLoading(true)
      const {data}=await axios.post("/api/reset-password",{email,code,newPassword})
      setEmail('')
      setCode('')
      setNewPassword('')
      setLoading(false)
      toast("Great! Now you can login using new password")
        
    }
    catch(e){
      setLoading(false)
      toast(e.response.data)
    }
  }

  return (
    <div>
        <h1 className='jumbotron text-center bg-primary square'>Fogot Password</h1>

        <div className='containe col-md-4 offset-md-4 pb-5'>
            <form onSubmit={success?handleResetPass:handleSubmit}>
                <input
                    type="email"
                    className="form-control mb-4 p-4"
                    value={email}
                    onChange={(e)=>setEmail(e.target.value)}
                    placeholder="Enter email"
                    required
                />

                {
                  success && (
                 <>
                    <input
                    type="text"
                    className="form-control mb-4 p-4"
                    value={code}
                    onChange={(e)=>setCode(e.target.value)}
                    placeholder="Enter secret code"
                    
                />
                    <input
                    type="password"
                    className="form-control mb-4 p-4"
                    value={newPassword}
                    onChange={(e)=>setNewPassword(e.target.value)}
                    placeholder="Enter New Password"
                    
                />        
                 </>
                  )
                }

                <button className='btn btn-primary btn-block p-2' disabled={loading || !email}>
                {
                   loading?<SyncOutlined spin /> :"Submit"     
                }
                </button>
            </form>
        </div>
    </div>
  )
}

export default forgotPassword