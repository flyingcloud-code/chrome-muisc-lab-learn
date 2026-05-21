export const experiments = [
  {
    slug: 'shared-piano',
    title: 'Shared Piano',
    color: '#f7b731',
    summary: '多人共享钢琴的本地版：用一排宽键盘即时弹奏，并切换不同合成音色。',
    concept: '协作、琴键、即时演奏',
  },
  {
    slug: 'song-maker',
    title: 'Song Maker',
    color: '#26a69a',
    summary: '用时间和音高组成的彩色网格创作旋律，再用底部鼓轨添加节奏。',
    concept: '网格作曲、循环、分享感',
  },
  {
    slug: 'rhythm',
    title: 'Rhythm',
    color: '#ec407a',
    summary: '把鼓机变成三个可爱打击乐角色，点击节拍格后循环播放节奏。',
    concept: '节拍、循环、角色动画',
  },
  {
    slug: 'spectrogram',
    title: 'Spectrogram',
    color: '#5c6bc0',
    summary: '把声音画成不断滚动的彩色频谱，让用户看见频率如何变化。',
    concept: '声音可视化、频率、时间',
  },
  {
    slug: 'sound-waves',
    title: 'Sound Waves',
    color: '#42a5f5',
    summary: '点击音符后让点阵像空气分子一样波动，观察声波传播。',
    concept: '波、传播、音高',
  },
  {
    slug: 'arpeggios',
    title: 'Arpeggios',
    color: '#ffca28',
    summary: '在彩色圆盘上选择根音，听和弦音被一个一个弹出的琶音。',
    concept: '和弦分解、圆盘、模式',
  },
  {
    slug: 'kandinsky',
    title: 'Kandinsky',
    color: '#66bb6a',
    summary: '在空白画布上画线条和形状，再把画面从左到右播放成声音。',
    concept: '绘画、声音映射、艺术',
  },
  {
    slug: 'voice-spinner',
    title: 'Voice Spinner',
    color: '#ffa726',
    summary: '用可拖拽圆盘模拟唱片旋转，改变声音播放的速度和方向。',
    concept: '录音隐喻、旋转、倒放',
  },
  {
    slug: 'harmonics',
    title: 'Harmonics',
    color: '#ab47bc',
    summary: '点击不同泛音条，听见同一个基频按整数倍扩展出的音高关系。',
    concept: '泛音、倍频、自然比例',
  },
  {
    slug: 'piano-roll',
    title: 'Piano Roll',
    color: '#ef5350',
    summary: '让预置乐句像自动钢琴卷帘一样滚动，音符经过播放线时响起。',
    concept: '时间轴、音长、多声部',
  },
  {
    slug: 'oscillators',
    title: 'Oscillators',
    color: '#29b6f6',
    summary: '选择 sine、square、triangle、sawtooth 波形，上下拖动改变频率。',
    concept: '波形、频率、合成器',
  },
  {
    slug: 'strings',
    title: 'Strings',
    color: '#8d6e63',
    summary: '拨动不同长度的弦，观察弦越短声音越高的物理关系。',
    concept: '弦长、振动、音高',
  },
  {
    slug: 'melody-maker',
    title: 'Melody Maker',
    color: '#7e57c2',
    summary: 'Song Maker 的极简旋律版：每一列选一个音，循环听见自己的旋律。',
    concept: '单声部旋律、步进、循环',
  },
  {
    slug: 'chords',
    title: 'Chords',
    color: '#26c6da',
    summary: '点击一个根音，同时听见大三和弦或小三和弦的三个音。',
    concept: '和弦、三度、五度',
  },
];

export function findExperiment(slug) {
  return experiments.find((item) => item.slug === slug);
}
