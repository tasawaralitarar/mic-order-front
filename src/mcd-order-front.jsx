import { useState, useEffect } from "react";

function McdOrderFront() {
  const [screen, setScreen] = useState("settings");

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [screen]);

  return (
    <div>
      <h1>〇〇ハンバーガー屋さん</h1>

      {screen === "settings" && (
        <div>
          <h2>初期設定画面</h2>

          <button onClick={() => setScreen("menu")}>
            設定する
          </button>
        </div>
      )}

      {screen === "menu" && (
        <div>
          <h2>メニュー選択画面</h2>

          <button onClick={() => setScreen("confirm")}>
            注文確認
          </button>
        </div>
      )}

      {screen === "confirm" && (
        <div>
          <h2>注文確認画面</h2>

          <button onClick={() => setScreen("complete")}>
            注文確定
          </button>
        </div>
      )}

      {screen === "complete" && (
        <div>
          <h2>注文完了画面</h2>
        </div>
      )}
    </div>
  );
}

export default McdOrderFront;