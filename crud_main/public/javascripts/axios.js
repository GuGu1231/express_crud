document.addEventListener("DOMContentLoaded", () => {
  document
    .getElementById("registerform")
    .addEventListener("submit", (event) => {
      // 이 코드가 없으면, 기본 동작이 실행되어 예상치 못한 결과를 초래
      // 새로고침 or 웹 페이지 이동으로 아래의 JS 코드가 끊김
      event.preventDefault();
      // input[name="nickname"]은 name 속성이 nickname인 첫 번째 input 요소 선택
      var nickname = document.querySelector('input[name="nickname"]').value;
      var email = document.querySelector('input[name="email"]').value;
      var password = document.querySelector('input[name="password"]').value;
      axios
        .post("/auth/register_process", {
          nickname: nickname,
          email: email,
          password: password,
        })
        .then((response) => {
          if (response.data.success) {
            Swal.fire({
              title: "회원가입 완료",
              text: "로그인을 진행하십시오",
              icon: "success",
            }).then(() => {
              window.location.href = "/auth/login"; // 로그인 페이지로 이동
            });
          } else {
            Swal.fire({
              title: "Error!",
              text: "회원가입 중 오류가 발생했습니다: " + response.data.message,
              icon: "error",
            }).then(() => {
              window.location.href = "/auth/register";
            });
          }
        })
        .catch((error) => {
          console.log(error);
        });
    });
});
//이 스크립트 파일이 웹 애플리케이션의 모든 페이지에 포함되어 있기에 발생하는 문제(모든 페이지 or 이상한 특정 페이지 실행)
// writing에 대해서만 작동하도록 만들어야 함
// axios 요청을 보낼 때 URL에 QueryString을 포함시키는 것은 매우 중요(서버에서 요청을 더 세밀하게 처리 가능)
document.addEventListener("DOMContentLoaded", () => {
  const links = document.querySelectorAll(".writing-link");
  links.forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      const requestUrl = link.getAttribute("href"); // link의 속성을 가져옴
      axios
        .get(requestUrl)
        .then((response) => {
          window.location.href = requestUrl;
        })
        .catch((error) => {
          // Axios는 오류 응답을 error.response 객체 안에 담음
          if (error.response && error.response.status === 401) {
            // 인증 실패 시 SweetAlert2 알림 표시
            Swal.fire({
              icon: "error",
              title: "인증 실패",
              text: error.response.data.message,
            }).then(() => {
              window.location.href = "/auth/login"; // 로그인 페이지로 이동
            });
          } else {
            // 기타 에러 처리
            console.error("An error occurred:", error);
          }
        });
    });
  });
});
