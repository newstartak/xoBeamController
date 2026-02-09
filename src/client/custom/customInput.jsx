export default function CustomInput({name, placeholder, value, onChange})
{
  return (
    <>
      <div className='inputsItem'>
          <b>{name}</b><br/>
          <input
            style={{height:'30px'}}

            placeholder={placeholder}

            value={value}
            onChange={onChange}
          />
        </div>
    </>
  )
}