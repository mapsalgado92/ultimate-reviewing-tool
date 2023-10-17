const AreaInput = ({ label, form, field }) => {
  return (
    <>
      <label className="label">{label}</label>
      <textarea
        className="textarea is-size-6"
        value={form.get(field)}
        onChange={(e) => {
          form.set(field, e.target.value)
        }}
      />
    </>
  )
}

export default AreaInput
