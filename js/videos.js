/* 视频库 - 使用公开示例视频，可直接播放 */
const VIDEO_BASE = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/';
const IMG_BASE = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/';

const VIDEOS = [
  {
    id: 'v1',
    title: '【教程】Python入门到精通 - 编程基础',
    category: '知识',
    up: '编程小能手',
    views: '123.4万',
    danmaku: '12.3万',
    date: '2024-08-15',
    duration: '09:56',
    wide: true,
    tags: ['原创', '教程'],
    src: VIDEO_BASE + 'ForBiggerBlazes.mp4',
    poster: IMG_BASE + 'ForBiggerBlazes.jpg',
    desc: '从零开始学习 Python 编程，涵盖变量、函数、面向对象等核心知识。',
    related: ['v2', 'v3', 'v6']
  },
  {
    id: 'v2',
    title: '【原神】新版本攻略与角色解析',
    category: '游戏',
    up: '原神情报局',
    views: '128.5万',
    danmaku: '8.2万',
    date: '2024-08-10',
    duration: '15:00',
    tags: ['游戏', '攻略'],
    src: VIDEO_BASE + 'ForBiggerEscapes.mp4',
    poster: IMG_BASE + 'ForBiggerEscapes.jpg',
    desc: '最新版本活动、深渊配队与角色强度分析。',
    related: ['v1', 'v4', 'v5']
  },
  {
    id: 'v3',
    title: 'Vue3 全家桶实战项目讲解',
    category: '知识',
    up: '前端研习社',
    views: '86.2万',
    danmaku: '5.6万',
    date: '2024-07-28',
    duration: '00:15',
    tags: ['前端', 'Vue'],
    src: VIDEO_BASE + 'ForBiggerFun.mp4',
    poster: IMG_BASE + 'ForBiggerFun.jpg',
    desc: 'Vue3 + Vite + Pinia 搭建完整单页应用。',
    related: ['v1', 'v6', 'v8']
  },
  {
    id: 'v4',
    title: '美食探店：山间地道风味',
    category: '生活',
    up: '山间美味',
    views: '58.3万',
    danmaku: '3.1万',
    date: '2024-07-20',
    duration: '00:15',
    tags: ['美食', 'vlog'],
    src: VIDEO_BASE + 'ForBiggerJoyrides.mp4',
    poster: IMG_BASE + 'ForBiggerJoyrides.jpg',
    desc: '深入山野，探访当地特色小吃与农家菜。',
    related: ['v2', 'v5', 'v9']
  },
  {
    id: 'v5',
    title: '国创动画推荐 TOP10',
    category: '动画',
    up: '动画情报站',
    views: '314.2万',
    danmaku: '18.9万',
    date: '2024-07-15',
    duration: '52:00',
    wide: true,
    tags: ['合集', '国创'],
    src: VIDEO_BASE + 'BigBuckBunny.mp4',
    poster: IMG_BASE + 'BigBuckBunny.jpg',
    desc: '盘点近年优质国产动画作品，附观看导引。',
    related: ['v2', 'v7', 'v10']
  },
  {
    id: 'v6',
    title: '数据分析实战：Pandas 技巧',
    category: '科技',
    up: '数据科学堂',
    views: '167.8万',
    danmaku: '9.4万',
    date: '2024-07-10',
    duration: '10:53',
    tags: ['数据分析'],
    src: VIDEO_BASE + 'ElephantsDream.mp4',
    poster: IMG_BASE + 'ElephantsDream.jpg',
    desc: 'Pandas 数据处理常用技巧与案例演示。',
    related: ['v1', 'v3', 'v8']
  },
  {
    id: 'v7',
    title: '科幻短片：钢铁之泪',
    category: '影视',
    up: '影视精选',
    views: '92.1万',
    danmaku: '6.7万',
    date: '2024-06-30',
    duration: '12:14',
    tags: ['科幻', '短片'],
    src: VIDEO_BASE + 'TearsOfSteel.mp4',
    poster: IMG_BASE + 'TearsOfSteel.jpg',
    desc: '高质量开源科幻短片，视觉特效精彩。',
    related: ['v5', 'v10', 'v2']
  },
  {
    id: 'v8',
    title: 'React Hooks 深度解析',
    category: '知识',
    up: '编程小能手',
    views: '92.4万',
    danmaku: '4.2万',
    date: '2024-06-25',
    duration: '00:15',
    tags: ['React', '教程'],
    src: VIDEO_BASE + 'ForBiggerMeltdowns.mp4',
    poster: IMG_BASE + 'ForBiggerMeltdowns.jpg',
    desc: 'useState、useEffect、自定义 Hook 实战。',
    related: ['v1', 'v3', 'v6']
  },
  {
    id: 'v9',
    title: '户外自驾：公路旅行 VLOG',
    category: '生活',
    up: '旅行日记',
    views: '45.6万',
    danmaku: '2.8万',
    date: '2024-06-20',
    duration: '00:15',
    tags: ['旅行'],
    src: VIDEO_BASE + 'SubaruOutbackOnStreetAndDirt.mp4',
    poster: IMG_BASE + 'SubaruOutbackOnStreetAndDirt.jpg',
    desc: '周末自驾出游，分享路线与风景。',
    related: ['v4', 'v2', 'v10']
  },
  {
    id: 'v10',
    title: '独立动画：Sintel 完整版',
    category: '动画',
    up: '动画殿堂',
    views: '256.3万',
    danmaku: '15.2万',
    date: '2024-06-15',
    duration: '14:48',
    tags: ['经典', '动画'],
    src: VIDEO_BASE + 'Sintel.mp4',
    poster: IMG_BASE + 'Sintel.jpg',
    desc: 'Blender 基金会经典开源动画电影。',
    related: ['v5', 'v7', 'v9']
  }
];

const CATEGORIES = ['全部', '首页', '动画', '番剧', '国创', '音乐', '舞蹈', '游戏', '知识', '科技', '生活', '鬼畜', '时尚', '娱乐', '影视'];

const GUIDE_MAP = {
  '📁': '知识', '🎮': '游戏', '🧭': '生活', '📍': '生活',
  '🛡️': '科技', '💬': '娱乐', '🏠': '生活', '🎬': '影视', '⏰': '动画'
};

function getVideo(id) {
  return VIDEOS.find(v => v.id === id) || VIDEOS[0];
}

function formatDuration(sec) {
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}
