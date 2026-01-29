import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
dotenv.config();

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

async function check() {
    // Get all users in the 'users' table
    const { data: users, error } = await supabase.from('users').select('*');
    if (error) {
        console.error("Error fetching users:", error);
        return;
    }
    console.log("Users in DB:", users);
}

check();
