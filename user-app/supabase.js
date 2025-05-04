// utils/supabaseFetch.js
const SUPABASE_URL = "";
const SUPABASE_KEY = ""

export async function readTable(tableName, { from, to } = {}) {
  let url = `${SUPABASE_URL}/rest/v1/${tableName}?select=*`;

  if (from && to) {
    url += `&date=gte.${from}&date=lte.${to}`;
  }

  const res = await fetch(url, {
    headers: {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch data: " + res.statusText);
  }

  return res.json();
}