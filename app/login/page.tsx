"use client";
import { useEffect, useState } from "react";

import Link from "next/link";

import { useRouter } from "next/navigation";
import { useUserIdStore } from "../store";
import { useCookies } from "react-cookie";

import Container from "@/components/container";

export default function Page() {
  const router = useRouter();
  const [userID, setUserID] = useState("");
  const [userPW, setUserPW] = useState("");

  const [cookies, ,] = useCookies(["csrftoken"]);

  const [err, setErr] = useState("");

  const { userId, setUserId } = useUserIdStore();

  // useEffect(() => {
  //   if (userId) {
  //     router.back();
  //   }
  // }, [userId, router]);

  const payload = {
    username: userID,
    password: userPW,
  };

  async function userDataFetch() {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/login/`, {
      method: "post",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": cookies.csrftoken,
      },
      body: JSON.stringify(payload),
      credentials: "include",
    });
    const userData = await res.json();
    if (userData) {
      setUserId(userData?.user?.id);
    }
    return userData;
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const userData = await userDataFetch();
    if (userData.message === "SUCCESS") {
      window.location.href = "/";
    } else {
      setErr(userData?.message);
    }
  }

  return (
    <Container>
      <div className="min-h-full flex flex-1">
        <div className="min-h-full w-full flex flex-col justify-center items-center">
          <div className="bg-white  w-[285px] h-[495px] sm:w-[600px] sm:h-[600px]  rounded-lg text-center  ">
            <form onSubmit={handleSubmit} className="px-[24px] py-[45px]">
              <div className="mb-[30px] text-[35px]">
                <span>로그인</span>
              </div>
              <div className="mb-[15px]">
                <input
                  type="text"
                  value={userID}
                  onChange={(event) => setUserID(event.target.value)}
                  placeholder="사용자 이름"
                  className="w-[100%] h-[45px] sm:w-[460px] sm:h-[50px] bg-[#dedede] sm:bg-[#dedede] pl-[20px]  
            "
                />
              </div>
              <div className="mb-[10px]">
                <input
                  type="password"
                  value={userPW}
                  onChange={(event) => setUserPW(event.target.value)}
                  placeholder="비밀번호"
                  className="w-[100%] h-[45px] sm:w-[460px] sm:h-[50px] bg-[#dedede] pl-[20px] sm:bg-[#dedede]"
                />
              </div>
              <div className={`${err !== "" ? "block" : "hidden"} mb-[25px]`}>
                <span className="text-red-500 text-[14px]">{err}</span>
              </div>
              <div className="flex justify-end mb-[35px] gap-2 sm:pr-[50px]">
                <Link href="">
                  <span>아이디 찾기</span>
                </Link>
                <Link href="/find-password">
                  <span>비밀번호 찾기</span>
                </Link>
              </div>
              <div>
                <button
                  type="submit"
                  className="h-10 w-full sm:w-[450px] bg-primary text-white mb-[10px] rounded-lg "
                >
                  로그인
                </button>
              </div>
              <Link href="/signup">
                <div>
                  <button className="h-10 w-full sm:w-[450px] border-primary border rounded-lg ">
                    회원가입
                  </button>
                </div>
              </Link>
            </form>
          </div>
        </div>
      </div>
    </Container>
  );
}
