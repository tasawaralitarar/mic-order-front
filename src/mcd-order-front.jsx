import { useState, useEffect } from "react";

function McdOrderFront() {
  const [screen, setScreen] = useState("settings");

  const [serverUrl, setServerUrl] = useState("");

  const [terminalNo, setTerminalNo] = useState("");

  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [screen]);

  return (
    <div>
      <h1>アリタサワルハンバーガー屋さん</h1>

      {screen === "settings" && (
        <div>
          <h2>初期設定画面</h2>

          <div>
            <p>接続先IPアドレス</p>

            <input
              type="text"
              value={serverUrl}
              onChange={(e) => setServerUrl(e.target.value)}
              placeholder="http://localhost:8080"
            />
          </div>

          <div>
            <p>端末番号</p>

            <input
              type="text"
              value={terminalNo}
              onChange={(e) => setTerminalNo(e.target.value)}
              placeholder="25s99-1"
            />
          </div>

          <button
            onClick={() => {
              if (!serverUrl) {
                setErrorMessage(
                  "接続先IPアドレスを入力してください"
                );

                setScreen("error");

                return;
              }

              if (!terminalNo) {
                setErrorMessage(
                  "端末番号を入力してください"
                );

                setScreen("error");

                return;
              }

              if (
                !serverUrl.startsWith("http://") &&
                !serverUrl.startsWith("https://")
              ) {
                setErrorMessage(
                  "URLは http:// または https:// から始めてください"
                );

                setScreen("error");

                return;
              }

              localStorage.setItem(
                "serverUrl",
                serverUrl
              );

              localStorage.setItem(
                "terminalNo",
                terminalNo
              );

              setScreen("menu");
            }}
          >
            設定する
          </button>
        </div>
      )}

      {screen === "menu" && (
        <div>
          <h2>メニュー選択画面</h2>

          <button
            onClick={() => setScreen("confirm")}
          >
            注文確認
          </button>
        </div>
      )}

      {screen === "confirm" && (
        <div>
          <h2>注文確認画面</h2>

          <button
            onClick={() => setScreen("complete")}
          >
            注文確定
          </button>
        </div>
      )}

      {screen === "complete" && (
        <div>
          <h2>注文完了画面</h2>
        </div>
      )}

      {screen === "error" && (
        <div>
          <h2>エラー画面</h2>

          <p>{errorMessage}</p>

          <button
            onClick={() => setScreen("settings")}
          >
            初期設定画面へ戻る
          </button>
        </div>
      )}
    </div>
  );
}

export default McdOrderFront;