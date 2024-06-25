// document.querySelectorAll()을 사용해야 모든 요소에 적용됨
// document.querySelectorAll()은 NodeList를 반환-> 반복문으로 각각 적용해야 함

// document.querySelector(".create").addEventListener("click", () => {
//   location.href = "/create";
// });
// document.querySelector(".update").addEventListener("click", () => {
//   location.href = "/update";
// });

// 위의 코드는 작동이 완전하지 않음
// (여러 개의 이벤트 핸들러가 있을 때) 오류 발생
// DOM이 완전히 로드되지 않았을 때 실행이 됨

// 이 스크립트는 DOM이 완전히 로드된 후에 실행되어야 함
// DOMContentLoaded 이벤트 핸들러 내부에서
// .create와 .update 클래스를 가진 요소를 찾아 클릭 이벤트 핸들러를 등록
// DOMContentLoaded 이벤트는 페이지의 DOM이 완전히 로드된 후에 발생하기에 작동

document.addEventListener("DOMContentLoaded", () => {
  document.querySelector(".create").addEventListener("click", () => {
    location.href = "/create";
  });
});
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("deleteForm").addEventListener("submit", (event) => {
    event.preventDefault();
    Swal.fire({
      title: "이 글을 삭제하시겠습니까?",
      text: "이 작업은 되돌릴 수 없습니다!",
      icon: "warning",
      showCancelButton: true,
      cancelButtonColor: "#d33",
      confirmButtonText: "네, 진행합니다!",
      confirmButtonColor: "#3085d6",
    }).then((result) => {
      if (result.isConfirmed) {
        document.getElementById("deleteForm").submit();
      }
    });
  });
});
