import { NextResponse } from "next/server";
import { getTransactions } from "../../../services/transaction/transaction.service";
import { URL } from "url";

// Create User API
export async function GET(request) {
   try {
      
      const {searchParams} = new URL(request.url);
      
      const userID = searchParams.get("user_id");
      const type = searchParams.get("type");
      const response = await getTransactions(userID);
      
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

