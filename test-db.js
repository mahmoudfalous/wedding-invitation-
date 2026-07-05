async function run() {
  const url = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/`;
  const headers = {
    'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`
  };
  try {
    const res = await fetch(url, { headers });
    const data = await res.json();
    console.log('Available tables/paths:', Object.keys(data.paths || {}));
  } catch (err) {
    console.error('Error fetching schema:', err);
  }
}
run();
