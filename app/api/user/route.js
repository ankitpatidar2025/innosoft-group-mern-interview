import { NextResponse } from "next/server";
import { createUser } from "../../services/user/user.service";

// Create User API
export async function POST(request) {
   try {
      const body = await request.json(); 
      const response = await createUser(body);

      return NextResponse.json(response, { 
         status: response.status ? 200 : 400 
      });

   } catch (error) {
      return NextResponse.json(
         { status: false, message: "Invalid JSON body provided" },
         { status: 400 }
      );
   }
}
