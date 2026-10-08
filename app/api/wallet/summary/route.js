import { NextResponse } from "next/server";
import { getWalletSummary } from "../../../services/wallet/wallet.service";
import { URL } from "url";

// Create User API
export async function GET(request) {
   try {
      
      const {searchParams} = new URL(request.url);
      const walletID = searchParams.get("wallet_id");
      const response = await getWalletSummary(walletID);
      
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

