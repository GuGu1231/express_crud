document.getElementById("registerform").addEventListener("submit", (event) => {
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
