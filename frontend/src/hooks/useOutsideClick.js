import { useEffect, useRef } from "react";
function useOutsideClick(handeler, listenCapture = true) {
  const ref = useRef();
  useEffect(
    function () {
      function handleClick(e) {
        if (ref.current && !ref.current.contains(e.target)) {
          handeler();
        }
      }
      document.addEventListener("click", handleClick, listenCapture);

      return () => removeEventListener("click", handleClick, listenCapture);
    },
    [handeler, listenCapture]
  );
  return ref;
}

export default useOutsideClick;
