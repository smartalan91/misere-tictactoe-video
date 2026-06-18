/** 全片共用的配色與字型設定（對齊 PDF：A=紅、B=藍） */
export const FONT = 'Microsoft JhengHei, "Noto Sans TC", "PingFang TC", sans-serif';

export const COLORS = {
  bg: '#11151f',
  panel: '#1b2030',
  gridLine: '#5b6478',
  text: '#f2f4f8',
  textDim: '#9aa3b5',
  alice: '#e74c3c', // A 先手 紅
  bob: '#3498db', // B 後手 藍
  aliceSoft: '#e74c3c33',
  bobSoft: '#3498db33',
  line: '#ff5252', // 連線高亮
  arrow: '#2ecc71', // 對稱箭頭 綠
  accent: '#f1c40f', // 強調黃
  lose: '#ff5252',
  draw: '#2ecc71',
};

/** 給「分組」場景用的一組柔和配對色（每組兩格同色） */
export const GROUP_PALETTE = [
  '#e74c3c', '#3498db', '#2ecc71', '#f39c12', '#9b59b6', '#1abc9c',
  '#e67e22', '#16a085', '#8e44ad', '#27ae60', '#2980b9', '#c0392b',
];
