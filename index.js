// 引用 line bot SDK
let linebot = require('linebot');
const fetch = require('node-fetch')

// 初始化 line bot 需要的資訊，在 Heroku 上的設定的 Config Vars，可參考 Step2
// let bot = linebot({
//     channelId: process.env.LINE_CH_ID,
//     channelSecret: process.env.LINE_CH_SECRET,
//     channelAccessToken: process.env.LINE_ACCESS_TOKEN
// });

console.log('檢測變數', process.env.LINE_CH_ID, process.env.LINE_CH_SECRET, process.env.LINE_ACCESS_TOKEN)

let bot = linebot({
    channelId: '1655016363',
    channelSecret: '3daaba3801a47b66f9aea349af7999e8',
    channelAccessToken: 'DO8nAW3G4XSbMzmzflnh68fY1VVIcNLMtJ24nl1XYq28PFnTYV6tPp1qS8vrn9CECSI9034it8tc3gXQI4Upn1Zx/qwwAfCqmwpBcuK0KZtx8n1g5mU/rRhbwAXCuEVg8wDHUVMY/R+GqXBgU9XtugdB04t89/1O/w1cDnyilFU='

});


const token = 'DO8nAW3G4XSbMzmzflnh68fY1VVIcNLMtJ24nl1XYq28PFnTYV6tPp1qS8vrn9CECSI9034it8tc3gXQI4Upn1Zx/qwwAfCqmwpBcuK0KZtx8n1g5mU/rRhbwAXCuEVg8wDHUVMY/R+GqXBgU9XtugdB04t89/1O/w1cDnyilFU='



//TODO環境參數調整
// 當有人傳送訊息給Bot時
bot.on('message', function (event) {
    // 約定字串
    const reg = /^(F|f)t./
    // event.message.text是使用者傳給bot的訊息
    const { message, source } = event
    if (!reg.test(message.text)) return
    const reverse = /[^(F|f)t\s]/
    const digestMsg = message.text.replace(reg, '')
    // convert id to name
    fetch(`https://api.line.me/v2/bot/profile/${source.userId}`, { headers: { 'Authorization': `Bearer ${token}` } })
        .then(res => res.json())
        .then(body => {
            const { displayName } = body
            sendSlack(displayName)
        })

    const sendSlack = displayName => {
        const data = JSON.stringify({ text: `${displayName} says, ${digestMsg}` })
        fetch('https://hooks.slack.com/services/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', { method: 'POST', body: data })
            .then(res => res.text())
            .then(body => {
                replayToLine(`已經轉達給前端`)
            })

    }
    function replayToLine(replyMsg) {
        // 透過event.reply(要回傳的訊息)方法將訊息回傳給使用者
        event.reply(replyMsg).then(function (data) {
            console.log('here')
            // 當訊息成功回傳後的處理
        }).catch(function (error) {
            // 當訊息回傳失敗後的處理
        });
    }


});

// Bot 所監聽的 webhook 路徑與 port，heroku 會動態存取 port 所以不能用固定的 port，沒有的話用預設的 port 5000
bot.listen('/', process.env.PORT || 5000, function () {
    console.log('前端小幫手上線啦！！');
});