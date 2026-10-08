import pool from "../../lib/db";
import crypto from 'crypto';

export async function transferMoney(data) {


   const connection = await pool.getConnection();

   const { sender_id, reciever_id, amount, description} = data;
   const referenceId = crypto.randomUUID(); // e.g., "1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed"

   const senderInfo = {
      "wallet_id" : 0,
      "transaction_type" : "DEBIT",
      "balance_before" : 0,
      "balance_after" : 0,
      "referenceId" : referenceId
   };

   const recieverInfo = {
      "wallet_id": 0,
      "transaction_type" : "CREDIT",
      "balance_before" : 0,
      "balance_after" : 0,
      "referenceId" : referenceId
   };

   if(sender_id == reciever_id){
      return {
         status: false,
         data: null,
         message: "Sender and reviever has same wallet. Please choose other one"
      };
      // senderInfo.transaction_type = "TRANSFER";
      // recieverInfo.transaction_type = "TRANSFER";
   }
   
   if(Number(amount) <= 0){
      return {
         status: false,
         data: null,
         message: "Amount should be greater than 0"
      };
   }

   try {

      await connection.beginTransaction();

      const [isSenderExist] = await pool.execute("SELECT * FROM users WHERE `id` = ?",[sender_id]);
      const [isRecieverExist] = await pool.execute("SELECT * FROM users WHERE `id` = ?",[reciever_id]);


      if(isSenderExist.length === 0){
         return {
            status: false,
            data: null,
            message: "Sender information is invalid"
         };
      }

      if(Number(isSenderExist[0]['status']) !== 1){
         return {
            status: false,
            data: null,
            message: "Sender is inactive"
         };
      }

      if(isRecieverExist.length === 0){
         return {
            status: false,
            data: null,
            message: "Reciever information is invalid"
         };
      }

      if(Number(isRecieverExist[0]['status']) !== 1){
         return {
            status: false,
            data: null,
            message: "Reciever is inactive"
         };
      }

      const [isSenderWalletExist] = await pool.execute("SELECT * FROM wallets WHERE `user_id` = ? AND `status` = 1",[sender_id]);
      const [isRecieverWalletExist] = await pool.execute("SELECT * FROM wallets WHERE `user_id` = ? AND `status` = 1",[reciever_id]);

      if(isSenderWalletExist.length === 0){
         return {
            status: false,
            data: null,
            message: "Sender wallet not available"
         };
      }

      if(Number(isSenderWalletExist[0]['balance']) <= 0 || Number(isSenderWalletExist[0]['balance']) < Number(amount)){
         return {
            status: false,
            data: isSenderWalletExist[0]['balance'],
            message: "insufficient balance in sender account"
         };
      }

      if(isRecieverWalletExist.length === 0){
         return {
            status: false,
            data: null,
            message: "Reciever wallet not available"
         };
      }

      const beforeTxnAmount = Number(isSenderWalletExist[0]['balance']) + Number(isRecieverWalletExist[0]['balance']);
      senderInfo.wallet_id = isSenderWalletExist[0]['id'];
      recieverInfo.wallet_id = isRecieverWalletExist[0]['id'];

      senderInfo.balance_before = Number(isSenderWalletExist[0]['balance']);
      recieverInfo.balance_before = Number(isRecieverWalletExist[0]['balance']);

      const amountDeduct = Number(isSenderWalletExist[0]['balance']) - Number(amount);
      const amountAdded = Number(isRecieverWalletExist[0]['balance']) + Number(amount);

      senderInfo.balance_after = amountDeduct;
      recieverInfo.balance_after = amountAdded;

      // For Sender 
      const [senderResult] = await pool.execute(
         "INSERT INTO wallet_transactions (`user_id`, `wallet_id`, `reference_id`, `transaction_type`, `amount`, `balance_before`, `balance_after`, `description`) VALUES (?, ?, ?, ?, ?, ?, ?, ?)", 
         [sender_id, senderInfo.wallet_id, senderInfo.referenceId, senderInfo.transaction_type, Number(amount), senderInfo.balance_before, senderInfo.balance_after, description]
      );

      // For Reciever 
      const [recieverResult] = await pool.execute(
         "INSERT INTO wallet_transactions (`user_id`, `wallet_id`, `reference_id`, `transaction_type`, `amount`, `balance_before`, `balance_after`, `description`) VALUES (?, ?, ?, ?, ?, ?, ?, ?)", 
         [reciever_id, recieverInfo.wallet_id, recieverInfo.referenceId, recieverInfo.transaction_type, Number(amount), recieverInfo.balance_before, recieverInfo.balance_after, description]
      );

      if (senderResult.insertId && recieverResult.insertId) {
         
         const [sBalUpdate] = await pool.execute(
            "UPDATE wallets SET `balance` = ? WHERE `id` = ?",
            [amountDeduct, senderInfo.wallet_id]
         );

         const [rBalUpdate] = await pool.execute(
            "UPDATE wallets SET `balance` = ? WHERE `id` = ?",
            [amountAdded, recieverInfo.wallet_id]
         );

         
         if(sBalUpdate.affectedRows == 1 && rBalUpdate.affectedRows == 1){

            const [checkSenderWallet] = await pool.execute("SELECT * FROM wallets WHERE `user_id` = ? AND `status` = 1",[sender_id]);
            const [checkRecieverWallet] = await pool.execute("SELECT * FROM wallets WHERE `user_id` = ? AND `status` = 1",[reciever_id]);
            const afterTxnAmount = Number(checkSenderWallet[0]['balance']) + Number(checkRecieverWallet[0]['balance']);

            if(beforeTxnAmount === afterTxnAmount){
                   await connection.commit();

               return {
                  status: true,
                  data: amount,
                  message: "Money transfer successfully"
               };
            }
            else{
               return {
                  status: false,
                  data: null,
                  message: "Something went wrong"
               };   
            }
         } else {
            return {
               status: false,
               data: null,
               message: "Something went wrong"
            };
         }
      }
   } catch (error) {
          await connection.rollback();

      return {
         status: false,
         data: error,
         message: error.message || "Something went wrong"
      };
   }
   finally{
      connection.release();
   }
}


export async function getTransactions(user_id) {

   try {
      const [isExist] = await pool.execute(
         "SELECT * FROM wallet_transactions WHERE `user_id` = ?",
         [user_id]
      );
         
      return {
         status: true,
         data: isExist,
         message: "Transaction List"
      };
   
   } catch (error) {
      return {
         status: false,
         data: error,
         message: error.message || "Something went wrong"
      };
   }
}
