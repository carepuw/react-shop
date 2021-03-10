export const api = async (url: string, method: string, body: any) => {
  const data = await fetch(`${url}`, {
    method,
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  }).then(d => d.json())
  return data;
}
