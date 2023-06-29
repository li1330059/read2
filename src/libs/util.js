export const getInitSpanMillis = function () {
  let ts = localStorage.getItem('tinit');
  if (ts == null || ts == 'null') {
    localStorage.setItem('tinit', Date.now());
    return 1;
  }
  return Date.now() - ts;
}

export const getLocalPid = function () {
  return localStorage.getItem('pid') || '';
}

export const getConstGradeList = function () {
  return [
    { name: "小一上 (0起点)", value: "X1s" },
    { name: "小一下", value: "X1x" },
    { name: "小二上", value: "X2s" },
    { name: "小二下", value: "X2x" },
    { name: "小三上", value: "X3s" },
    { name: "小三下", value: "X3x" },
    { name: "小四上", value: "X4s" },
    { name: "小四下", value: "X4x" },
    { name: "小五上", value: "X5s" },
    { name: "小五下", value: "X5x" },
    { name: "小六上", value: "X6s" },
    { name: "小六下", value: "X6x" },
    { name: "初一上", value: "C1s" },
    { name: "初一下", value: "C1x" },
    { name: "初二上", value: "C2s" },
    { name: "初二下", value: "C2x" },
    { name: "初三上", value: "C3s" },
    { name: "初三下", value: "C3x" },
    { name: "高一上", value: "G1s" },
    { name: "高一下", value: "G1x" },
    { name: "高二上", value: "G2s" },
    { name: "高二下", value: "G2x" },
    { name: "高三上", value: "G3s" },
    { name: "高三下", value: "G3x" },
    { name: "大一上", value: "B1s" },
    { name: "大一下", value: "B1x" },
    { name: "大二上", value: "B2s" },
    { name: "大二下", value: "B2x" },
    { name: "大三上", value: "B3s" },
    { name: "大三下", value: "B3x" },
    { name: "大四上", value: "B4s" },
    { name: "大四下", value: "B4x" },
    { name: "研一上", value: "Y1s" },
    { name: "研一下", value: "Y1x" },
    { name: "研二上", value: "Y2s" },
    { name: "研二下", value: "Y2x" },
    { name: "研三上", value: "Y3s" },
    { name: "研三下", value: "Y3x" },
    { name: "研四上", value: "Y4s" },
    { name: "研四下", value: "Y4x" },
  ];
}
export function getQueryVariable(variable) {
  var query = window.location.search.substring(1);
  var vars = query.split("&");
  for (var i = 0; i < vars.length; i++) {
    var pair = vars[i].split("=");
    if (pair[0] == variable) { return pair[1]; }
  }
  return (false);
}