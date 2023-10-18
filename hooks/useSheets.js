const useSheets = () => {
  const pull_data = async (sheet_name) => {
    let res = await fetch(
      `/api/gsheet?sheet=${sheet_name}&left=A&right=Z`
    ).catch((e) => console.log(e))
    let json = await res.json().catch((e) => console.log(e))
    return json.data
  }

  const pull_rca = async (sheet_name) => {
    let res = await fetch(
      `/api/gsheet?sheet=${sheet_name}&left=A1&right=A1`
    ).catch((e) => console.log(e))
    let json = await res.json().catch((e) => console.log(e))
    return json.data
  }

  const push_data = async (sheet_name, data) => {
    let options = {
      method: "POST",
      body: JSON.stringify({ data: data }),
    }
    let res = await fetch(
      `/api/gsheet?sheet=${sheet_name}&left=A&right=Z`,
      options
    ).catch((e) => console.log(e))
    return res.json().catch((e) => console.log(e))
  }

  return { pull_data, push_data, pull_rca }
}

export default useSheets
