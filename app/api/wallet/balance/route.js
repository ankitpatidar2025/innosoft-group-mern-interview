import { NextResponse } from "next/server";
import { getBalance } from "../../../services/wallet/wallet.service";
import { URL } from "url";

// Create User API
export async function GET(request) {
   try {
      
      const {searchParams} = new URL(request.url);
      
      const walletId = searchParams.get("wallet_id");
      const response = await getBalance(walletId);
      
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

