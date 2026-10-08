import { NextResponse } from "next/server";
import { transferMoney } from "../../../services/transaction/transaction.service";

// Create User API
export async function POST(request) {
   try {
      const body = await request.json(); 
      const response = await transferMoney(body);
      
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

