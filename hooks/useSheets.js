const useSheets = () => {
  const pull_data = async (sheet_name, authorization) => {
    let options = {
      method: "GET",
      headers: { authorization: authorization },
    }
    let res = await fetch(
      `/api/gsheet?sheet=${sheet_name}&left=A&right=Z`,
      options
    ).catch((e) => console.log(e))
    let json = await res.json().catch((e) => console.log(e))
    return json.data
  }

  const pull_rca = async (sheet_name, authorization) => {
    let options = {
      method: "GET",
      headers: { authorization: authorization },
    }
    let res = await fetch(
      `/api/gsheet?sheet=${sheet_name}&left=A1&right=A1`,
      options
    ).catch((e) => console.log(e))
    let json = await res.json().catch((e) => console.log(e))

    console.log("JSON--->", json, options)
    return json.data
  }

  const push_data = async (sheet_name, data, authorization) => {
    let options = {
      method: "POST",
      headers: { authorization: authorization },
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
