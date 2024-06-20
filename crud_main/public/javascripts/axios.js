document.querySelector("form").addEventListener("submit", (event) => {
  event.preventDefault(); // form의 기본 submit 동작을 막습니다.
  // 막지 않으면 페이지가 새로고침되거나 새 페이지르 이동함
  // 실행중인 JS코드가 중단될 가능성이 있으므로 필요한 코드

  // input[name="nickname"]은 name 속성이 nickname인 첫 번째 input 요소 선택
  var nickname = document.querySelector('input[name="nickname"]').value;
  var email = document.querySelector('input[name="email"]').value;
  var password = document.querySelector('input[name="password"]').value;

  // 서버에게 POST 요청을 보냅니다.
  axios
    .post("/register_process", {
      nickname: nickname,
      email: email,
      password: password,
    })
    .then((response) => {
      if (response.data.success) {
        alert("회원가입을 축하합니다!" + response.data.message);
        window.location.href = "/login"; // 로그인 페이지로 이동
      } else {
        alert("회원가입 중 오류가 발생했습니다: " + response.data.message);
      }
    })
    .catch((error) => {
      console.log(error);
    });
});
