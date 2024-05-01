import { connect } from "@/dbConfig/dbConfig";
import User from '@/models/user.model'
import { NextRequest, NextResponse } from 'next/server'
import bcryptjs from "bcryptjs"
import jwt from 'jsonwebtoken'


connect()

export async function POST(request: NextRequest) {
    try {
        const reqBody = await request.json()
        const {username, password} = reqBody;
    
        const user = await User.findOne({username})
    
        if(!user){
            return NextResponse.json(
            {
                error: "User does not exists"
            },
            {
                status: 400
            })
        }
        console.log("user exists");
    
    
        const validpassword = await bcryptjs.compare(password, user.password);
    
        if(!validpassword){
            return NextResponse.json(
                {
                    error: "check your credentials"
                },
                {status: 400}
            )
        }
    
        const tokenData = {
            id: user._id,
            
        }
    
        const token = await jwt.sign(tokenData, process.env.TOKEN_SECRET!, {expiresIn: '1d'})
    
        const response = NextResponse.json({
            message: "logged in success",
            success: true
        })
    
        response.cookies.set("token", token, {
            httpOnly: true
        })
        return response;
    } catch (error:any) {
        return NextResponse.json({error: error.message},{status:500})
    }

}