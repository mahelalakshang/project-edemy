import React, { useEffect, useState, useContext } from 'react'
import {Menu} from 'antd'
import Link from "next/link"
import {AppstoreOutlined,LoginOutlined,UserAddOutlined,LogoutOutlined,CoffeeOutlined} from '@ant-design/icons'
import { Context } from '../context'
import axios from 'axios'
import { toast } from 'react-toastify'
import { useRouter } from 'next/router'
import SubMenu from 'antd/lib/menu/SubMenu'

const {Item,ItemGroup} = Menu

const TopNav = () => {

  const [current,setCurrent]=useState("")

  const {state,dispatch}=useContext(Context)
  const {user} = state

  console.log(state)

  const router=useRouter()

  useEffect(()=>{
    process.browser && setCurrent(window.location.pathname)
  },[process.browser && window.location.pathname, user,user?.name])


  const logout=async ()=>{
    dispatch({
      type:"LOGOUT",payload:data
    })
    window.localStorage.removeItem("user")
    const {data}=await axios.get("/api/logout")
    toast(data.message)
    router.push("/login")

  }

  return (
    <Menu mode='horizontal' selectedKeys={[current]}>
        <Item key="/" onClick={(e)=>setCurrent(e.key)} icon={<AppstoreOutlined />}>
          <Link href="/">App</Link>
        </Item>

        {
          user ==null &&(
            <>
              <Item key="/login" onClick={(e)=>setCurrent(e.key)} icon={<LoginOutlined />}>
                 <Link href="/login">Login</Link>
              </Item>
              <Item key="/register"  onClick={(e)=>setCurrent(e.key)} icon={<UserAddOutlined />}>
                 <Link href="/register">Register</Link>
              </Item>
            </>
          )
        }

        {
          user!==null &&  (
          <SubMenu  className='float-right' icon={<CoffeeOutlined/>} title={user.name}>
            <ItemGroup>
            <Item key="/user">
                <Link href="/user">
                  <a>Dashboard</a>
                </Link>
              </Item>

              <Item  className='' key="/logout"  onClick={logout} icon={<LogoutOutlined />}>
               Logout
              </Item>
            </ItemGroup>

          </SubMenu>
          )
        }
       
    </Menu>
  )
}

export default TopNav