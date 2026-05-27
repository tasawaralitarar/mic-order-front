import { useState, useEffect } from "react";

function McdOrderFront() {

  const [screen, setScreen] = useState("settings");
  const [serverUrl, setServerUrl] = useState("");
  const [terminalNo, setTerminalNo] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [selectedItems, setSelectedItems] = useState({});
  const [orderNo, setOrderNo] = useState("");

  // true = mock
  // false = real backend API
  const useMock = false;

  const menus = [
    {
      id: 1,
      name: "ハンバーガー",
      price: 200,
      image: "/images/hb2.png",
      description: "定番のハンバーガー"
    },
    {
      id: 2,
      name: "チーズバーガー",
      price: 250,
      image: "/images/cb1.png",
      description: "チーズ入り"
    },
    {
      id: 3,
      name: "ポテト",
      price: 180,
      image: "/images/potato3.png",
      description: "人気サイドメニュー"
    }
  ];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [screen]);

  return (
    <div>

      <h1>アリタサワルハンバーガー屋さん</h1>

      {/* SETTINGS */}
      {screen === "settings" && (
        <div>

          <h2>初期設定画面</h2>

          <input
            value={serverUrl}
            onChange={(e) => setServerUrl(e.target.value)}
            placeholder="http://localhost:8080"
          />

          <input
            value={terminalNo}
            onChange={(e) => setTerminalNo(e.target.value)}
            placeholder="25S01"
          />

          <button
            onClick={() => {

              if (!serverUrl || !terminalNo) {

                setErrorMessage("入力してください");
                setScreen("error");
                return;
              }

              if (
                !serverUrl.startsWith("http://") &&
                !serverUrl.startsWith("https://")
              ) {

                setErrorMessage("URLエラー");
                setScreen("error");
                return;
              }

              localStorage.setItem("serverUrl", serverUrl);
              localStorage.setItem("terminalNo", terminalNo);

              setScreen("menu");
            }}
          >
            設定する
          </button>

        </div>
      )}

      {/* MENU */}
      {screen === "menu" && (
        <div>

          <h2>メニュー選択画面</h2>

          {menus.map((menu) => (

            <div
              key={menu.id}
              style={{
                border: "1px solid gray",
                margin: 10,
                padding: 10
              }}
            >

              <img
                src={menu.image}
                width="120"
                alt={menu.name}
              />

              <h3>{menu.name}</h3>

              <p>{menu.description}</p>

              <p>{menu.price}円</p>

              {!selectedItems[menu.id] ? (

                <button
                  onClick={() =>
                    setSelectedItems({
                      ...selectedItems,
                      [menu.id]: 1
                    })
                  }
                >
                  選択
                </button>

              ) : (

                <div>

                  <p>
                    数量: {selectedItems[menu.id]}
                  </p>

                  <button
                    onClick={() => {

                      if (selectedItems[menu.id] < 5) {

                        setSelectedItems({
                          ...selectedItems,
                          [menu.id]:
                            selectedItems[menu.id] + 1
                        });
                      }
                    }}
                  >
                    ＋
                  </button>

                  <button
                    onClick={() => {

                      if (selectedItems[menu.id] > 1) {

                        setSelectedItems({
                          ...selectedItems,
                          [menu.id]:
                            selectedItems[menu.id] - 1
                        });
                      }
                    }}
                  >
                    −
                  </button>

                  <button
                    onClick={() => {

                      const updated = {
                        ...selectedItems
                      };

                      delete updated[menu.id];

                      setSelectedItems(updated);
                    }}
                  >
                    選択解除
                  </button>

                </div>
              )}

            </div>
          ))}

          <button
            onClick={() => {

              if (
                Object.keys(selectedItems).length === 0
              ) {

                setErrorMessage(
                  "メニューを選択してください"
                );

                setScreen("error");

                return;
              }

              setScreen("confirm");
            }}
          >
            注文確認
          </button>

        </div>
      )}

      {/* CONFIRM */}
      {screen === "confirm" && (
        <div>

          <h2>注文確認画面</h2>

          {menus
            .filter((m) => selectedItems[m.id])
            .map((m) => (

              <div
                key={m.id}
                style={{
                  border: "1px solid gray",
                  margin: 10,
                  padding: 10
                }}
              >

                <img
                  src={m.image}
                  alt={m.name}
                  width="120"
                  onError={(e) => {
                    e.target.style.display = "none";
                  }}
                />

                <p>メニュー: {m.name}</p>

                <p>単価: {m.price}円</p>

                <p>
                  数量: {selectedItems[m.id]}
                </p>

                <p>
                  小計:
                  {" "}
                  {m.price * selectedItems[m.id]}円
                </p>

              </div>
            ))}

          <h3>

            合計:

            {" "}

            {menus
              .filter((m) => selectedItems[m.id])
              .reduce(
                (sum, m) =>
                  sum +
                  m.price * selectedItems[m.id],
                0
              )}

            円

          </h3>

          <button
            onClick={() => {

              const orderItems = menus
                .filter((m) => selectedItems[m.id])
                .map((m) => ({
                  menuName: m.name,
                  unitPrice: m.price,
                  quantity: selectedItems[m.id]
                }));

              const totalAmount =
                orderItems.reduce(
                  (sum, item) =>
                    sum +
                    item.unitPrice * item.quantity,
                  0
                );

              const orderData = {
                terminalNo:
                  localStorage.getItem(
                    "terminalNo"
                  ),

                messageType:
                  "ORDER_CONFIRM",

                totalAmount,

                items: orderItems
              };

              const baseUrl =
                localStorage
                  .getItem("serverUrl")
                  .replace(/\/$/, "");

              const apiUrl =
                `${baseUrl}/api/orders`;

              // MOCK MODE
              if (useMock) {

                console.log(
                  "===== Mock API送信開始 ====="
                );

                console.log(
                  "送信先URL",
                  apiUrl
                );

                console.log(
                  "HTTPメソッド",
                  "POST"
                );

                console.log(
                  "送信JSON\n",
                  JSON.stringify(
                    orderData,
                    null,
                    2
                  )
                );

                console.log(
                  "===== Mock API送信終了 ====="
                );

                setOrderNo(
                  "MOCK-" +
                  Date.now()
                    .toString()
                    .slice(-6)
                );

                setScreen("complete");

              } else {

                // REAL API

                fetch(apiUrl, {

                  method: "POST",

                  headers: {
                    "Content-Type":
                      "application/json"
                  },

                  body: JSON.stringify(
                    orderData
                  )

                })
                  .then((res) => res.json())

                  .then((data) => {

                    console.log(
                      "API Response",
                      data
                    );

                    setOrderNo(
                      data.orderNo
                    );

                    setScreen(
                      "complete"
                    );
                  })

                  .catch((err) => {

                    console.error(err);

                    setErrorMessage(
                      "通信エラー"
                    );

                    setScreen("error");
                  });
              }
            }}
          >
            注文確定
          </button>

        </div>
      )}

      {/* COMPLETE */}
      {screen === "complete" && (
        <div>

          <h2>注文完了画面</h2>

          <h3>
            注文番号: {orderNo}
          </h3>

          <p>
            ご注文ありがとうございます
          </p>

        </div>
      )}

      {/* ERROR */}
      {screen === "error" && (
        <div>

          <h2>エラー画面</h2>

          <p>{errorMessage}</p>

          <button
            onClick={() =>
              setScreen("settings")
            }
          >
            初期設定へ戻る
          </button>

        </div>
      )}

    </div>
  );
}

export default McdOrderFront;