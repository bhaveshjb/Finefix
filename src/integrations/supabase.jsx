import { createClient } from "@supabase/supabase-js";
import { getEnv } from "@/utils/env";

// const proxy = "https://cors-anywhere.herokuapp.com/corsdemo";
const proxy = "https://cors-anywhere.herokuapp.com/";

const { supabaseUrl, supabaseAnonKey } = getEnv();

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default supabase;
