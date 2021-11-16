// 테스트 파일에서 app에 접근하기 위해서 index.js와 app.js로 분기
const app = require('./app');

app.listen(process.env.PORT, () => {
  console.log('Server is up on ' + process.env.PORT);
});
