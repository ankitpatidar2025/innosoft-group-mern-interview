import pool from "../../lib/db";

export async function createUser(data) {
   const { name, email } = data;

   try {
      const [result] = await pool.execute(
         "INSERT INTO users (`name`, `email`, `status`) VALUES (?, ?, ?)",
         [name, email, 1]
      );

      if (result.insertId) {
         return {
            status: true,
            data: result.insertId,
            message: "User created successfully"
         };
      } else {
         return {
            status: false,
            data: null,
            message: "Something went wrong"
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
