import { uniqueId } from "lodash"

const ReviewerList = ({ label, filter_handler, field, data }) => {
  return (
    <>
      <div className="field">
        <label className="label">{label}</label>
        <div className="control select is-small is-fullwidth">
          <select
            onChange={(e) => {
              filter_handler(field, e.target.value)
            }}
          >
            {["All Reviewers", ...new Set(data.map((record) => record[field]))]
              .filter((r) => r)
              .map((r) => (
                <option key={uniqueId()}>{r}</option>
              ))}
          </select>
        </div>
      </div>
    </>
  )
}

export default ReviewerList
