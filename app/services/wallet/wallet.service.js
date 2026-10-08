import pool from "../../lib/db";

export async function createWallet(data) {
   const { user_id, balance, currency } = data;

   try {
      const [isExist] = await pool.execute(
         "SELECT `id` FROM wallets WHERE `user_id` = ? AND `status` = 1",
         [user_id]
      );

      if(isExist.length > 0){
         return {
            status: false,
            data: null,
            message: "Only one wallect active at a time"
         };
      }
      const [result] = await pool.execute(
         "INSERT INTO wallets (`user_id`, `balance`, `currency`, `status`) VALUES (?, ?, ?, ?)",
         [user_id, Number(balance), currency, 1]
      );

      if (result.insertId) {
         return {
            status: true,
            data: result.insertId,
            message: "Wallet created successfully"
         };
      } else {
         return {
            status: false,
            data: null,
            message: "Something went wrong, user not inserted."
         };
      }
   
   } catch (error) {
      return {
         status: false,
         data: error,
         message: error.message || "Something went wrong"
      };
   }
}


export async function deposit(data) {
   
   const { wallet_id, balance } = data;

   try {
      const [isExist] = await pool.execute(
         "SELECT `id`,`balance` FROM wallets WHERE `id` = ? AND `status` = 1",
         [wallet_id]
      );

      if(Number(balance) <= 0){
         return {
            status: false,
            data: null,
            message: "Money is greater than 1"
         };
      }

      
      if(isExist.length > 0){
         const newBalance = Number(balance) + Number(isExist[0]['balance']);
         const [result] = await pool.execute(
            "UPDATE wallets SET `balance` = ? WHERE `id` = ?",
            [newBalance, wallet_id]
         );

         console.log(result);
         if(result.affectedRows == 1){     

            const [balanceHistory] = await pool.execute(
               "INSERT INTO wallet_history (`wallet_id`, `amount`) VALUES (?, ?)",
               [wallet_id, Number(balance)]
            );

            return {
               status: true,
               data: newBalance,
               message: "Money added into wallet"
            };
         } else {
            return {
               status: false,
               data: null,
               message: "Something went wrong"
            };
         }
      }
      else{
         return {
            status: false,
            data: null,
            message: "Only one wallect active at a time"
         };
      }
   
   } catch (error) {
      return {
         status: false,
         data: error,
         message: error.message || "Something went wrong"
      };
   }
}


export async function getBalance(wallet_id) {

   try {
      const [isExist] = await pool.execute(
         "SELECT * FROM wallets WHERE `id` = ?",
         [wallet_id]
      );
         

      return {
         status: true,
         data: isExist,
         message: "Wallet balance"
      };
   
   } catch (error) {
      return {
         status: false,
         data: error,
         message: error.message || "Something went wrong"
      };
   }
}


export async function getWalletSummary(wallet_id) {

   try {
      const result = {
         "balance": 0,
         "total_credit": 0,
         "total_debit": 0,
         "total_transferred": 0
      };

      const [balanceData] = await pool.execute(
         "SELECT `balance` FROM wallets WHERE `id` = ?",
         [wallet_id]
      );
      
      const [cTxnData] = await pool.execute(
         "SELECT SUM(`amount`) as total FROM wallet_transactions WHERE `wallet_id` = ? AND `transaction_type` = 'CREDIT'",
         [wallet_id]
      );

      const [dTxnData] = await pool.execute(
         "SELECT SUM(`amount`) as total FROM wallet_transactions WHERE `wallet_id` = ? AND `transaction_type` = 'DEBIT'",
         [wallet_id]
      );

      const [tTxnData] = await pool.execute(
         "SELECT SUM(`amount`) as total FROM wallet_transactions WHERE `wallet_id` = ? AND `transaction_type` = 'TRANSFER'",
         [wallet_id]
      );
      
      
      result.balance = balanceData[0]['balance'] || 0;
      result.total_credit = cTxnData[0]['total'] || 0;
      result.total_debit = dTxnData[0]['total'] || 0;
      result.total_transferred = tTxnData[0]['total'] || 0;

      return {
         status: true,
         data: result,
         message: "Wallet balance"
      };
   
   } catch (error) {
      return {
         status: false,
         data: error,
         message: error.message || "Something went wrong"
      };
   }
}
