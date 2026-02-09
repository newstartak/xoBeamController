export default function CustomGroupItem( {index, deviceName, ip, loading, RemoveData, SendSignal} ) {
  return (
    <li
      className='groupItem'

      style={{ backgroundColor: index % 2 == 1 ? 'beige' : 'white' }}>

      <span
        style={{ width: '30%' }}>
        {deviceName}
      </span>
      <span
        style={{ width: '30%' }}>
        {ip}
      </span>

      <div>
        <button
          style={{ marginRight: '5px' }}

          disabled={loading}

          onClick={RemoveData}>제거</button>
        <button
          style={{ marginRight: '5px' }}

          disabled={loading}

          onClick={SendSignal}>신호</button>
      </div>

    </li>
  )

}