import { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";

import serverDestination from "../vars.jsx";

export default function LoginPage() {

  /**
   * 로그인 이력이 이미 존재하는 경우 로그인 페이지 생략 후 바로 메인 페이지로 리다이렉팅팅
   */
  if (localStorage.getItem("loginUser") !== "")
  {
    return <Navigate to="/main" replace />;
  }

  const navigate = useNavigate();

  /**
   * 로그인 성공 시 로컬스토리지에 id 값 저장하고 메인 페이지로 이동
   * !!! 로컬스토리지에 로그인 인증 정보 저장은 악의적 조작 공격 가능성이 있어 위험, 추후 jwt 토큰 발급 방식으로 변경
   */
  const loginSuccess = () => {
    localStorage.setItem("loginUser", id)
    navigate("/main", { replace: true });
  };

  const [id, setId] = useState('');
  const [pw, setPw] = useState('');

  const tryRegister = async (event) => {

    event.preventDefault();

    try {
      const res = await fetch(`${serverDestination}/auth/register`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: id, pw: pw })
        });

      const text = await res.text();

      alert(text);
    }
    catch (err)
    {
      alert('에러: ' + err.message);
    }
    finally 
    {
      
    }
  };

    const tryLogin = async (event) => {

    event.preventDefault();

    try {
      const res = await fetch(`${serverDestination}/auth/login`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: id, pw: pw })
        });

      const text = await res.text();

      if(text.trim() === "loginSuccess")
      {
        loginSuccess()
      }
      else if(text.trim() === "invalidId")
      {
        alert("아이디가 존재하지 않습니다.")
      }
      else if(text.trim() === "invalidPw")
      {
        alert("비밀번호가 틀렸습니다.")
      }

    } catch (err) {
      alert('에러: ' + err.message);
    } finally {
      
    }
  };


  return (
    <>

      <form onSubmit={tryLogin}>
        <input
          type=""
          value={id}
          onChange={(e) => setId(e.target.value)}
          placeholder="ID" />

        <input
          type="password"

          value={pw}
          onChange={(e) => setPw(e.target.value)}
          placeholder="Password" />

        <button type="submit">로그인</button>
      </form>

      <button onClick={tryRegister}>회원가입</button>

    </>
  )
}