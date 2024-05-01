'use client'
import React, { useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';


export default function profilePage() {

  const router = useRouter();
  const [data, setData] = useState("click me to Fetch data");

  const getUserDetails = async () => {
    const response = await axios.post("/api/users/me");
    console.log(response.data);
    setData(response.data.data._id);
    
  }


  const logout = async () => {
    try {
      await axios.get("/api/users/logout")
      toast.success("logout success")
      router.push("/login")
    } catch (error:any) {
      console.log(error.message);
      toast.error(error.message);
    }
  }

  return (
    <div className='flex flex-col items-center justify-center min-h-screen py-2'>
      <h1>Profile page</h1>
      <hr />
      <h2>{data === "click me to Fetch data" ? "Nothing" : <Link href={`/profile/${data}`}>{data}</Link>}</h2>
      <hr />
      <button onClick={logout}
      className=' bg-blue-500 mt-4 hover:bg-blue-700 text-white font-bold py2 px-4 rounded'
      >Logout</button>
      <button onClick={getUserDetails}
      className=' bg-green-500 mt-4 hover:bg-blue-700 text-white font-bold py2 px-4 rounded'
      >get User details</button>
    </div>
  );
}


