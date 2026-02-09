import { useEffect, useState } from 'react';
import database from '../firebaseClient.js'
import { ref, onValue } from "firebase/database";
import { useNavigate, Navigate } from "react-router-dom";

import serverDestination from "../vars.jsx";

import '../App.css';

import CustomInput from '../custom/customInput.jsx';
import CustomGroupItem from '../custom/customGroupItem.jsx';

export default function MainPage() {

  if (localStorage.getItem("loginUser") === "")
  {
    return <Navigate to="/" replace />;
  }

  /**
   * TCP 통신 중임을 나타내며 버튼 등의 상호작용을 잠시 막을 때 사용
   */
  const [loading, setLoading] = useState(false);

  /**
   * Firebase RealTime Database에서 가져온 빔프로젝터 및 유저 정보
   */
  const [jsonData, setJsonData] = useState([]);

  /**
   * 장소, 기기명, IP 입력에 사용되는 인풋 필드
   */
  const [placeInput, setPlaceInput] = useState('');
  const [deviceNameInput, setDeviceNameInput] = useState('');
  const [ipInput, setIpInput] = useState('');

  /**
   * 실시간으로 Firebase 데이터베이스 변경사항 감지하여 페이지에 바로 적용
   */
  useEffect(() => {
    const rtdb = ref(database, 'Beams')

    onValue(rtdb, (snapshot) => {
      console.log("firebase RTDB에 변경사항이 감지되었습니다.")

      if (!snapshot.exists()) {
        setJsonData(null)

        return;
      }

      const newData = snapshot.val();

      setJsonData(newData)
    })

  }, [])

  /**
   * 데이터베이스에 새로운 빔프로젝터 정보 추가
   */
  const SetData = async () => {
    if(!placeInput || !deviceNameInput || !ipInput)
    {
      alert("모든 값을 입력해주세요.")
      return;
    }

      for (var [dName, ip] of Object.entries(jsonData[placeInput] || []))
      {
        if(ipInput === ip.ip)
        {
          alert("그룹 내에 이미 동일한 IP가 존재합니다.")
          return
        }
        if(deviceNameInput === dName)
        {
          alert("그룹 내에 이미 동일한 이름의 기기가 존재합니다.")
          return
        }
    }

    try {
      const res = await fetch(`${serverDestination}/beam`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify
          ({
            id: localStorage.getItem("loginUser"),
            place: placeInput,
            deviceName: deviceNameInput,
            ip: ipInput
          })
        });

      const text = await res.text();

      alert(text);
    } catch (err) {
      alert('에러: ' + err.message);
    } finally {
      
    }
  }

  /**
   * 데이터베이스에 존재하는 빔프로젝터 정보 제거
   * @param {string} curPlace 제거하고자 하는 정보의 장소
   * @param {string} curDName 제거하고자 하는 정보의 기기명
   */
  const RemoveData = async (curPlace, curDName) => {
    try {
      const res = await fetch(`${serverDestination}/beam`,
        {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify
          ({
            id: localStorage.getItem("loginUser"),
            place: curPlace,
            deviceName: curDName,
          })
        });

      const text = await res.text();

      alert(text);
    } catch (err) {
      alert('에러: ' + err.message);
    } finally {
      
    }
  }

  const SendSignal = async (ip) => {
    setLoading(true);
    try
    {
      const res = await fetch(`${serverDestination}/tcp/ping`,
      {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify
        ({
          id: localStorage.getItem("loginUser"),
          ip: ip
        })
      });
      
      const text = await res.text();

      alert(text);
    } catch (err) {
      alert('에러: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const navigate = useNavigate()

  const logout = () =>
  {
    localStorage.setItem("loginUser", "")

    navigate("/", { replace: true })
  }

  return (
    <>
      환영합니다. {localStorage.getItem("loginUser")}님.

      <button onClick={logout}>로그아웃</button>  <br/>

      <div className='inputsContainer'>
        <CustomInput
          name='장소' placeholder='ex: 7F, 8F...'
          value={placeInput}
          onChange={(e) => setPlaceInput(e.target.value)}
        />
        <CustomInput
          name='기기명' placeholder='ex: main projector...'
          value={deviceNameInput}
          onChange={(e) => setDeviceNameInput(e.target.value)}
        />
        <CustomInput
          name='IP' placeholder='ex: 192.168.x.xxx...'
          value={ipInput}
          onChange={(e) => setIpInput(e.target.value)}
        />
        <div className='inputsItem'>
          <button
            style={{height:'35px'}}

            disabled={loading}

            onClick={SetData}>추가</button>
        </div>
      </div>

      {jsonData && Object.entries(jsonData).map(([place, placeVal], index) => {
        return (
            <details
              key={index}
              className='group'>

              <summary>{place}</summary>

              {Object.entries(placeVal).map(([deviceName, ip], index) =>
              {
                return (

                  <CustomGroupItem
                    key={index}

                    index={index}
                    deviceName={deviceName}
                    ip={ip.ip}
                    loading={loading}

                    RemoveData={() => RemoveData(place, deviceName)}
                    SendSignal={() => SendSignal(ip.ip)}
                  />
                  
                )
              })}
              
            </details>
        )
      })}
      
    </>
  );
}